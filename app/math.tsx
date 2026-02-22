import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { soundManager } from '@/utils/sound-manager';
import { Celebration } from '@/components/celebration';
import { MemoryGame } from '@/components/memory-game';
import { LearningBuddy } from '@/components/learning-buddy';
import { TimedQuiz } from '@/components/timed-quiz';
import { Confetti } from '@/components/confetti';
import { PatternGame } from '@/components/pattern-game';
import { GameResultsModal } from '@/components/game-results-modal';
import { AnswerFeedback } from '@/components/answer-feedback';
import { QuestionTimer } from '@/components/question-timer';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  withTiming 
} from 'react-native-reanimated';

export default function MathScreen() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  const [countingAnswer, setCountingAnswer] = useState<number | null>(null);
  const [additionAnswer, setAdditionAnswer] = useState<number | null>(null);
  const [matchingSelected, setMatchingSelected] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [countingQuestionIndex, setCountingQuestionIndex] = useState(0);
  const [additionQuestionIndex, setAdditionQuestionIndex] = useState(0);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [gameResults, setGameResults] = useState({ score: 0, total: 0, correct: 0 });
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState(false);
  const [matchingQuestionIndex, setMatchingQuestionIndex] = useState(0);
  const [matchingAnswer, setMatchingAnswer] = useState<string | null>(null);
  const [gameKey, setGameKey] = useState(0);
  
  const [countingTimeLeft, setCountingTimeLeft] = useState(15);
  const [additionTimeLeft, setAdditionTimeLeft] = useState(15);
  const [matchingTimeLeft, setMatchingTimeLeft] = useState(12);
  const [timerActive, setTimerActive] = useState(true);

  const countingGames = [
    { question: 'How many stars?', stars: 5, options: [4, 5, 6, 7] },
    { question: 'How many hearts?', stars: 7, options: [5, 6, 7, 8], emoji: '❤️' },
    { question: 'How many flowers?', stars: 6, options: [4, 5, 6, 7], emoji: '🌸' },
    { question: 'How many apples?', stars: 8, options: [6, 7, 8, 9], emoji: '🍎' },
    { question: 'How many balloons?', stars: 9, options: [7, 8, 9, 10], emoji: '🎈' },
  ];

  const additionGames = [
    { num1: 2, num2: 3, options: [4, 5, 6, 7], answer: 5 },
    { num1: 4, num2: 2, options: [5, 6, 7, 8], answer: 6 },
    { num1: 3, num2: 4, options: [6, 7, 8, 9], answer: 7 },
    { num1: 5, num2: 3, options: [6, 7, 8, 9], answer: 8 },
    { num1: 6, num2: 3, options: [7, 8, 9, 10], answer: 9 },
  ];

  const countingGame = countingGames[countingQuestionIndex];
  const additionGame = additionGames[additionQuestionIndex];

  useEffect(() => {
    if (selectedGame === 'counting' && timerActive && countingAnswer === null) {
      const timer = setInterval(() => {
        setCountingTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setTimeout(() => {
              setGameResults({ score, total: countingGames.length, correct: countingQuestionIndex });
              setShowResultsModal(true);
            }, 100);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedGame, countingQuestionIndex, timerActive, countingAnswer]);

  useEffect(() => {
    if (selectedGame === 'addition' && timerActive && additionAnswer === null) {
      const timer = setInterval(() => {
        setAdditionTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setTimeout(() => {
              setGameResults({ score, total: additionGames.length, correct: additionQuestionIndex });
              setShowResultsModal(true);
            }, 100);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedGame, additionQuestionIndex, timerActive, additionAnswer]);

  useEffect(() => {
    if (selectedGame === 'matching' && timerActive && matchingAnswer === null) {
      const timer = setInterval(() => {
        setMatchingTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setTimeout(() => {
              setGameResults({ score, total: matchingGames.length, correct: matchingQuestionIndex });
              setShowResultsModal(true);
            }, 100);
            return 12;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedGame, matchingQuestionIndex, timerActive, matchingAnswer]);

  const matchingGames = [
    { number: 1, word: 'one', options: ['one', 'two', 'three', 'four'] },
    { number: 2, word: 'two', options: ['one', 'two', 'three', 'five'] },
    { number: 3, word: 'three', options: ['two', 'three', 'four', 'five'] },
    { number: 4, word: 'four', options: ['one', 'three', 'four', 'five'] },
    { number: 5, word: 'five', options: ['two', 'three', 'four', 'five'] },
  ];

  const matchingGame = matchingGames[matchingQuestionIndex];

  const games = [
    { 
      id: 'counting', 
      title: 'Counting Stars', 
      description: '15 seconds per question', 
      icon: 'star-outline',
      difficulty: 'Easy',
      colors: ['#FFE5E5', '#FFB3B3']
    },
    { 
      id: 'addition', 
      title: 'Addition Fun', 
      description: '15 seconds per question', 
      icon: 'plus-circle-outline',
      difficulty: 'Easy',
      colors: ['#FFE5E5', '#FFB3B3']
    },
    { 
      id: 'matching', 
      title: 'Number Matching', 
      description: '12 seconds per question', 
      icon: 'link-variant',
      difficulty: 'Medium',
      colors: ['#FFF0E5', '#FFDAB3']
    },
    { 
      id: 'memory', 
      title: 'Number Memory', 
      description: 'Match number pairs', 
      icon: 'brain',
      difficulty: 'Medium',
      colors: ['#FFF0E5', '#FFDAB3']
    },
    { 
      id: 'shapememory', 
      title: 'Shape Memory', 
      description: 'Match colorful shapes', 
      icon: 'shape',
      difficulty: 'Medium',
      colors: ['#FFF0E5', '#FFDAB3']
    },
    { 
      id: 'fruitmemory', 
      title: 'Fruit Memory', 
      description: 'Match delicious fruits', 
      icon: 'fruit-cherries',
      difficulty: 'Easy',
      colors: ['#FFE5E5', '#FFB3B3']
    },
    { 
      id: 'patterns', 
      title: 'Pattern Puzzle', 
      description: 'Complete the sequence', 
      icon: 'shape-outline',
      difficulty: 'Hard',
      colors: ['#FFE5F0', '#FFB3D9']
    },
    { 
      id: 'speedmath', 
      title: 'Speed Math', 
      description: 'Beat the clock!', 
      icon: 'lightning-bolt',
      difficulty: 'Hard',
      colors: ['#FFE5F0', '#FFB3D9']
    },
  ];

  const memoryCards = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
  const shapeMemoryCards = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'];
  const fruitMemoryCards = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉'];

  const speedMathQuestions = [
    { question: 'What is 2 + 3?', options: ['4', '5', '6', '7'], correctAnswer: '5', emoji: '➕' },
    { question: 'What is 5 - 2?', options: ['2', '3', '4', '5'], correctAnswer: '3', emoji: '➖' },
    { question: 'Count: 🍎🍎🍎', options: ['2', '3', '4', '5'], correctAnswer: '3', emoji: '🍎' },
    { question: 'What is 4 + 1?', options: ['3', '4', '5', '6'], correctAnswer: '5', emoji: '➕' },
    { question: 'What is 6 - 3?', options: ['2', '3', '4', '5'], correctAnswer: '3', emoji: '➖' },
  ];

  const patterns = [
    { 
      sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'], 
      options: ['🔴', '🔵', '🟡', '🟢'], 
      missingIndex: 4,
      hint: 'Alternating pattern',
      type: 'Repeating'
    },
    { 
      sequence: ['⭐', '⭐', '🌟', '⭐', '⭐', '🌟'], 
      options: ['⭐', '🌟', '💫', '✨'], 
      missingIndex: 5,
      hint: 'Two then one pattern',
      type: 'Repeating'
    },
    { 
      sequence: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'], 
      options: ['4️⃣', '5️⃣', '6️⃣', '7️⃣'], 
      missingIndex: 4,
      hint: 'Counting up',
      type: 'Growing'
    },
    { 
      sequence: ['🟥', '🟧', '🟨', '🟩', '🟦'], 
      options: ['🟪', '🟦', '🟩', '⬛'], 
      missingIndex: 4,
      hint: 'Rainbow order',
      type: 'Sequence'
    },
    { 
      sequence: ['🔺', '🔺', '🔻', '🔺', '🔺', '🔻'], 
      options: ['🔺', '🔻', '⬜', '🔶'], 
      missingIndex: 5,
      hint: 'Up, up, down pattern',
      type: 'Repeating'
    },
    { 
      sequence: ['🍎', '🍎', '🍊', '🍎', '🍎', '🍊'], 
      options: ['🍎', '🍊', '🍋', '🍇'], 
      missingIndex: 5,
      hint: 'Apple, apple, orange',
      type: 'Repeating'
    },
    { 
      sequence: ['⬜', '⬛', '⬜', '⬛', '⬜'], 
      options: ['⬜', '⬛', '🟦', '🟥'], 
      missingIndex: 4,
      hint: 'Light and dark',
      type: 'Alternating'
    },
    { 
      sequence: ['🐶', '🐱', '🐶', '🐱', '🐶'], 
      options: ['🐶', '🐱', '🐭', '🐹'], 
      missingIndex: 4,
      hint: 'Dog, cat pattern',
      type: 'Alternating'
    },
  ];

  const showCelebrationWithMessage = (message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const handleCountingAnswer = (answer: number) => {
    setCountingAnswer(answer);
    const isCorrect = answer === countingGame.stars;
    
    setAnswerIsCorrect(isCorrect);
    setShowAnswerFeedback(true);
    
    if (isCorrect) {
      soundManager.playSound('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      setTimeout(() => {
        setShowAnswerFeedback(false);
        if (countingQuestionIndex < countingGames.length - 1) {
          setCountingQuestionIndex(countingQuestionIndex + 1);
          setCountingAnswer(null);
          setCountingTimeLeft(15);
          setTimerActive(true);
        } else {
          setGameResults({ score: newScore, total: countingGames.length, correct: countingQuestionIndex + 1 });
          setShowResultsModal(true);
          setTimerActive(false);
        }
      }, 1500);
    } else {
      soundManager.playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimerActive(false);
      setTimeout(() => {
        setShowAnswerFeedback(false);
        setGameResults({ score, total: countingGames.length, correct: countingQuestionIndex });
        setShowResultsModal(true);
      }, 1500);
    }
  };

  const handleAdditionAnswer = (answer: number) => {
    setAdditionAnswer(answer);
    const isCorrect = answer === additionGame.answer;
    
    setAnswerIsCorrect(isCorrect);
    setShowAnswerFeedback(true);
    
    if (isCorrect) {
      soundManager.playSound('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      setTimeout(() => {
        setShowAnswerFeedback(false);
        if (additionQuestionIndex < additionGames.length - 1) {
          setAdditionQuestionIndex(additionQuestionIndex + 1);
          setAdditionAnswer(null);
          setAdditionTimeLeft(15);
          setTimerActive(true);
        } else {
          setGameResults({ score: newScore, total: additionGames.length, correct: additionQuestionIndex + 1 });
          setShowResultsModal(true);
          setTimerActive(false);
        }
      }, 1500);
    } else {
      soundManager.playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimerActive(false);
      setTimeout(() => {
        setShowAnswerFeedback(false);
        setGameResults({ score, total: additionGames.length, correct: additionQuestionIndex });
        setShowResultsModal(true);
      }, 1500);
    }
  };

  const renderCountingGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={styles.progressBadge}>
          <MaterialCommunityIcons name="progress-check" size={16} color="#FF6B6B" />
          <ThemedText style={styles.questionProgress}>
            {countingQuestionIndex + 1}/{countingGames.length}
          </ThemedText>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: '#FF6B6B' }]}>
          <ThemedText style={styles.categoryText}>Counting</ThemedText>
        </View>
      </View>

      <QuestionTimer timeLeft={countingTimeLeft} totalTime={15} color="#FF6B6B" />

      <View style={styles.questionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#FFE5E5' }]}>
          <MaterialCommunityIcons name="counter" size={40} color="#FF6B6B" />
        </View>
        <ThemedText style={styles.gameQuestion}>{countingGame.question}</ThemedText>
        
        <View style={styles.itemsDisplayCard}>
          <View style={styles.starsContainer}>
            {Array.from({ length: countingGame.stars }).map((_, index) => (
              <ThemedText key={index} style={styles.star}>
                {countingGame.emoji || '⭐'}
              </ThemedText>
            ))}
          </View>
        </View>
      </View>

      <ThemedText style={styles.instructionText}>Tap the correct answer:</ThemedText>
      <View style={styles.optionsGrid}>
        {countingGame.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.modernOptionButton,
              countingAnswer === option && (option === countingGame.stars ? styles.correctOptionButton : styles.incorrectOptionButton),
            ]}
            onPress={() => handleCountingAnswer(option)}
            disabled={countingAnswer !== null}
          >
            <ThemedText style={[
              styles.modernOptionText,
              countingAnswer === option && styles.selectedOptionText,
            ]}>{option}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderAdditionGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={styles.progressBadge}>
          <MaterialCommunityIcons name="progress-check" size={16} color="#FF6B6B" />
          <ThemedText style={styles.questionProgress}>
            {additionQuestionIndex + 1}/{additionGames.length}
          </ThemedText>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: '#FF6B6B' }]}>
          <ThemedText style={styles.categoryText}>Addition</ThemedText>
        </View>
      </View>

      <QuestionTimer timeLeft={additionTimeLeft} totalTime={15} color="#FF6B6B" />

      <View style={styles.questionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#FFE5E5' }]}>
          <MaterialCommunityIcons name="plus-circle" size={40} color="#FF6B6B" />
        </View>
        <ThemedText style={styles.gameQuestion}>Solve this problem:</ThemedText>
        
        <View style={styles.equationCard}>
          <View style={styles.equationContainer}>
            <View style={styles.numberBubble}>
              <ThemedText style={styles.equationNumber}>{additionGame.num1}</ThemedText>
            </View>
            <ThemedText style={styles.equationOperator}>+</ThemedText>
            <View style={styles.numberBubble}>
              <ThemedText style={styles.equationNumber}>{additionGame.num2}</ThemedText>
            </View>
            <ThemedText style={styles.equationOperator}>=</ThemedText>
            <View style={styles.numberBubbleMissing}>
              <ThemedText style={styles.equationNumber}>?</ThemedText>
            </View>
          </View>
        </View>
      </View>

      <ThemedText style={styles.instructionText}>Choose your answer:</ThemedText>
      <View style={styles.optionsGrid}>
        {additionGame.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.modernOptionButton,
              additionAnswer === option && (option === additionGame.answer ? styles.correctOptionButton : styles.incorrectOptionButton),
            ]}
            onPress={() => handleAdditionAnswer(option)}
            disabled={additionAnswer !== null}
          >
            <ThemedText style={[
              styles.modernOptionText,
              additionAnswer === option && styles.selectedOptionText,
            ]}>{option}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const handleMatchingAnswer = (answer: string) => {
    setMatchingAnswer(answer);
    const isCorrect = answer === matchingGame.word;
    
    setAnswerIsCorrect(isCorrect);
    setShowAnswerFeedback(true);
    
    if (isCorrect) {
      soundManager.playSound('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      setTimeout(() => {
        setShowAnswerFeedback(false);
        if (matchingQuestionIndex < matchingGames.length - 1) {
          setMatchingQuestionIndex(matchingQuestionIndex + 1);
          setMatchingAnswer(null);
          setMatchingTimeLeft(12);
          setTimerActive(true);
        } else {
          setGameResults({ score: newScore, total: matchingGames.length, correct: matchingQuestionIndex + 1 });
          setShowResultsModal(true);
          setTimerActive(false);
        }
      }, 1500);
    } else {
      soundManager.playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimerActive(false);
      setTimeout(() => {
        setShowAnswerFeedback(false);
        setGameResults({ score, total: matchingGames.length, correct: matchingQuestionIndex });
        setShowResultsModal(true);
      }, 1500);
    }
  };

  const renderMatchingGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={styles.progressBadge}>
          <MaterialCommunityIcons name="progress-check" size={16} color="#FF6B6B" />
          <ThemedText style={styles.questionProgress}>
            {matchingQuestionIndex + 1}/{matchingGames.length}
          </ThemedText>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: '#FF6B6B' }]}>
          <ThemedText style={styles.categoryText}>Matching</ThemedText>
        </View>
      </View>

      <QuestionTimer timeLeft={matchingTimeLeft} totalTime={12} color="#FF6B6B" />

      <View style={styles.questionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#FFE5E5' }]}>
          <MaterialCommunityIcons name="link-variant" size={40} color="#FF6B6B" />
        </View>
        <ThemedText style={styles.gameQuestion}>Match the number to its word:</ThemedText>
        
        <View style={styles.matchingDisplayCard}>
          <View style={styles.numberDisplayBubble}>
            <ThemedText style={styles.numberDisplayText}>{matchingGame.number}</ThemedText>
          </View>
          <MaterialCommunityIcons name="arrow-right-thick" size={40} color="#FF6B6B" />
          <View style={styles.questionMarkBubble}>
            <ThemedText style={styles.questionMarkText}>?</ThemedText>
          </View>
        </View>
      </View>

      <ThemedText style={styles.instructionText}>Select the word:</ThemedText>
      <View style={styles.optionsGrid}>
        {matchingGame.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.wordOptionButton,
              matchingAnswer === option && (option === matchingGame.word ? styles.correctWordButton : styles.incorrectWordButton),
            ]}
            onPress={() => handleMatchingAnswer(option)}
            disabled={matchingAnswer !== null}
          >
            <ThemedText style={[
              styles.wordOptionText,
              matchingAnswer === option && styles.selectedWordOptionText,
            ]}>{option}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMemoryGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#FF6B6B' }]}>
          <MaterialCommunityIcons name="brain" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Number Memory</ThemedText>
        </View>
      </View>

      <View style={styles.memoryInstructionCard}>
        <MaterialCommunityIcons name="lightbulb-on" size={32} color="#FFD93D" />
        <ThemedText style={styles.memoryInstruction}>
          Tap cards to flip them. Find matching number pairs!
        </ThemedText>
      </View>

      <MemoryGame
        key={`memory-${gameKey}`}
        cards={memoryCards}
        onComplete={() => {
          const finalScore = score + 20;
          setGameResults({ score: finalScore, total: memoryCards.length, correct: memoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#FFE5E5"
        cardFrontColors={['#FF6B6B', '#FF8E53']}
      />
    </View>
  );

  const renderShapeMemoryGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#FF6B6B' }]}>
          <MaterialCommunityIcons name="shape" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Shape Memory</ThemedText>
        </View>
      </View>

      <View style={styles.memoryInstructionCard}>
        <MaterialCommunityIcons name="lightbulb-on" size={32} color="#FFD93D" />
        <ThemedText style={styles.memoryInstruction}>
          Match colorful shapes! Test your visual memory!
        </ThemedText>
      </View>

      <MemoryGame
        key={`shapememory-${gameKey}`}
        cards={shapeMemoryCards}
        onComplete={() => {
          const finalScore = score + 25;
          setGameResults({ score: finalScore, total: shapeMemoryCards.length, correct: shapeMemoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#FFF0E5"
        cardFrontColors={['#9C27B0', '#7B1FA2']}
      />
    </View>
  );

  const renderFruitMemoryGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#FF6B6B' }]}>
          <MaterialCommunityIcons name="fruit-cherries" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Fruit Memory</ThemedText>
        </View>
      </View>

      <View style={styles.memoryInstructionCard}>
        <MaterialCommunityIcons name="lightbulb-on" size={32} color="#FFD93D" />
        <ThemedText style={styles.memoryInstruction}>
          Match delicious fruits! Can you remember them all?
        </ThemedText>
      </View>

      <MemoryGame
        key={`fruitmemory-${gameKey}`}
        cards={fruitMemoryCards}
        onComplete={() => {
          const finalScore = score + 20;
          setGameResults({ score: finalScore, total: fruitMemoryCards.length, correct: fruitMemoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#FFE5E5"
        cardFrontColors={['#E91E63', '#C2185B']}
      />
    </View>
  );

  const renderPatternGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.patternIntroCard}>
        <MaterialCommunityIcons name="school" size={32} color="#FF6B6B" />
        <View style={styles.patternIntroContent}>
          <ThemedText style={styles.patternIntroTitle}>Pattern Challenge!</ThemedText>
          <ThemedText style={styles.patternIntroText}>
            Look at the sequence carefully. Find what comes next! Use hints if you need help.
          </ThemedText>
        </View>
      </View>

      <PatternGame
        key={`pattern-${gameKey}`}
        patterns={patterns}
        onComplete={(finalScore, correctAnswers) => {
          setGameResults({ score: finalScore, total: patterns.length, correct: correctAnswers });
          setShowResultsModal(true);
        }}
        color="#FF6B6B"
      />
    </View>
  );

  const renderSpeedMathGame = () => (
    <View style={styles.gameContainer}>
      <LearningBuddy message="Answer as fast as you can!" buddy="robot" />
      <TimedQuiz
        key={`speedmath-${gameKey}`}
        questions={speedMathQuestions}
        timePerQuestion={10}
        onComplete={(finalScore, correctAnswers) => {
          setGameResults({ score: finalScore, total: speedMathQuestions.length, correct: correctAnswers });
          setShowResultsModal(true);
        }}
        color="#FF6B6B"
      />
    </View>
  );

  const handleRestart = () => {
    setShowResultsModal(false);
    setScore(0);
    setCountingQuestionIndex(0);
    setAdditionQuestionIndex(0);
    setMatchingQuestionIndex(0);
    setCountingAnswer(null);
    setAdditionAnswer(null);
    setMatchingAnswer(null);
    setCountingTimeLeft(15);
    setAdditionTimeLeft(15);
    setMatchingTimeLeft(12);
    setTimerActive(true);
    setQuizCompleted(false);
    setGameKey(gameKey + 1);
  };

  const handleGoHome = () => {
    setShowResultsModal(false);
    setSelectedGame(null);
    setScore(0);
    setCountingQuestionIndex(0);
    setAdditionQuestionIndex(0);
    setMatchingQuestionIndex(0);
    setCountingAnswer(null);
    setAdditionAnswer(null);
    setMatchingAnswer(null);
    setQuizCompleted(false);
    setGameKey(0);
  };

  const handleNextGame = () => {
    setShowResultsModal(false);
    const currentGameIndex = games.findIndex(g => g.id === selectedGame);
    if (currentGameIndex < games.length - 1) {
      setSelectedGame(games[currentGameIndex + 1].id);
      setScore(0);
      setCountingQuestionIndex(0);
      setAdditionQuestionIndex(0);
      setMatchingQuestionIndex(0);
      setCountingAnswer(null);
      setAdditionAnswer(null);
      setMatchingAnswer(null);
      setQuizCompleted(false);
      setGameKey(gameKey + 1);
    } else {
      handleGoHome();
    }
  };

  if (selectedGame) {
    return (
      <View style={styles.screen}>
        <AnswerFeedback show={showAnswerFeedback} isCorrect={answerIsCorrect} />
        <GameResultsModal
          visible={showResultsModal}
          score={gameResults.score}
          totalQuestions={gameResults.total}
          correctAnswers={gameResults.correct}
          onRestart={handleRestart}
          onHome={handleGoHome}
          onNextGame={handleNextGame}
          color="#FF6B6B"
          gameTitle={games.find(g => g.id === selectedGame)?.title || 'Math Game'}
          gameId={selectedGame || 'math'}
          subject="math"
        />
        <Confetti show={showConfetti} />
        <Celebration message={celebrationMessage} show={showCelebration} />
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBar}
        >
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              handleGoHome();
            }}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left-circle" size={26} color="#FFFFFF" />
            <ThemedText style={styles.backText}>Back</ThemedText>
          </TouchableOpacity>

          <View style={styles.gameHeaderCenter}>
            <ThemedText style={styles.currentGameTitle}>
              {games.find(g => g.id === selectedGame)?.title || 'Game'}
            </ThemedText>
          </View>

          <View style={styles.scoreContainer}>
            <MaterialCommunityIcons name="trophy" size={18} color="#FFFFFF" />
            <ThemedText style={styles.scoreText}>{score}</ThemedText>
          </View>
        </LinearGradient>
        <ScrollView 
          style={styles.gameScreen} 
          contentContainerStyle={styles.gameScreenContent}
          showsVerticalScrollIndicator={false}
        >
          {selectedGame === 'counting' && renderCountingGame()}
          {selectedGame === 'addition' && renderAdditionGame()}
          {selectedGame === 'matching' && renderMatchingGame()}
          {selectedGame === 'memory' && renderMemoryGame()}
          {selectedGame === 'shapememory' && renderShapeMemoryGame()}
          {selectedGame === 'fruitmemory' && renderFruitMemoryGame()}
          {selectedGame === 'patterns' && renderPatternGame()}
          {selectedGame === 'speedmath' && renderSpeedMathGame()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.mathHeader}
      >
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }} 
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left-circle" size={26} color="#FFFFFF" />
          <ThemedText style={styles.backText}>Back</ThemedText>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.headerIconCircle}>
            <MaterialCommunityIcons name="calculator-variant" size={36} color="#FF6B6B" />
          </View>
          <ThemedText style={styles.mathTitle}>Math Games</ThemedText>
          <ThemedText style={styles.mathSubtitle}>Choose a game to play</ThemedText>
        </View>

        <View style={styles.headerDecoration}>
          <View style={styles.decorativeCircleSmall} />
          <View style={styles.decorativeCircleLarge} />
        </View>
      </LinearGradient>
      <ScrollView style={styles.gamesListContainer}>
        {games.map((game, idx) => (
          <TouchableOpacity
            key={game.id}
            onPress={() => {
              soundManager.playSound('click');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedGame(game.id);
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[game.colors[0], game.colors[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gameCard}
            >
              <View style={styles.gameCardLeft}>
                <View style={[styles.gameIconContainer, { backgroundColor: '#FF6B6B' }]}>
                  <MaterialCommunityIcons name={game.icon as any} size={36} color="#FFFFFF" />
                </View>
                <View style={styles.gameInfo}>
                  <ThemedText style={styles.gameCardTitle}>{game.title}</ThemedText>
                  <ThemedText style={styles.gameCardDescription}>{game.description}</ThemedText>
                </View>
              </View>
              
              <View style={styles.gameCardRight}>
                <View style={[styles.difficultyBadge, 
                  game.difficulty === 'Easy' && styles.easyBadge,
                  game.difficulty === 'Medium' && styles.mediumBadge,
                  game.difficulty === 'Hard' && styles.hardBadge
                ]}>
                  <ThemedText style={styles.difficultyText}>{game.difficulty}</ThemedText>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={28} color="#FF6B6B" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  mathHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  headerIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  mathTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  mathSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    gap: 20,
  },
  decorativeCircleSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
    top: 40,
    right: 20,
  },
  decorativeCircleLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    position: 'absolute',
    top: -20,
    right: -20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  gameHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  currentGameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gamesListContainer: {
    flex: 1,
    padding: 20,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    minHeight: 110,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  gameCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  gameIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  gameInfo: {
    flex: 1,
  },
  gameCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  gameCardDescription: {
    fontSize: 14,
    color: '#666',
  },
  gameCardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  easyBadge: {
    backgroundColor: '#4CAF50',
  },
  mediumBadge: {
    backgroundColor: '#FF9800',
  },
  hardBadge: {
    backgroundColor: '#F44336',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameScreen: {
    flex: 1,
  },
  gameScreenContent: {
    paddingBottom: 40,
  },
  gameContainer: {
    flex: 1,
    padding: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  questionProgress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
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
    borderColor: '#FFE5E5',
  },
  questionIconCircle: {
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
  gameQuestion: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemsDisplayCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFE5E5',
    borderStyle: 'dashed',
    minHeight: 140,
    justifyContent: 'center',
    overflow: 'visible',
  },
  starsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  star: {
    fontSize: 38,
    lineHeight: 48,
    textAlign: 'center',
    includeFontPadding: false,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  modernOptionButton: {
    backgroundColor: '#FFFFFF',
    width: 85,
    height: 85,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFE5E5',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  correctOptionButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  incorrectOptionButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#D32F2F',
  },
  modernOptionText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  equationCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFE5E5',
  },
  equationContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBubble: {
    backgroundColor: '#FF6B6B',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  numberBubbleMissing: {
    backgroundColor: '#FFE5E5',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF6B6B',
    borderStyle: 'dashed',
  },
  equationNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  equationOperator: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  matchingDisplayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFE5E5',
  },
  numberDisplayBubble: {
    backgroundColor: '#FF6B6B',
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  numberDisplayText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  questionMarkBubble: {
    backgroundColor: '#FFE5E5',
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FF6B6B',
    borderStyle: 'dashed',
  },
  questionMarkText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  wordOptionButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 20,
    minWidth: 140,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFE5E5',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  correctWordButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  incorrectWordButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#D32F2F',
  },
  wordOptionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  selectedWordOptionText: {
    color: '#FFFFFF',
  },
  memoryInstructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    gap: 12,
    borderWidth: 2,
    borderColor: '#FFD93D',
  },
  memoryInstruction: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    lineHeight: 22,
  },
  patternIntroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    gap: 12,
    borderWidth: 2,
    borderColor: '#FFE5E5',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  patternIntroContent: {
    flex: 1,
  },
  patternIntroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  patternIntroText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
