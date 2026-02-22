import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface ConfettiProps {
  show: boolean;
}

function ConfettiPiece({ emoji, delay }: { emoji: string; delay: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(800, { duration: 2000 })
    );
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(Math.random() * 100 - 50, { duration: 500 }),
          withTiming(Math.random() * 100 - 50, { duration: 500 })
        ),
        4,
        true
      )
    );
    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: 1000 }),
        4,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(1800, withTiming(0, { duration: 200 }))
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.confettiPiece, animatedStyle]}>
      <ThemedText style={styles.confettiEmoji}>{emoji}</ThemedText>
    </Animated.View>
  );
}

export function Confetti({ show }: ConfettiProps) {
  const confettiEmojis = ['🎉', '🎊', '⭐', '✨', '🌟', '💫', '🎈', '🎁'];

  if (!show) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiEmojis.map((emoji, index) => (
        <ConfettiPiece 
          key={`${emoji}-${index}`} 
          emoji={emoji} 
          delay={index * 100}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  confettiPiece: {
    position: 'absolute',
    top: -50,
    left: '50%',
  },
  confettiEmoji: {
    fontSize: 32,
  },
});
