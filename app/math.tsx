import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Celebration } from '@/components/celebration';
import { MemoryGame } from '@/components/memory-game';
import { LearningBuddy } from '@/components/learning-buddy';
import { TimedQuiz } from '@/components/timed-quiz';
import { Confetti } from '@/components/confetti';
import { PatternGame } from '@/components/pattern-game';
import { GameResultsModal } from '@/components/game-results-modal';
import { AnswerFeedback } from '@/components/answer-feedback';
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

  const matchingGame = [
    { number: 1, word: 'one' },
    { number: 2, word: 'two' },
    { number: 3, word: 'three' },
    { number: 4, word: 'four' },
    { number: 5, word: 'five' },
  ];

  const games = [
    { 
      id: 'counting', 
      title: 'Counting Stars', 
      description: 'Learn to count objects', 
      icon: 'star-outline',
      difficulty: 'Easy',
      colors: ['#FFE5E5', '#FFB3B3']
    },
    { 
      id: 'addition', 
      title: 'Addition Fun', 
      description: 'Add numbers together', 
      icon: 'plus-circle-outline',
      difficulty: 'Easy',
      colors: ['#FFE5E5', '#FFB3B3']
    },
    { 
      id: 'matching', 
      title: 'Number Matching', 
      description: 'Match numbers to words', 
      icon: 'link-variant',
      difficulty: 'Medium',
      colors: ['#FFF0E5', '#FFDAB3']
    },
    { 
      id: 'memory', 
      title: 'Memory Match', 
      description: 'Find matching pairs', 
      icon: 'brain',
      difficulty: 'Medium',
      colors: ['#FFF0E5', '#FFDAB3']
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

  const speedMathQuestions = [
    { question: 'What is 2 + 3?', options: ['4', '5', '6', '7'], correctAnswer: '5', emoji: '➕' },
    { question: 'What is 5 - 2?', options: ['2', '3', '4', '5'], correctAnswer: '3', emoji: '➖' },
    { question: 'Count: 🍎🍎🍎', options: ['2', '3', '4', '5'], correctAnswer: '3', emoji: '🍎' },
    { question: 'What is 4 + 1?', options: ['3', '4', '5', '6'], correctAnswer: '5', emoji: '➕' },
    { question: 'What is 6 - 3?', options: ['2', '3', '4', '5'], correctAnswer: '3', emoji: '➖' },
  ];

  const patterns = [
    { sequence: ['🔴', '🔵', '🔴', '🔵'], options: ['🔴', '🔵', '🟡'], missingIndex: 2 },
    { sequence: ['⭐', '⭐', '🌟', '⭐', '⭐'], options: ['⭐', '🌟', '💫'], missingIndex: 2 },
    { sequence: ['🟥', '🟦', '🟦', '🟥', '🟦'], options: ['🟥', '🟦', '🟩'], missingIndex: 4 },
    { sequence: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'], options: ['3️⃣', '4️⃣', '5️⃣'], missingIndex: 3 },
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      setTimeout(() => {
        setShowAnswerFeedback(false);
        if (countingQuestionIndex < countingGames.length - 1) {
          setCountingQuestionIndex(countingQuestionIndex + 1);
          setCountingAnswer(null);
        } else {
          setGameResults({ score: newScore, total: countingGames.length, correct: countingQuestionIndex + 1 });
          setShowResultsModal(true);
        }
      }, 1500);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      setTimeout(() => {
        setShowAnswerFeedback(false);
        if (additionQuestionIndex < additionGames.length - 1) {
          setAdditionQuestionIndex(additionQuestionIndex + 1);
          setAdditionAnswer(null);
        } else {
          setGameResults({ score: newScore, total: additionGames.length, correct: additionQuestionIndex + 1 });
          setShowResultsModal(true);
        }
      }, 1500);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

  const renderMatchingGame = () => (
    <View style={styles.gameContainer}>
      <ThemedText style={styles.gameQuestion}>Match numbers to words!</ThemedText>
      <View style={styles.matchingContainer}>
        {matchingGame.slice(0, 3).map((item) => (
          <View key={item.number} style={styles.matchingRow}>
            <TouchableOpacity style={styles.numberBox}>
              <ThemedText style={styles.matchingNumber}>{item.number}</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.matchingArrow}>→</ThemedText>
            <TouchableOpacity style={styles.wordBox}>
              <ThemedText style={styles.matchingWord}>{item.word}</ThemedText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <ThemedText style={styles.hintText}>Tap to practice counting!</ThemedText>
    </View>
  );

  const renderMemoryGame = () => (
    <View style={styles.gameContainer}>
      <LearningBuddy message="Find matching pairs!" buddy="star" />
      <MemoryGame
        cards={memoryCards}
        onComplete={() => {
          const finalScore = score + 20;
          setGameResults({ score: finalScore, total: memoryCards.length, correct: memoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#FFE5E5"
      />
    </View>
  );

  const renderPatternGame = () => (
    <View style={styles.gameContainer}>
      <LearningBuddy message="Find the missing piece!" buddy="star" />
      <PatternGame
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
    setCountingAnswer(null);
    setAdditionAnswer(null);
    setQuizCompleted(false);
  };

  const handleGoHome = () => {
    setShowResultsModal(false);
    setSelectedGame(null);
    setScore(0);
    setCountingQuestionIndex(0);
    setAdditionQuestionIndex(0);
    setCountingAnswer(null);
    setAdditionAnswer(null);
    setQuizCompleted(false);
  };

  const handleNextGame = () => {
    setShowResultsModal(false);
    const currentGameIndex = games.findIndex(g => g.id === selectedGame);
    if (currentGameIndex < games.length - 1) {
      setSelectedGame(games[currentGameIndex + 1].id);
      setScore(0);
      setCountingQuestionIndex(0);
      setAdditionQuestionIndex(0);
      setCountingAnswer(null);
      setAdditionAnswer(null);
      setQuizCompleted(false);
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
        />
        <Confetti show={showConfetti} />
        <Celebration message={celebrationMessage} show={showCelebration} />
        <View style={styles.topBar}>
          <TouchableOpacity 
            onPress={handleGoHome}
            style={styles.backButton}
          >
            <ThemedText style={styles.backText}>← Back</ThemedText>
          </TouchableOpacity>
          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreText}>Score: {score}</ThemedText>
          </View>
        </View>
        <ScrollView style={styles.gameScreen}>
          {selectedGame === 'counting' && renderCountingGame()}
          {selectedGame === 'addition' && renderAdditionGame()}
          {selectedGame === 'matching' && renderMatchingGame()}
          {selectedGame === 'memory' && renderMemoryGame()}
          {selectedGame === 'patterns' && renderPatternGame()}
          {selectedGame === 'speedmath' && renderSpeedMathGame()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.mathHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backText}>← Home</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.mathTitle}>Math Games 🔢</ThemedText>
      </View>
      <ScrollView style={styles.gamesListContainer}>
        {games.map((game, idx) => (
          <TouchableOpacity
            key={game.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedGame(game.id);
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={game.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gameCard}
            >
              <View style={styles.gameCardLeft}>
                <View style={[styles.gameIconContainer, { backgroundColor: '#FF6B6B' }]}>
                  <MaterialCommunityIcons name={game.icon} size={36} color="#FFFFFF" />
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
  },
  mathTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FF6B6B',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
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
    padding: 20,
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
    padding: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFE5E5',
    borderStyle: 'dashed',
  },
  starsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  star: {
    fontSize: 40,
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
  matchingContainer: {
    width: '100%',
    marginBottom: 24,
  },
  matchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16,
  },
  numberBox: {
    backgroundColor: '#FFE5E5',
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  matchingNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  matchingArrow: {
    fontSize: 32,
    color: '#FF6B6B',
  },
  wordBox: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
    minWidth: 100,
    alignItems: 'center',
  },
  matchingWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  hintText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});
