import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
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
        <ThemedText style={[styles.questionNumber, { color }]}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </ThemedText>
        <View style={styles.timerContainer}>
          <ThemedText style={styles.timerText}>⏱️ {timeLeft}s</ThemedText>
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { backgroundColor: color },
                progressStyle
              ]} 
            />
          </View>
        </View>
      </View>

      {currentQuestion.emoji && (
        <ThemedText style={styles.questionEmoji}>{currentQuestion.emoji}</ThemedText>
      )}

      <ThemedText style={[styles.question, { color }]}>
        {currentQuestion.question}
      </ThemedText>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          let buttonStyle = styles.optionButton;
          if (answered && option === currentQuestion.correctAnswer) {
            buttonStyle = styles.correctButton;
          } else if (answered && option === selectedAnswer && option !== currentQuestion.correctAnswer) {
            buttonStyle = styles.incorrectButton;
          }

          return (
            <TouchableOpacity
              key={index}
              style={[buttonStyle, { borderColor: color }]}
              onPress={() => handleAnswer(option)}
              disabled={answered}
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
  },
  header: {
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timerContainer: {
    marginBottom: 8,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  questionEmoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  incorrectButton: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#666',
  },
});
