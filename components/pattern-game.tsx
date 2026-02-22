import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
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
      <ThemedText style={[styles.title, { color }]}>Complete the Pattern!</ThemedText>
      <ThemedText style={styles.questionNumber}>
        Pattern {currentPattern + 1} of {patterns.length}
      </ThemedText>

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

      <View style={styles.optionsContainer}>
        {pattern.options.map((option, index) => {
          let buttonStyle = [styles.optionButton, { borderColor: color }];
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
            </TouchableOpacity>
          );
        })}
      </View>

      <ThemedText style={styles.scoreText}>Score: {score}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  patternContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  patternItemContainer: {
    marginBottom: 8,
  },
  patternBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  missingBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  patternItem: {
    fontSize: 32,
  },
  questionMark: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#999',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#F8F8F8',
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  correctOption: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  incorrectOption: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
  optionText: {
    fontSize: 28,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
});
