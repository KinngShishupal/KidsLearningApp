import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface PersonalBestBadgeProps {
  show: boolean;
  score: number;
  color?: string;
}

export function PersonalBestBadge({ show, score, color = '#FFD93D' }: PersonalBestBadgeProps) {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (show) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 8 }),
        withSpring(1, { damping: 10 })
      );
      rotate.value = withRepeat(
        withSequence(
          withSpring(10, { damping: 8 }),
          withSpring(-10, { damping: 8 }),
          withSpring(0, { damping: 8 })
        ),
        2,
        false
      );
    } else {
      scale.value = 0;
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
    <Animated.View style={[styles.container, { backgroundColor: color }, animatedStyle]}>
      <ThemedText style={styles.trophy}>🏆</ThemedText>
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>New Personal Best!</ThemedText>
        <ThemedText style={styles.score}>{score} points</ThemedText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  trophy: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  score: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
