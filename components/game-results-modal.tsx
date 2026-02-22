import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Share } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { PersonalBestBadge } from '@/components/personal-best-badge';
import { GameTracker } from '@/utils/game-tracker';
import { soundManager } from '@/utils/sound-manager';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface GameResultsModalProps {
  visible: boolean;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  onRestart: () => void;
  onHome: () => void;
  onNextGame?: () => void;
  color?: string;
  gameTitle?: string;
  gameId?: string;
  subject?: 'math' | 'science' | 'english';
}

export function GameResultsModal({
  visible,
  score,
  totalQuestions,
  correctAnswers,
  onRestart,
  onHome,
  onNextGame,
  color = '#FF6B6B',
  gameTitle = 'Game',
  gameId = 'unknown',
  subject = 'math',
}: GameResultsModalProps) {
  const scale = useSharedValue(0);
  const star1Scale = useSharedValue(0);
  const star2Scale = useSharedValue(0);
  const star3Scale = useSharedValue(0);
  const buttonScale = useSharedValue(0);

  const [showPersonalBest, setShowPersonalBest] = useState(false);
  const [previousBest, setPreviousBest] = useState(0);
  const [dataSaved, setDataSaved] = useState(false);

  const percentage = (correctAnswers / totalQuestions) * 100;
  const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : percentage >= 25 ? 1 : 0;

  useEffect(() => {
    if (visible && !dataSaved) {
      GameTracker.saveGameResult({
        gameId,
        gameName: gameTitle,
        subject,
        score,
        totalQuestions,
        correctAnswers,
        timestamp: Date.now(),
        completedSuccessfully: correctAnswers > 0,
      });
      setDataSaved(true);
    }
    
    if (!visible) {
      setDataSaved(false);
    }
    
    if (visible && score > previousBest) {
      setShowPersonalBest(true);
      setPreviousBest(score);
    }
  }, [visible, score, dataSaved]);

  useEffect(() => {
    if (visible) {
      const soundType = percentage >= 80 ? 'celebration' : percentage >= 50 ? 'achievement' : 'coin';
      soundManager.playSound(soundType);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      
      star1Scale.value = withDelay(300, withSequence(
        withSpring(1.3, { damping: 8 }),
        withSpring(1, { damping: 10 })
      ));
      
      if (stars >= 2) {
        star2Scale.value = withDelay(500, withSequence(
          withSpring(1.3, { damping: 8 }),
          withSpring(1, { damping: 10 })
        ));
      }
      
      if (stars >= 3) {
        star3Scale.value = withDelay(700, withSequence(
          withSpring(1.3, { damping: 8 }),
          withSpring(1, { damping: 10 })
        ));
      }

      buttonScale.value = withDelay(900, withSpring(1, { damping: 10 }));
    } else {
      scale.value = 0;
      star1Scale.value = 0;
      star2Scale.value = 0;
      star3Scale.value = 0;
      buttonScale.value = 0;
    }
  }, [visible, stars]);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const star1Style = useAnimatedStyle(() => ({
    transform: [{ scale: star1Scale.value }],
  }));

  const star2Style = useAnimatedStyle(() => ({
    transform: [{ scale: star2Scale.value }],
  }));

  const star3Style = useAnimatedStyle(() => ({
    transform: [{ scale: star3Scale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const getMessage = () => {
    if (percentage >= 80) return '🎉 Amazing Work!';
    if (percentage >= 50) return '👍 Good Job!';
    if (percentage >= 25) return '💪 Keep Trying!';
    return '🌟 Practice Makes Perfect!';
  };

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `🎉 I just scored ${score} points in ${gameTitle}! I got ${correctAnswers} out of ${totalQuestions} correct! ${stars === 3 ? '⭐⭐⭐' : stars === 2 ? '⭐⭐' : stars === 1 ? '⭐' : ''}\n\nPlay Learn With Fun to test your skills!`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, modalStyle]}>
          <View style={[styles.modalHeader, { backgroundColor: color }]}>
            <ThemedText style={styles.headerText}>{getMessage()}</ThemedText>
          </View>

          <View style={styles.modalContent}>
            <ThemedText style={styles.gameTitle}>{gameTitle}</ThemedText>
            
            <PersonalBestBadge show={showPersonalBest} score={score} color="#FFD93D" />
            
            <View style={[styles.starsCard, { backgroundColor: color + '10' }]}>
              <View style={styles.starsContainer}>
                <Animated.View style={star1Style}>
                  <ThemedText style={[styles.starEmoji, stars >= 1 && styles.starEarned]}>
                    {stars >= 1 ? '⭐' : '☆'}
                  </ThemedText>
                </Animated.View>
                <Animated.View style={star2Style}>
                  <ThemedText style={[styles.starEmoji, stars >= 2 && styles.starEarned]}>
                    {stars >= 2 ? '⭐' : '☆'}
                  </ThemedText>
                </Animated.View>
                <Animated.View style={star3Style}>
                  <ThemedText style={[styles.starEmoji, stars >= 3 && styles.starEarned]}>
                    {stars >= 3 ? '⭐' : '☆'}
                  </ThemedText>
                </Animated.View>
              </View>
              <ThemedText style={styles.performanceText}>
                {percentage >= 80 ? 'Outstanding!' : 
                 percentage >= 50 ? 'Well Done!' : 
                 percentage >= 25 ? 'Good Effort!' : 
                 'Keep Learning!'}
              </ThemedText>
            </View>

            <View style={styles.statsContainer}>
              <View style={[styles.statBox, { backgroundColor: color + '15' }]}>
                <ThemedText style={styles.statEmoji}>🎯</ThemedText>
                <ThemedText style={[styles.statValue, { color }]}>{score}</ThemedText>
                <ThemedText style={styles.statLabel}>Points</ThemedText>
              </View>
              <View style={[styles.statBox, { backgroundColor: color + '15' }]}>
                <ThemedText style={styles.statEmoji}>✅</ThemedText>
                <ThemedText style={[styles.statValue, { color }]}>
                  {correctAnswers}/{totalQuestions}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Correct</ThemedText>
              </View>
              <View style={[styles.statBox, { backgroundColor: color + '15' }]}>
                <ThemedText style={styles.statEmoji}>📊</ThemedText>
                <ThemedText style={[styles.statValue, { color }]}>{percentage.toFixed(0)}%</ThemedText>
                <ThemedText style={styles.statLabel}>Accuracy</ThemedText>
              </View>
            </View>

            <View style={styles.messageContainer}>
              <ThemedText style={styles.encouragementText}>
                {percentage >= 80 ? 'You\'re a superstar learner!' :
                 percentage >= 50 ? 'Great effort! Keep learning!' :
                 percentage >= 25 ? 'You\'re getting better!' :
                 'Every mistake is a step to success!'}
              </ThemedText>
            </View>

            <Animated.View style={[styles.buttonsContainer, buttonStyle]}>
              <TouchableOpacity
                style={[styles.button, styles.restartButton, { backgroundColor: color }]}
                onPress={() => {
                  soundManager.playSound('click');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onRestart();
                }}
              >
                <ThemedText style={styles.buttonIcon}>🔄</ThemedText>
                <ThemedText style={styles.buttonText}>Play Again</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.homeButton]}
                onPress={() => {
                  soundManager.playSound('whoosh');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onHome();
                }}
              >
                <ThemedText style={styles.buttonIcon}>🏠</ThemedText>
                <ThemedText style={styles.buttonTextDark}>Home</ThemedText>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.secondaryButtonsContainer, buttonStyle]}>
              {onNextGame && percentage >= 50 && (
                <TouchableOpacity
                  style={[styles.button, styles.nextButton, { borderColor: color }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onNextGame();
                  }}
                >
                  <ThemedText style={[styles.buttonTextDark, { color }]}>Next Challenge</ThemedText>
                  <ThemedText style={styles.buttonIcon}>➡️</ThemedText>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.shareButton, { backgroundColor: color + '20', borderColor: color }]}
                onPress={handleShare}
              >
                <ThemedText style={styles.buttonIcon}>📤</ThemedText>
                <ThemedText style={[styles.buttonTextDark, { color }]}>Share</ThemedText>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.tipsContainer}>
              <ThemedText style={styles.tipsTitle}>💡 Quick Tip:</ThemedText>
              <ThemedText style={styles.tipsText}>
                {percentage >= 80 ? 'Try the next game to earn more stickers!' :
                 percentage >= 50 ? 'Practice makes perfect! Try again for a higher score!' :
                 'Take your time and read each question carefully!'}
              </ThemedText>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContent: {
    padding: 24,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  starsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  performanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  starEmoji: {
    fontSize: 56,
    opacity: 0.3,
  },
  starEarned: {
    opacity: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  messageContainer: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD93D',
  },
  encouragementText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  restartButton: {
    backgroundColor: '#FF6B6B',
  },
  homeButton: {
    backgroundColor: '#F0F0F0',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  shareButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonTextDark: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tipsContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
