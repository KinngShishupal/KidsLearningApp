import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface CelebrationProps {
  message: string;
  show: boolean;
}

export function Celebration({ message, show }: CelebrationProps) {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (show) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 10 })
      );
      rotate.value = withRepeat(
        withSequence(
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        ),
        2,
        false
      );
    } else {
      scale.value = withTiming(0, { duration: 200 });
    }
  }, [show]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  if (!show) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.celebrationContainer, animatedStyle]}>
        <ThemedText style={styles.stars}>⭐ ✨ 🌟</ThemedText>
        <ThemedText style={styles.celebrationText}>{message}</ThemedText>
        <ThemedText style={styles.stars}>🎉 🎊 🎈</ThemedText>
      </Animated.View>
    </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  celebrationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  celebrationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginVertical: 16,
  },
  stars: {
    fontSize: 36,
  },
});
