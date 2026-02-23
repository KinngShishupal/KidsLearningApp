import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { soundManager } from '@/utils/sound-manager';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  emoji?: string;
}

interface TimedQuizProps {
  questions: Question[];
  timePerQuestion?: number;
  onComplete: (score: number, correctAnswers: number) => void;
  color?: string;
}

export function TimedQuiz({ 
  questions, 
  timePerQuestion = 15, 
  onComplete,
  color = '#FF6B6B' 
}: TimedQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const progressWidth = useSharedValue(100);

  useEffect(() => {
    if (answered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          moveToNextQuestion(false);
          return timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, answered]);

  useEffect(() => {
    progressWidth.value = withTiming((timeLeft / timePerQuestion) * 100, { duration: 1000 });
  }, [timeLeft]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const moveToNextQuestion = (wasCorrect: boolean) => {
    const newScore = score + (wasCorrect ? 10 : 0);
    const newCorrectCount = correctCount + (wasCorrect ? 1 : 0);
    
    if (!wasCorrect) {
      onComplete(newScore, newCorrectCount);
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setScore(newScore);
      setCorrectCount(newCorrectCount);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(timePerQuestion);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      onComplete(newScore, newCorrectCount);
    }
  };

  const handleAnswer = (answer: string) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);

    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      soundManager.playSound('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      soundManager.playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setTimeout(() => {
      moveToNextQuestion(isCorrect);
    }, 1500);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBadge}>
          <MaterialCommunityIcons name="progress-check" size={16} color={color} />
          <ThemedText style={[styles.questionNumber, { color }]}>
            {currentQuestionIndex + 1}/{questions.length}
          </ThemedText>
        </View>
        <View style={styles.timerBadge}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={color} />
          <ThemedText style={[styles.timerText, { color }]}>{timeLeft}s</ThemedText>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { backgroundColor: color },
            progressStyle
          ]} 
        />
      </View>

      <View style={[styles.questionCard, { borderColor: color + '40' }]}>
        {currentQuestion.emoji && (
          <View style={[styles.emojiCircle, { backgroundColor: color + '15' }]}>
            <ThemedText style={styles.questionEmoji}>{currentQuestion.emoji}</ThemedText>
          </View>
        )}

        <ThemedText style={styles.question}>
          {currentQuestion.question}
        </ThemedText>
      </View>

      <ThemedText style={styles.instructionText}>Choose your answer:</ThemedText>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          let buttonStyle = [styles.optionButton];
          if (answered && option === currentQuestion.correctAnswer) {
            buttonStyle.push(styles.correctButton);
          } else if (answered && option === selectedAnswer && option !== currentQuestion.correctAnswer) {
            buttonStyle.push(styles.incorrectButton);
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => handleAnswer(option)}
              disabled={answered}
            >
              <ThemedText style={[
                styles.optionText,
                answered && option === selectedAnswer && styles.selectedOptionText
              ]}>{option}</ThemedText>
              {answered && option === currentQuestion.correctAnswer && (
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
    marginBottom: 20,
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
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 3,
    minHeight: 200,
    justifyContent: 'center',
    overflow: 'visible',
  },
  emojiCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
    overflow: 'visible',
  },
  questionEmoji: {
    fontSize: 56,
    lineHeight: 68,
    textAlign: 'center',
    includeFontPadding: false,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
    includeFontPadding: false,
    paddingVertical: 4,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  correctButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  incorrectButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#D32F2F',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  checkIcon: {
    marginLeft: 4,
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
