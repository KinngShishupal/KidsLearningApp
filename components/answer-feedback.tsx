import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface AnswerFeedbackProps {
  show: boolean;
  isCorrect: boolean;
  message?: string;
}

const CORRECT_SUBTITLES = ['Awesome job!', "You're a star!", 'Super smart!', 'Keep it up!', 'Brilliant!'];
const WRONG_SUBTITLES = ['You can do it!', 'Almost there!', 'Give it another go!', 'Keep trying!'];

const THEMES = {
  correct: {
    colors: ['#5EE08A', '#22B35E', '#138A47'] as const,
    accent: '#138A47',
    icon: 'check-bold' as const,
    title: 'Correct!',
    subtitles: CORRECT_SUBTITLES,
  },
  wrong: {
    colors: ['#FFB36B', '#FF7A59', '#F0484E'] as const,
    accent: '#F0484E',
    icon: 'refresh' as const,
    title: 'Try Again!',
    subtitles: WRONG_SUBTITLES,
  },
};

let feedbackCount = 0;

export function AnswerFeedback({ show, isCorrect, message }: AnswerFeedbackProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const sparkleOpacity = useSharedValue(0);

  const theme = isCorrect ? THEMES.correct : THEMES.wrong;
  // Rotate through the encouraging lines each time the popup opens.
  const subtitleIndex = useMemo(() => (show ? feedbackCount++ : feedbackCount), [show]);
  const subtitle = theme.subtitles[subtitleIndex % theme.subtitles.length];

  useEffect(() => {
    if (!show) {
      opacity.value = 0;
      scale.value = 0.92;
      sparkleOpacity.value = 0;
      return;
    }

    const easeOut = Easing.out(Easing.cubic);
    opacity.value = withTiming(1, { duration: 220, easing: easeOut });
    scale.value = withTiming(1, { duration: 220, easing: easeOut });
    sparkleOpacity.value = withDelay(150, withTiming(1, { duration: 300 }));

    const hideTimer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });
    }, 1500);
    return () => clearTimeout(hideTimer);
  }, [show]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value * opacity.value,
  }));

  if (!show) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.shadowWrap, { shadowColor: theme.accent }, cardStyle]}>
        <LinearGradient
          colors={theme.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.shine} />

          <View style={styles.iconRing}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name={theme.icon} size={34} color={theme.accent} />
            </View>
          </View>

          <View style={styles.textBlock}>
            <ThemedText style={styles.title}>{message || theme.title}</ThemedText>
            <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          </View>
        </LinearGradient>

        <Animated.View style={[StyleSheet.absoluteFill, sparkleStyle]}>
          {isCorrect ? (
            <>
              <MaterialCommunityIcons name="star-four-points" size={22} color="#FFE066" style={[styles.sparkle, styles.sparkleTopLeft]} />
              <MaterialCommunityIcons name="star-four-points" size={16} color="#FFFFFF" style={[styles.sparkle, styles.sparkleTopRight]} />
              <MaterialCommunityIcons name="star" size={18} color="#FFE066" style={[styles.sparkle, styles.sparkleBottomRight]} />
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="heart" size={18} color="#FFD1DC" style={[styles.sparkle, styles.sparkleTopRight]} />
              <MaterialCommunityIcons name="arm-flex" size={20} color="#FFE3B3" style={[styles.sparkle, styles.sparkleBottomRight]} />
            </>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '38%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  shadowWrap: {
    borderRadius: 28,
    elevation: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 18,
    paddingLeft: 18,
    paddingRight: 30,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    overflow: 'hidden',
    minWidth: 260,
  },
  shine: {
    position: 'absolute',
    top: -30,
    left: -20,
    right: -20,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  iconRing: {
    padding: 5,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flexShrink: 1,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.92)',
    marginTop: 2,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleTopLeft: {
    top: -10,
    left: -6,
  },
  sparkleTopRight: {
    top: -8,
    right: 14,
  },
  sparkleBottomRight: {
    bottom: -8,
    right: -6,
  },
});
