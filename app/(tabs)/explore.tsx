import { StyleSheet, ScrollView, View, TouchableOpacity, RefreshControl, TextInput, Modal } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StickerCollection } from '@/components/sticker-collection';
import { GameTracker, GameStats, GameResult } from '@/utils/game-tracker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const USER_NAME_KEY = '@learn_with_fun_username';

export default function ProgressScreen() {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [recentGames, setRecentGames] = useState<GameResult[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [newName, setNewName] = useState('');

  const loadData = async () => {
    const gameStats = await GameTracker.getStats();
    const recent = await GameTracker.getRecentGames(5);
    const savedName = await AsyncStorage.getItem(USER_NAME_KEY);
    setStats(gameStats);
    setRecentGames(recent);
    setUserName(savedName || '');
  };

  const handleEditName = () => {
    setNewName(userName);
    setShowNameEdit(true);
  };

  const handleSaveName = async () => {
    const trimmedName = newName.trim();
    if (trimmedName.length >= 2) {
      await AsyncStorage.setItem(USER_NAME_KEY, trimmedName);
      setUserName(trimmedName);
      setShowNameEdit(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const clearData = async () => {
    await GameTracker.clearAllData();
    await loadData();
  };
  const funFacts = [
    { emoji: '🦒', fact: 'Giraffes have the same number of neck bones as humans - just 7!' },
    { emoji: '🌈', fact: 'Rainbows are actually full circles, but we only see half from the ground!' },
    { emoji: '🐝', fact: 'Bees can recognize human faces!' },
    { emoji: '🌍', fact: 'Earth is the only planet not named after a god!' },
    { emoji: '🦋', fact: 'Butterflies can taste with their feet!' },
    { emoji: '🎨', fact: 'The word "alphabet" comes from the first two Greek letters: alpha and beta!' },
  ];

  const dailyFact = funFacts[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % funFacts.length];

  const achievementDefinitions = [
    { id: 'first_game', title: 'First Steps', emoji: '👣', description: 'Played your first game' },
    { id: '5_games', title: 'Getting Started', emoji: '🎮', description: 'Played 5 games' },
    { id: '10_games', title: 'Dedicated Learner', emoji: '📚', description: 'Played 10 games' },
    { id: '20_games', title: 'Learning Champion', emoji: '🏆', description: 'Played 20 games' },
    { id: '50_games', title: 'Super Student', emoji: '⭐', description: 'Played 50 games' },
    { id: 'first_perfect', title: 'Perfect Start', emoji: '💯', description: 'Got your first perfect score' },
    { id: '5_perfect', title: 'Excellence', emoji: '✨', description: '5 perfect scores' },
    { id: '10_perfect', title: 'Master', emoji: '👑', description: '10 perfect scores' },
    { id: 'math_star', title: 'Math Star', emoji: '🔢', description: 'Played 5 math games' },
    { id: 'science_explorer', title: 'Science Explorer', emoji: '🔬', description: 'Played 5 science games' },
    { id: 'word_wizard', title: 'Word Wizard', emoji: '📖', description: 'Played 5 English games' },
    { id: 'math_master', title: 'Math Master', emoji: '🧮', description: 'Played 10 math games' },
    { id: 'science_genius', title: 'Science Genius', emoji: '🧪', description: 'Played 10 science games' },
    { id: 'english_expert', title: 'English Expert', emoji: '✏️', description: 'Played 10 English games' },
    { id: 'memory_champion', title: 'Memory Champion', emoji: '🧠', description: 'Played 5 memory games' },
    { id: 'speed_master', title: 'Speed Master', emoji: '⚡', description: 'Played 5 speed games' },
  ];

  const earnedAchievements = achievementDefinitions.filter(a => 
    stats?.achievements.includes(a.id)
  );

  const stickers = earnedAchievements.map((a, i) => ({
    id: a.id,
    emoji: a.emoji,
    name: a.title,
    earned: true,
  }));

  const lockedStickers = achievementDefinitions
    .filter(a => !stats?.achievements.includes(a.id))
    .slice(0, 8 - stickers.length)
    .map(a => ({
      id: a.id,
      emoji: a.emoji,
      name: a.title,
      earned: false,
    }));

  const allStickers = [...stickers, ...lockedStickers].slice(0, 8);

  const statsDisplay = [
    { label: 'Games Played', value: stats?.totalGamesPlayed.toString() || '0', emoji: '🎮', color: '#FF6B6B' },
    { label: 'Questions Answered', value: stats?.totalQuestionsAnswered.toString() || '0', emoji: '❓', color: '#4ECDC4' },
    { label: 'Perfect Scores', value: stats?.perfectScores.toString() || '0', emoji: '💯', color: '#56C596' },
    { label: 'Learning Streak', value: stats ? `${stats.consecutiveDays} day${stats.consecutiveDays !== 1 ? 's' : ''}` : '0 days', emoji: '🔥', color: '#FFD93D' },
  ];

  if (!stats) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading your progress...</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Modal
        visible={showNameEdit}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameEdit(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.nameEditCard}>
            <MaterialCommunityIcons name="account-edit" size={48} color="#FFD93D" />
            <ThemedText style={styles.modalTitle}>Edit Your Name</ThemedText>
            <TextInput
              style={styles.nameInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter your name"
              maxLength={20}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setShowNameEdit(false)}
              >
                <ThemedText style={styles.modalCancelText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveButton} 
                onPress={handleSaveName}
              >
                <ThemedText style={styles.modalSaveText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LinearGradient
        colors={['#FFD93D', '#FFC107']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIconCircle}>
            <MaterialCommunityIcons name="trophy-award" size={40} color="#FFD93D" />
          </View>
          <ThemedText style={styles.headerTitle}>
            {userName ? `${userName}'s Progress` : 'Your Progress'}
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>Keep up the great work!</ThemedText>
          {userName && (
            <TouchableOpacity style={styles.editNameButton} onPress={handleEditName}>
              <MaterialCommunityIcons name="pencil" size={14} color="#FFFFFF" />
              <ThemedText style={styles.editNameText}>Edit Name</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerDecoration}>
          <View style={styles.decorativeCircleSmall} />
          <View style={styles.decorativeCircleLarge} />
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {stats.totalGamesPlayed === 0 ? (
          <View style={styles.noDataCard}>
            <MaterialCommunityIcons name="play-circle-outline" size={64} color="#999" />
            <ThemedText style={styles.noDataTitle}>Start Your Learning Journey!</ThemedText>
            <ThemedText style={styles.noDataText}>
              Play games to earn achievements, track progress, and collect stickers!
            </ThemedText>
          </View>
        ) : (
          <>
            <View style={styles.funFactCard}>
              <ThemedText style={styles.funFactTitle}>Fun Fact of the Day! {dailyFact.emoji}</ThemedText>
              <ThemedText style={styles.funFactText}>{dailyFact.fact}</ThemedText>
            </View>
            
            <StickerCollection stickers={allStickers} />

            {recentGames.length > 0 && (
              <View style={styles.recentGamesSection}>
                <ThemedText style={styles.sectionTitle}>Recent Games</ThemedText>
                {recentGames.map((game, idx) => (
                  <View key={idx} style={styles.recentGameCard}>
                    <View style={[styles.subjectBadge, { backgroundColor: 
                      game.subject === 'math' ? '#FF6B6B' :
                      game.subject === 'science' ? '#4ECDC4' : '#56C596'
                    }]}>
                      <MaterialCommunityIcons 
                        name={game.subject === 'math' ? 'calculator-variant' :
                              game.subject === 'science' ? 'flask' : 'book-alphabet'} 
                        size={18} 
                        color="#FFFFFF" 
                      />
                    </View>
                    <View style={styles.recentGameInfo}>
                      <ThemedText style={styles.recentGameTitle}>{game.gameName}</ThemedText>
                      <ThemedText style={styles.recentGameStats}>
                        {game.correctAnswers}/{game.totalQuestions} correct • {game.score} pts
                      </ThemedText>
                    </View>
                    <View style={styles.recentGameScore}>
                      <ThemedText style={styles.recentGamePercentage}>
                        {Math.round((game.correctAnswers / game.totalQuestions) * 100)}%
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.statsContainer}>
        {statsDisplay.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <ThemedText style={styles.statEmoji}>{stat.emoji}</ThemedText>
            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
          </View>
        ))}
      </View>

      {stats.totalGamesPlayed > 0 && (
        <View style={styles.achievementsSection}>
          <View style={styles.achievementsSectionHeader}>
            <ThemedText style={styles.sectionTitle}>Achievements</ThemedText>
            <View style={styles.achievementCountBadge}>
              <MaterialCommunityIcons name="trophy" size={16} color="#FFD93D" />
              <ThemedText style={styles.achievementCountText}>
                {stats.achievements.length}/{achievementDefinitions.length}
              </ThemedText>
            </View>
          </View>
          <View style={styles.achievementsGrid}>
            {achievementDefinitions.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !stats.achievements.includes(achievement.id) && styles.achievementLocked,
              ]}
            >
              <ThemedText style={[
                styles.achievementEmoji,
                !stats.achievements.includes(achievement.id) && styles.achievementEmojiLocked,
              ]}>
                {achievement.emoji}
              </ThemedText>
              <ThemedText style={[
                styles.achievementTitle,
                !stats.achievements.includes(achievement.id) && styles.achievementTextLocked,
              ]}>
                {achievement.title}
              </ThemedText>
              <ThemedText style={[
                styles.achievementDescription,
                !stats.achievements.includes(achievement.id) && styles.achievementTextLocked,
              ]}>
                {achievement.description}
              </ThemedText>
              {stats.achievements.includes(achievement.id) && (
                <View style={styles.earnedBadge}>
                  <MaterialCommunityIcons name="check-circle" size={16} color="#FFFFFF" />
                  <ThemedText style={styles.earnedText}>Earned!</ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
      )}

      {stats.totalGamesPlayed > 0 && (
        <View style={styles.motivationSection}>
          <ThemedText style={styles.motivationEmoji}>🌟</ThemedText>
          <ThemedText style={styles.motivationText}>
            You're doing amazing! Keep learning and having fun!
          </ThemedText>
        </View>
      )}

      {__DEV__ && stats.totalGamesPlayed > 0 && (
        <View style={styles.devSection}>
          <TouchableOpacity style={styles.clearDataButton} onPress={clearData}>
            <MaterialCommunityIcons name="delete" size={18} color="#FFFFFF" />
            <ThemedText style={styles.clearDataText}>Clear Progress (Dev Only)</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 36,
    paddingHorizontal: 20,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
    paddingVertical: 8,
  },
  headerIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'visible',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    paddingVertical: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 42,
    includeFontPadding: false,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 24,
    includeFontPadding: false,
    textAlign: 'center',
    paddingVertical: 2,
  },
  editNameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
  },
  editNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 18,
    includeFontPadding: false,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  nameEditCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 24,
  },
  nameInput: {
    width: '100%',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#F8F8F8',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#FFD93D',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  decorativeCircleSmall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    position: 'absolute',
    top: 30,
    right: 10,
  },
  decorativeCircleLarge: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    position: 'absolute',
    top: -30,
    right: -40,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  funFactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderLeftWidth: 6,
    borderLeftColor: '#FFD93D',
  },
  funFactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 12,
  },
  funFactText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    borderLeftWidth: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#999',
  },
  noDataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  noDataTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  recentGamesSection: {
    marginBottom: 20,
  },
  recentGameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    gap: 12,
  },
  subjectBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentGameInfo: {
    flex: 1,
  },
  recentGameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  recentGameStats: {
    fontSize: 13,
    color: '#666',
  },
  recentGameScore: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  recentGamePercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementsSection: {
    padding: 20,
  },
  achievementsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD93D',
  },
  achievementCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  achievementLocked: {
    backgroundColor: '#F0F0F0',
    opacity: 0.6,
  },
  achievementEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  achievementEmojiLocked: {
    opacity: 0.3,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  achievementTextLocked: {
    color: '#999',
  },
  earnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  earnedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  devSection: {
    padding: 20,
    paddingBottom: 40,
  },
  clearDataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  clearDataText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  motivationSection: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  motivationEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  motivationText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
});
