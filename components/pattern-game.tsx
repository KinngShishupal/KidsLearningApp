import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface Pattern {
  sequence: string[];
  options: string[];
  missingIndex: number;
}

interface PatternGameProps {
  patterns: Pattern[];
  onComplete: (score: number, correctAnswers: number) => void;
  color?: string;
}

export function PatternGame({ patterns, onComplete, color = '#FF6B6B' }: PatternGameProps) {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const pattern = patterns[currentPattern];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === pattern.sequence[pattern.missingIndex];

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      const newCorrectCount = correctCount + 1;
      setScore(newScore);
      setCorrectCount(newCorrectCount);
      
      setTimeout(() => {
        if (currentPattern < patterns.length - 1) {
          setCurrentPattern(currentPattern + 1);
          setSelectedAnswer(null);
        } else {
          onComplete(newScore, newCorrectCount);
        }
      }, 1000);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        onComplete(score, correctCount);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBadge}>
          <MaterialCommunityIcons name="progress-check" size={16} color={color} />
          <ThemedText style={[styles.questionNumber, { color }]}>
            {currentPattern + 1}/{patterns.length}
          </ThemedText>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: color }]}>
          <ThemedText style={styles.categoryText}>Pattern</ThemedText>
        </View>
      </View>

      <View style={[styles.questionCard, { borderColor: color + '40' }]}>
        <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
          <MaterialCommunityIcons name="shape" size={40} color={color} />
        </View>
        <ThemedText style={styles.title}>What comes next?</ThemedText>
        
        <View style={styles.patternDisplayCard}>
          <View style={styles.patternContainer}>
            {pattern.sequence.map((item, index) => (
              <View key={index} style={styles.patternItemContainer}>
                {index === pattern.missingIndex ? (
                  <View style={[styles.missingBox, { borderColor: color }]}>
                    <ThemedText style={styles.questionMark}>?</ThemedText>
                  </View>
                ) : (
                  <View style={[styles.patternBox, { backgroundColor: color }]}>
                    <ThemedText style={styles.patternItem}>{item}</ThemedText>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>

      <ThemedText style={styles.instructionText}>Choose the missing piece:</ThemedText>

      <View style={styles.optionsContainer}>
        {pattern.options.map((option, index) => {
          let buttonStyle = [styles.optionButton];
          if (selectedAnswer === option) {
            if (option === pattern.sequence[pattern.missingIndex]) {
              buttonStyle.push(styles.correctOption);
            } else {
              buttonStyle.push(styles.incorrectOption);
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <ThemedText style={styles.optionText}>{option}</ThemedText>
              {selectedAnswer === option && option === pattern.sequence[pattern.missingIndex] && (
                <MaterialCommunityIcons name="check-circle" size={24} color="#FFFFFF" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.scoreBox, { backgroundColor: color + '15', borderColor: color }]}>
        <MaterialCommunityIcons name="trophy" size={20} color={color} />
        <ThemedText style={[styles.scoreText, { color }]}>Score: {score}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBadge: {
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
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 3,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  patternDisplayCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  patternContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  patternItemContainer: {
    marginBottom: 8,
  },
  patternBox: {
    width: 65,
    height: 65,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  missingBox: {
    width: 65,
    height: 65,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderStyle: 'dashed',
  },
  patternItem: {
    fontSize: 36,
  },
  questionMark: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#999',
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    width: 80,
    height: 80,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F0F0F0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    position: 'relative',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  incorrectOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#D32F2F',
  },
  optionText: {
    fontSize: 32,
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
