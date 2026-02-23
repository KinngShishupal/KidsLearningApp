import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface QuestionTimerProps {
  timeLeft: number;
  totalTime: number;
  color?: string;
}

export function QuestionTimer({ timeLeft, totalTime, color = '#FF6B6B' }: QuestionTimerProps) {
  const progressWidth = useSharedValue(100);

  useEffect(() => {
    progressWidth.value = withTiming((timeLeft / totalTime) * 100, { duration: 1000 });
  }, [timeLeft, totalTime]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const isLowTime = timeLeft <= 3;
  const displayColor = isLowTime ? '#F44336' : color;

  return (
    <View style={styles.container}>
      <View style={styles.timerBadge}>
        <MaterialCommunityIcons 
          name={isLowTime ? "clock-alert" : "clock-outline"} 
          size={18} 
          color={displayColor} 
        />
        <ThemedText style={[styles.timerText, { color: displayColor }]}>
          {timeLeft}s
        </ThemedText>
      </View>
      <View style={styles.progressBarContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { backgroundColor: displayColor },
            progressStyle
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.Create({
  container: {
    marginBottom: 12,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
});
