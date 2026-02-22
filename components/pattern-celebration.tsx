import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';

interface PatternCelebrationProps {
  show: boolean;
  isCorrect: boolean;
  patternType?: string;
}

export function PatternCelebration({ show, isCorrect, patternType }: PatternCelebrationProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (show) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1, { damping: 12 })
      );
      opacity.value = withSpring(1, { damping: 15 });
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [show]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!show) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[
        styles.celebrationCard,
        isCorrect ? styles.correctCard : styles.incorrectCard,
        animatedStyle
      ]}>
        <MaterialCommunityIcons 
          name={isCorrect ? "star-circle" : "alert-circle"} 
          size={48} 
          color="#FFFFFF" 
        />
        <ThemedText style={styles.celebrationTitle}>
          {isCorrect ? 'Pattern Master!' : 'Not Quite!'}
        </ThemedText>
        {isCorrect && patternType && (
          <ThemedText style={styles.celebrationText}>
            You solved the {patternType} pattern!
          </ThemedText>
        )}
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
    zIndex: 1000,
  },
  celebrationCard: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    minWidth: 200,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  correctCard: {
    backgroundColor: '#4CAF50',
  },
  incorrectCard: {
    backgroundColor: '#FF6B6B',
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  celebrationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
});
