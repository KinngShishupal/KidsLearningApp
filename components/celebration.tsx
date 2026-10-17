import { useEffect } from 'react';
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

interface CelebrationProps {
  message: string;
  show: boolean;
  subtitle?: string;
}

const easeOut = Easing.out(Easing.cubic);

function FadeStar({ show, delay, size }: { show: boolean; delay: number; size: number }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = show ? withDelay(delay, withTiming(1, { duration: 300, easing: easeOut })) : 0;
  }, [show]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={style}>
      <MaterialCommunityIcons name="star" size={size} color="#FFD93D" style={styles.starShadow} />
    </Animated.View>
  );
}

export function Celebration({ message, show, subtitle = 'Keep up the great work!' }: CelebrationProps) {
  const overlayOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.94);

  useEffect(() => {
    if (show) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      cardOpacity.value = withTiming(1, { duration: 260, easing: easeOut });
      cardScale.value = withTiming(1, { duration: 260, easing: easeOut });
    } else {
      overlayOpacity.value = 0;
      cardOpacity.value = 0;
      cardScale.value = 0.94;
    }
  }, [show]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  if (!show) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
      <Animated.View style={[styles.shadowWrap, cardStyle]}>
        <LinearGradient
          colors={['#8E7CFF', '#6C5CE7', '#4B3BC4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.shine} />

          <View style={styles.badgeRing}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="trophy" size={44} color="#F5B700" />
            </View>
          </View>

          <View style={styles.starsRow}>
            <FadeStar show={show} delay={200} size={30} />
            <FadeStar show={show} delay={350} size={40} />
            <FadeStar show={show} delay={500} size={30} />
          </View>

          <ThemedText style={styles.title}>{message}</ThemedText>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>

          <MaterialCommunityIcons name="star-four-points" size={18} color="rgba(255, 255, 255, 0.7)" style={[styles.sparkle, styles.sparkleTopLeft]} />
          <MaterialCommunityIcons name="star-four-points" size={14} color="rgba(255, 255, 255, 0.6)" style={[styles.sparkle, styles.sparkleTopRight]} />
          <MaterialCommunityIcons name="star-four-points" size={16} color="rgba(255, 217, 61, 0.8)" style={[styles.sparkle, styles.sparkleBottomLeft]} />
          <MaterialCommunityIcons name="star-four-points" size={20} color="rgba(255, 255, 255, 0.5)" style={[styles.sparkle, styles.sparkleBottomRight]} />
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 12, 50, 0.55)',
    zIndex: 1000,
  },
  shadowWrap: {
    borderRadius: 32,
    elevation: 16,
    shadowColor: '#4B3BC4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  card: {
    width: 290,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: -50,
    left: -30,
    right: -30,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  badgeRing: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginTop: 14,
  },
  starShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 6,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleTopLeft: {
    top: 22,
    left: 26,
  },
  sparkleTopRight: {
    top: 40,
    right: 30,
  },
  sparkleBottomLeft: {
    bottom: 26,
    left: 34,
  },
  sparkleBottomRight: {
    bottom: 40,
    right: 22,
  },
});
