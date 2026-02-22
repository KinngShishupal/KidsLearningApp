import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Celebration } from '@/components/celebration';
import { MemoryGame } from '@/components/memory-game';
import { LearningBuddy } from '@/components/learning-buddy';
import { TimedQuiz } from '@/components/timed-quiz';
import { Confetti } from '@/components/confetti';
import { GameResultsModal } from '@/components/game-results-modal';
import { AnswerFeedback } from '@/components/answer-feedback';

export default function ScienceScreen() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [animalQuestionIndex, setAnimalQuestionIndex] = useState(0);
  const [planetQuestionIndex, setPlanetQuestionIndex] = useState(0);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [gameResults, setGameResults] = useState({ score: 0, total: 0, correct: 0 });
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState(false);

  const showCelebrationWithMessage = (message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const games = [
    { id: 'animals', title: '🦁 Animal Sounds', description: 'Match animals to their sounds!' },
    { id: 'planets', title: '🌍 Solar System', description: 'Learn about planets!' },
    { id: 'nature', title: '🌺 Nature Quiz', description: 'Explore plants and nature!' },
    { id: 'memory', title: '🧠 Animal Memory', description: 'Match the animals!' },
    { id: 'speedscience', title: '⚡ Science Challenge', description: 'Quick science quiz!' },
  ];

  const animalMemoryCards = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];

  const scienceQuestions = [
    { question: 'Which animal lives in water?', options: ['Cat', 'Fish', 'Dog', 'Bird'], correctAnswer: 'Fish', emoji: '🐠' },
    { question: 'What do bees make?', options: ['Milk', 'Honey', 'Eggs', 'Wool'], correctAnswer: 'Honey', emoji: '🐝' },
    { question: 'Where do birds live?', options: ['Nests', 'Caves', 'Ocean', 'Desert'], correctAnswer: 'Nests', emoji: '🐦' },
    { question: 'What color is the sun?', options: ['Blue', 'Green', 'Yellow', 'Purple'], correctAnswer: 'Yellow', emoji: '☀️' },
    { question: 'How many legs does a spider have?', options: ['6', '8', '4', '10'], correctAnswer: '8', emoji: '🕷️' },
  ];

  const animalQuizzes = [
    { question: 'What sound does a lion make?', animal: '🦁', options: ['Meow', 'Roar', 'Woof', 'Quack'], answer: 'Roar' },
    { question: 'What sound does a cow make?', animal: '🐮', options: ['Moo', 'Baa', 'Oink', 'Neigh'], answer: 'Moo' },
    { question: 'What sound does a cat make?', animal: '🐱', options: ['Woof', 'Meow', 'Roar', 'Chirp'], answer: 'Meow' },
    { question: 'What sound does a bird make?', animal: '🐦', options: ['Moo', 'Roar', 'Chirp', 'Hiss'], answer: 'Chirp' },
  ];

  const planetQuizzes = [
    {
      question: 'Which planet is closest to the Sun?',
      options: [
        { name: 'Mercury', emoji: '☿️', color: '#B0B0B0' },
        { name: 'Venus', emoji: '♀️', color: '#FFC649' },
        { name: 'Earth', emoji: '🌍', color: '#4A90E2' },
        { name: 'Mars', emoji: '♂️', color: '#E27B58' },
      ],
      answer: 'Mercury',
    },
    {
      question: 'Which planet do we live on?',
      options: [
        { name: 'Mercury', emoji: '☿️', color: '#B0B0B0' },
        { name: 'Venus', emoji: '♀️', color: '#FFC649' },
        { name: 'Earth', emoji: '🌍', color: '#4A90E2' },
        { name: 'Mars', emoji: '♂️', color: '#E27B58' },
      ],
      answer: 'Earth',
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: [
        { name: 'Mercury', emoji: '☿️', color: '#B0B0B0' },
        { name: 'Venus', emoji: '♀️', color: '#FFC649' },
        { name: 'Earth', emoji: '🌍', color: '#4A90E2' },
        { name: 'Mars', emoji: '♂️', color: '#E27B58' },
      ],
      answer: 'Mars',
    },
  ];

  const animalQuiz = animalQuizzes[animalQuestionIndex];
  const planetQuiz = planetQuizzes[planetQuestionIndex];

  const natureQuiz = {
    question: 'What does a plant need to grow?',
    options: [
      { text: '☀️ Sunlight', correct: true },
      { text: '💧 Water', correct: true },
      { text: '🍕 Pizza', correct: false },
      { text: '🌱 Soil', correct: true },
    ],
  };

  const handleAnimalAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === animalQuiz.answer;
    
    setAnswerIsCorrect(isCorrect);
    setShowAnswerFeedback(true);
    
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      setTimeout(() => {
        setShowAnswerFeedback(false);
        if (animalQuestionIndex < animalQuizzes.length - 1) {
          setAnimalQuestionIndex(animalQuestionIndex + 1);
          setSelectedAnswer(null);
        } else {
          setGameResults({ score: newScore, total: animalQuizzes.length, correct: animalQuestionIndex + 1 });
          setShowResultsModal(true);
        }
      }, 1500);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        setShowAnswerFeedback(false);
        setGameResults({ score, total: animalQuizzes.length, correct: animalQuestionIndex });
        setShowResultsModal(true);
      }, 1500);
    }
  };

  const handlePlanetAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === planetQuiz.answer;
    
    setAnswerIsCorrect(isCorrect);
    setShowAnswerFeedback(true);
    
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      setTimeout(() => {
        setShowAnswerFeedback(false);
        if (planetQuestionIndex < planetQuizzes.length - 1) {
          setPlanetQuestionIndex(planetQuestionIndex + 1);
          setSelectedAnswer(null);
        } else {
          setGameResults({ score: newScore, total: planetQuizzes.length, correct: planetQuestionIndex + 1 });
          setShowResultsModal(true);
        }
      }, 1500);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        setShowAnswerFeedback(false);
        setGameResults({ score, total: planetQuizzes.length, correct: planetQuestionIndex });
        setShowResultsModal(true);
      }, 1500);
    }
  };

  const renderAnimalGame = () => (
    <View style={styles.gameContainer}>
      <ThemedText style={styles.questionProgress}>
        Question {animalQuestionIndex + 1} of {animalQuizzes.length}
      </ThemedText>
      <ThemedText style={styles.gameQuestion}>{animalQuiz.question}</ThemedText>
      <ThemedText style={styles.animalEmoji}>{animalQuiz.animal}</ThemedText>
      <View style={styles.optionsGrid}>
        {animalQuiz.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.soundButton,
              selectedAnswer === option && styles.selectedSoundButton,
            ]}
            onPress={() => handleAnimalAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            <ThemedText style={styles.soundText}>{option}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPlanetGame = () => (
    <View style={styles.gameContainer}>
      <ThemedText style={styles.questionProgress}>
        Question {planetQuestionIndex + 1} of {planetQuizzes.length}
      </ThemedText>
      <ThemedText style={styles.gameQuestion}>{planetQuiz.question}</ThemedText>
      <View style={styles.planetsContainer}>
        {planetQuiz.options.map((planet) => (
          <TouchableOpacity
            key={planet.name}
            style={[
              styles.planetButton,
              { backgroundColor: planet.color },
              selectedAnswer === planet.name && styles.selectedPlanetButton,
            ]}
            onPress={() => handlePlanetAnswer(planet.name)}
            disabled={selectedAnswer !== null}
          >
            <ThemedText style={styles.planetEmoji}>{planet.emoji}</ThemedText>
            <ThemedText style={styles.planetName}>{planet.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderNatureGame = () => (
    <View style={styles.gameContainer}>
      <ThemedText style={styles.gameQuestion}>{natureQuiz.question}</ThemedText>
      <View style={styles.natureGrid}>
        {natureQuiz.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.natureButton,
              option.correct ? styles.correctNature : styles.incorrectNature,
            ]}
          >
            <ThemedText style={styles.natureText}>{option.text}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <ThemedText style={styles.hintText}>
        Tap each one to learn! Green means correct! 🌱
      </ThemedText>
    </View>
  );

  const renderMemoryGame = () => (
    <View style={styles.gameContainer}>
      <LearningBuddy message="Match the cute animals!" buddy="cat" />
      <MemoryGame
        cards={animalMemoryCards}
        onComplete={() => {
          const finalScore = score + 20;
          setGameResults({ score: finalScore, total: animalMemoryCards.length, correct: animalMemoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#E8F8F5"
      />
    </View>
  );

  const renderSpeedScienceGame = () => (
    <View style={styles.gameContainer}>
      <LearningBuddy message="Test your science knowledge!" buddy="robot" />
      <TimedQuiz
        questions={scienceQuestions}
        timePerQuestion={12}
        onComplete={(finalScore, correctAnswers) => {
          setGameResults({ score: finalScore, total: scienceQuestions.length, correct: correctAnswers });
          setShowResultsModal(true);
        }}
        color="#4ECDC4"
      />
    </View>
  );

  const handleRestart = () => {
    setShowResultsModal(false);
    setScore(0);
    setAnimalQuestionIndex(0);
    setPlanetQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
  };

  const handleGoHome = () => {
    setShowResultsModal(false);
    setSelectedGame(null);
    setScore(0);
    setAnimalQuestionIndex(0);
    setPlanetQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
  };

  const handleNextGame = () => {
    setShowResultsModal(false);
    const currentGameIndex = games.findIndex(g => g.id === selectedGame);
    if (currentGameIndex < games.length - 1) {
      setSelectedGame(games[currentGameIndex + 1].id);
      setScore(0);
      setAnimalQuestionIndex(0);
      setPlanetQuestionIndex(0);
      setSelectedAnswer(null);
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
          color="#4ECDC4"
          gameTitle={games.find(g => g.id === selectedGame)?.title || 'Science Game'}
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
          {selectedGame === 'animals' && renderAnimalGame()}
          {selectedGame === 'planets' && renderPlanetGame()}
          {selectedGame === 'nature' && renderNatureGame()}
          {selectedGame === 'memory' && renderMemoryGame()}
          {selectedGame === 'speedscience' && renderSpeedScienceGame()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.scienceHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backText}>← Home</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.scienceTitle}>Science Adventures 🔬</ThemedText>
      </View>
      <ScrollView style={styles.gamesListContainer}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => setSelectedGame(game.id)}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.gameCardTitle}>{game.title}</ThemedText>
            <ThemedText style={styles.gameCardDescription}>{game.description}</ThemedText>
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
  scienceHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
  },
  scienceTitle: {
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
    backgroundColor: '#4ECDC4',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gameCardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 8,
  },
  gameCardDescription: {
    fontSize: 16,
    color: '#666',
  },
  gameScreen: {
    flex: 1,
    padding: 20,
  },
  gameContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  questionProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 12,
    textAlign: 'center',
  },
  gameQuestion: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 24,
    textAlign: 'center',
  },
  animalEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  soundButton: {
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4ECDC4',
  },
  selectedSoundButton: {
    backgroundColor: '#4ECDC4',
  },
  soundText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  planetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  planetButton: {
    width: 140,
    height: 140,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  selectedPlanetButton: {
    borderColor: '#FFD700',
    borderWidth: 5,
  },
  planetEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  planetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  natureGrid: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  natureButton: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 3,
  },
  correctNature: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  incorrectNature: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
  natureText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  hintText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
