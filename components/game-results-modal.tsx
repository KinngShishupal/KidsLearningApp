import { useEffect, useState } from 'react';
import { Modal, ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AdBanner } from '@/components/ad-banner';
import { GameTracker } from '@/utils/game-tracker';
import { recordGameCompleted, showInterstitialIfDue } from '@/utils/ads';
import { soundManager } from '@/utils/sound-manager';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
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

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const easeOut = Easing.out(Easing.cubic);

/** Headline, badge icon and encouragement for each star level (0–3). */
const RESULT_LEVELS: { title: string; icon: IconName; message: string }[] = [
  { title: 'Nice Try!', icon: 'heart', message: 'Every mistake helps you learn. Take your time and try again!' },
  { title: 'Good Effort!', icon: 'thumb-up', message: "You're getting better! Play again to earn more stars." },
  { title: 'Great Job!', icon: 'medal', message: 'Well done! One more round for all three stars?' },
  { title: 'Amazing!', icon: 'trophy', message: "You're a superstar learner! Try the next challenge." },
];

function ResultStar({ earned, delay, size, visible }: { earned: boolean; delay: number; size: number; visible: boolean }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = visible ? withDelay(delay, withTiming(1, { duration: 300, easing: easeOut })) : 0;
  }, [visible]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={style}>
      <MaterialCommunityIcons
        name={earned ? 'star' : 'star-outline'}
        size={size}
        color={earned ? '#FFC93C' : '#D9D9E3'}
      />
    </Animated.View>
  );
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
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);
  const contentOpacity = useSharedValue(0);

  const [showPersonalBest, setShowPersonalBest] = useState(false);
  const [previousBest, setPreviousBest] = useState(0);
  const [dataSaved, setDataSaved] = useState(false);

  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : percentage >= 25 ? 1 : 0;
  const level = RESULT_LEVELS[stars];

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
      recordGameCompleted();
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

      cardOpacity.value = withTiming(1, { duration: 250, easing: easeOut });
      cardScale.value = withTiming(1, { duration: 250, easing: easeOut });
      contentOpacity.value = withDelay(700, withTiming(1, { duration: 300, easing: easeOut }));
    } else {
      cardOpacity.value = 0;
      cardScale.value = 0.95;
      contentOpacity.value = 0;
    }
  }, [visible, stars]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

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

  const showNext = !!onNextGame && percentage >= 50;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, cardStyle]}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <LinearGradient
              colors={[color, color + 'B3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.header}
            >
              <View style={styles.headerShine} />
              <MaterialCommunityIcons name="star-four-points" size={16} color="rgba(255, 255, 255, 0.7)" style={styles.sparkleLeft} />
              <MaterialCommunityIcons name="star-four-points" size={12} color="rgba(255, 255, 255, 0.6)" style={styles.sparkleRight} />

              <View style={styles.badgeRing}>
                <View style={styles.badge}>
                  <MaterialCommunityIcons name={level.icon} size={40} color={color} />
                </View>
              </View>
              <ThemedText style={styles.title}>{level.title}</ThemedText>
              <View style={styles.gamePill}>
                <ThemedText style={styles.gamePillText} numberOfLines={1}>{gameTitle}</ThemedText>
              </View>
            </LinearGradient>

            <View style={styles.starsCapsule}>
              <ResultStar earned={stars >= 1} delay={250} size={38} visible={visible} />
              <ResultStar earned={stars >= 2} delay={400} size={50} visible={visible} />
              <ResultStar earned={stars >= 3} delay={550} size={38} visible={visible} />
            </View>

            <Animated.View style={[styles.body, contentStyle]}>
              <View style={styles.scoreBlock}>
                <ThemedText style={[styles.scoreValue, { color }]}>{score}</ThemedText>
                <ThemedText style={styles.scoreLabel}>points</ThemedText>
              </View>

              {showPersonalBest && score > 0 && (
                <View style={styles.bestPill}>
                  <MaterialCommunityIcons name="trophy" size={16} color="#B07800" />
                  <ThemedText style={styles.bestText}>New personal best!</ThemedText>
                </View>
              )}

              <View style={styles.statsCard}>
                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#2E9E62" />
                    <ThemedText style={styles.statText}>
                      {correctAnswers}/{totalQuestions} correct
                    </ThemedText>
                  </View>
                  <View style={styles.stat}>
                    <MaterialCommunityIcons name="bullseye-arrow" size={20} color={color} />
                    <ThemedText style={styles.statText}>{percentage.toFixed(0)}%</ThemedText>
                  </View>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(100, Math.max(0, percentage))}%`, backgroundColor: color },
                    ]}
                  />
                </View>
              </View>

              <ThemedText style={styles.message}>{level.message}</ThemedText>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.primaryTouch}
                onPress={() => {
                  soundManager.playSound('click');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  showInterstitialIfDue();
                  onRestart();
                }}
              >
                <LinearGradient
                  colors={[color, color + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButton}
                >
                  <MaterialCommunityIcons name="replay" size={24} color="#FFFFFF" />
                  <ThemedText style={styles.primaryText}>Play Again</ThemedText>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.secondaryRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.secondaryButton, styles.homeButton]}
                  onPress={() => {
                    soundManager.playSound('whoosh');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    showInterstitialIfDue();
                    onHome();
                  }}
                >
                  <MaterialCommunityIcons name="home" size={22} color="#5F5D7A" />
                  <ThemedText style={styles.homeText}>Home</ThemedText>
                </TouchableOpacity>

                {showNext && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.secondaryButton, styles.nextButton, { borderColor: color }]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      showInterstitialIfDue();
                      onNextGame?.();
                    }}
                  >
                    <ThemedText style={[styles.nextText, { color }]}>Next</ThemedText>
                    <MaterialCommunityIcons name="arrow-right-circle" size={22} color={color} />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <MaterialCommunityIcons name="share-variant" size={18} color="#8B8AA3" />
                <ThemedText style={styles.shareText}>Share my score</ThemedText>
              </TouchableOpacity>

              <AdBanner variant="compact" style={styles.adBanner} />
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 12, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 26,
    paddingBottom: 44,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  headerShine: {
    position: 'absolute',
    top: -60,
    left: -40,
    right: -40,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  sparkleLeft: {
    position: 'absolute',
    top: 24,
    left: 34,
  },
  sparkleRight: {
    position: 'absolute',
    top: 58,
    right: 40,
  },
  badgeRing: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  badge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  gamePill: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    maxWidth: '90%',
  },
  gamePillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  starsCapsule: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'center',
    gap: 6,
    marginTop: -32,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  body: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 20,
  },
  scoreBlock: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 52,
    fontWeight: '900',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9A9AB0',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: -4,
  },
  bestPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#FFF4D6',
  },
  bestText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B07800',
  },
  statsCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#F6F5FD',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3D3A5C',
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E6E3FA',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6F6D8A',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 22,
  },
  primaryTouch: {
    marginTop: 18,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 20,
  },
  primaryText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
  },
  homeButton: {
    backgroundColor: '#F0EFF7',
  },
  homeText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#5F5D7A',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
  },
  nextText: {
    fontSize: 17,
    fontWeight: '800',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  shareText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B8AA3',
  },
  adBanner: {
    marginTop: 12,
  },
});
