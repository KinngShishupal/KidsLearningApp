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

interface LearningBuddyProps {
  message?: string;
  buddy?: 'robot' | 'cat' | 'star';
}

export function LearningBuddy({ message = 'Let\'s learn!', buddy = 'robot' }: LearningBuddyProps) {
  const bounce = useSharedValue(0);
  const rotate = useSharedValue(0);

  const buddyEmojis = {
    robot: '🤖',
    cat: '😺',
    star: '⭐',
  };

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withSpring(-10, { damping: 10 }),
        withSpring(0, { damping: 10 })
      ),
      -1,
      false
    );

    rotate.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 500 }),
        withTiming(-5, { duration: 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounce.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.buddyContainer, animatedStyle]}>
        <ThemedText style={styles.buddyEmoji}>{buddyEmojis[buddy]}</ThemedText>
      </Animated.View>
      <View style={styles.speechBubble}>
        <ThemedText style={styles.buddyMessage}>{message}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  buddyContainer: {
    marginBottom: 12,
  },
  buddyEmoji: {
    fontSize: 64,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    maxWidth: '80%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buddyMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
