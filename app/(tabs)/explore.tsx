import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { StickerCollection } from '@/components/sticker-collection';

export default function ProgressScreen() {
  const funFacts = [
    { emoji: '🦒', fact: 'Giraffes have the same number of neck bones as humans - just 7!' },
    { emoji: '🌈', fact: 'Rainbows are actually full circles, but we only see half from the ground!' },
    { emoji: '🐝', fact: 'Bees can recognize human faces!' },
    { emoji: '🌍', fact: 'Earth is the only planet not named after a god!' },
    { emoji: '🦋', fact: 'Butterflies can taste with their feet!' },
    { emoji: '🎨', fact: 'The word "alphabet" comes from the first two Greek letters: alpha and beta!' },
  ];

  const dailyFact = funFacts[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % funFacts.length];

  const stickers = [
    { id: '1', emoji: '⭐', name: 'Math Star', earned: true },
    { id: '2', emoji: '🦁', name: 'Lion', earned: true },
    { id: '3', emoji: '🌟', name: 'Superstar', earned: true },
    { id: '4', emoji: '🎨', name: 'Artist', earned: false },
    { id: '5', emoji: '🚀', name: 'Rocket', earned: false },
    { id: '6', emoji: '🏆', name: 'Champion', earned: false },
    { id: '7', emoji: '🦋', name: 'Butterfly', earned: true },
    { id: '8', emoji: '🌈', name: 'Rainbow', earned: false },
  ];

  const achievements = [
    { id: 1, title: 'Math Star', emoji: '⭐', description: 'Completed 5 math games', earned: true },
    { id: 2, title: 'Science Explorer', emoji: '🔬', description: 'Learned about planets', earned: true },
    { id: 3, title: 'Word Wizard', emoji: '✨', description: 'Spelled 10 words correctly', earned: false },
    { id: 4, title: 'Counting Champion', emoji: '🏆', description: 'Counted to 100', earned: false },
    { id: 5, title: 'Animal Expert', emoji: '🦁', description: 'Learned 20 animals', earned: true },
    { id: 6, title: 'Alphabet Master', emoji: '🔤', description: 'Learned all letters', earned: false },
  ];

  const stats = [
    { label: 'Games Played', value: '12', emoji: '🎮', color: '#FF6B6B' },
    { label: 'Questions Answered', value: '45', emoji: '❓', color: '#4ECDC4' },
    { label: 'Perfect Scores', value: '8', emoji: '💯', color: '#56C596' },
    { label: 'Learning Streak', value: '3 days', emoji: '🔥', color: '#FFD93D' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Your Progress</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Keep up the great work!</ThemedText>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.funFactCard}>
          <ThemedText style={styles.funFactTitle}>Fun Fact of the Day! {dailyFact.emoji}</ThemedText>
          <ThemedText style={styles.funFactText}>{dailyFact.fact}</ThemedText>
        </View>
        
        <StickerCollection stickers={stickers} />
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <ThemedText style={styles.statEmoji}>{stat.emoji}</ThemedText>
            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.achievementsSection}>
        <ThemedText style={styles.sectionTitle}>Achievements</ThemedText>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.earned && styles.achievementLocked,
              ]}
            >
              <ThemedText style={[
                styles.achievementEmoji,
                !achievement.earned && styles.achievementEmojiLocked,
              ]}>
                {achievement.emoji}
              </ThemedText>
              <ThemedText style={[
                styles.achievementTitle,
                !achievement.earned && styles.achievementTextLocked,
              ]}>
                {achievement.title}
              </ThemedText>
              <ThemedText style={[
                styles.achievementDescription,
                !achievement.earned && styles.achievementTextLocked,
              ]}>
                {achievement.description}
              </ThemedText>
              {achievement.earned && (
                <View style={styles.earnedBadge}>
                  <ThemedText style={styles.earnedText}>Earned!</ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.motivationSection}>
        <ThemedText style={styles.motivationEmoji}>🌟</ThemedText>
        <ThemedText style={styles.motivationText}>
          You're doing amazing! Keep learning and having fun!
        </ThemedText>
      </View>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FFD93D',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
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
  achievementsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
