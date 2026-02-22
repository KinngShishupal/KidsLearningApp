import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface AnswerFeedbackProps {
  show: boolean;
  isCorrect: boolean;
  message?: string;
}

export function AnswerFeedback({ show, isCorrect, message }: AnswerFeedbackProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    if (show) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1, { damping: 12 })
      );
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 15 });
      
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
      }, 1500);
    } else {
      scale.value = 0;
      opacity.value = 0;
      translateY.value = 50;
    }
  }, [show]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  if (!show) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View 
        style={[
          styles.feedbackBox,
          isCorrect ? styles.correctBox : styles.incorrectBox,
          animatedStyle,
        ]}
      >
        <ThemedText style={styles.emoji}>
          {isCorrect ? '✅' : '❌'}
        </ThemedText>
        <ThemedText style={styles.message}>
          {message || (isCorrect ? 'Correct!' : 'Try Again!')}
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 20,
    gap: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  correctBox: {
    backgroundColor: '#4CAF50',
  },
  incorrectBox: {
    backgroundColor: '#FF6B6B',
  },
  emoji: {
    fontSize: 36,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
