import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { soundManager } from '@/utils/sound-manager';
import { Celebration } from '@/components/celebration';
import { MemoryGame } from '@/components/memory-game';
import { LearningBuddy } from '@/components/learning-buddy';
import { TimedQuiz } from '@/components/timed-quiz';
import { Confetti } from '@/components/confetti';
import { GameResultsModal } from '@/components/game-results-modal';
import { AnswerFeedback } from '@/components/answer-feedback';
import { QuestionTimer } from '@/components/question-timer';

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
  const [natureSelectedAnswers, setNatureSelectedAnswers] = useState<Set<number>>(new Set());
  const [gameKey, setGameKey] = useState(0);
  const [natureQuestionIndex, setNatureQuestionIndex] = useState(0);
  const [natureTimeLeft, setNatureTimeLeft] = useState(10);
  const [natureTimerActive, setNatureTimerActive] = useState(true);
  const [animalTimeLeft, setAnimalTimeLeft] = useState(15);
  const [planetTimeLeft, setPlanetTimeLeft] = useState(12);
  const [timerActive, setTimerActive] = useState(true);

  const showCelebrationWithMessage = (message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const games = [
    { 
      id: 'animals', 
      title: 'Animal Sounds', 
      description: '10 animals • 15 seconds each', 
      icon: 'dog',
      difficulty: 'Easy',
      colors: ['#E0F7FA', '#B2EBF2']
    },
    { 
      id: 'planets', 
      title: 'Solar System', 
      description: '10 planets • 12 seconds each', 
      icon: 'earth',
      difficulty: 'Medium',
      colors: ['#E8F5E9', '#C8E6C9']
    },
    { 
      id: 'nature', 
      title: 'Nature Quiz', 
      description: '10 seconds per question!', 
      icon: 'flower',
      difficulty: 'Medium',
      colors: ['#E0F7FA', '#B2EBF2']
    },
    { 
      id: 'memory', 
      title: 'Animal Memory', 
      description: 'Match cute animals', 
      icon: 'brain',
      difficulty: 'Medium',
      colors: ['#E8F5E9', '#C8E6C9']
    },
    { 
      id: 'insectmemory', 
      title: 'Insect Memory', 
      description: 'Match tiny creatures', 
      icon: 'butterfly',
      difficulty: 'Medium',
      colors: ['#E8F5E9', '#C8E6C9']
    },
    { 
      id: 'seamemory', 
      title: 'Ocean Memory', 
      description: 'Match sea creatures', 
      icon: 'fish',
      difficulty: 'Easy',
      colors: ['#E0F7FA', '#B2EBF2']
    },
    { 
      id: 'speedscience', 
      title: 'Science Challenge', 
      description: 'Beat the clock!', 
      icon: 'lightning-bolt',
      difficulty: 'Hard',
      colors: ['#E1F5FE', '#B3E5FC']
    },
  ];

  const animalMemoryCards = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];
  const insectMemoryCards = ['🐝', '🦋', '🐞', '🦗', '🐛', '🦟'];
  const seaCreatureMemoryCards = ['🐠', '🐙', '🦈', '🐬', '🦀', '🐡'];

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
    { question: 'What sound does a dog make?', animal: '🐕', options: ['Meow', 'Woof', 'Moo', 'Quack'], answer: 'Woof' },
    { question: 'What sound does a sheep make?', animal: '🐑', options: ['Baa', 'Moo', 'Oink', 'Neigh'], answer: 'Baa' },
    { question: 'What sound does a pig make?', animal: '🐷', options: ['Moo', 'Baa', 'Oink', 'Chirp'], answer: 'Oink' },
    { question: 'What sound does a duck make?', animal: '🦆', options: ['Quack', 'Chirp', 'Roar', 'Meow'], answer: 'Quack' },
    { question: 'What sound does a horse make?', animal: '🐴', options: ['Neigh', 'Moo', 'Baa', 'Roar'], answer: 'Neigh' },
    { question: 'What sound does a frog make?', animal: '🐸', options: ['Ribbit', 'Chirp', 'Hiss', 'Woof'], answer: 'Ribbit' },
  ];

  const planetQuizzes = [
    {
      question: 'Which planet is closest to the Sun?',
      options: [
        { name: 'Mercury', emoji: '☀️', color: '#8B8B8B', description: 'Tiny & Gray' },
        { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
        { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
        { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
      ],
      answer: 'Mercury',
    },
    {
      question: 'Which planet do we live on?',
      options: [
        { name: 'Mercury', emoji: '☀️', color: '#8B8B8B', description: 'Tiny & Gray' },
        { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
        { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
        { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
      ],
      answer: 'Earth',
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: [
        { name: 'Mercury', emoji: '☀️', color: '#8B8B8B', description: 'Tiny & Gray' },
        { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
        { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
        { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
      ],
      answer: 'Mars',
    },
    {
      question: 'Which is the largest planet?',
      options: [
        { name: 'Jupiter', emoji: '🟤', color: '#D4A574', description: 'Giant' },
        { name: 'Saturn', emoji: '💍', color: '#F4D03F', description: 'Rings' },
        { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
        { name: 'Neptune', emoji: '🔵', color: '#4169E1', description: 'Blue' },
      ],
      answer: 'Jupiter',
    },
    {
      question: 'Which planet has beautiful rings?',
      options: [
        { name: 'Jupiter', emoji: '🟤', color: '#D4A574', description: 'Giant' },
        { name: 'Saturn', emoji: '💍', color: '#F4D03F', description: 'Rings' },
        { name: 'Uranus', emoji: '💙', color: '#7CB9E8', description: 'Tilted' },
        { name: 'Neptune', emoji: '🔵', color: '#4169E1', description: 'Blue' },
      ],
      answer: 'Saturn',
    },
    {
      question: 'Which planet is the hottest?',
      options: [
        { name: 'Mercury', emoji: '☀️', color: '#8B8B8B', description: 'Tiny & Gray' },
        { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
        { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
        { name: 'Jupiter', emoji: '🟤', color: '#D4A574', description: 'Giant' },
      ],
      answer: 'Venus',
    },
    {
      question: 'Which planet is known as the Blue Planet?',
      options: [
        { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
        { name: 'Neptune', emoji: '🔵', color: '#4169E1', description: 'Blue' },
        { name: 'Uranus', emoji: '💙', color: '#7CB9E8', description: 'Tilted' },
        { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
      ],
      answer: 'Neptune',
    },
    {
      question: 'Which planet has water and life?',
      options: [
        { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
        { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
        { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
        { name: 'Jupiter', emoji: '🟤', color: '#D4A574', description: 'Giant' },
      ],
      answer: 'Earth',
    },
    {
      question: 'Which is the smallest planet?',
      options: [
        { name: 'Mercury', emoji: '☀️', color: '#8B8B8B', description: 'Tiny & Gray' },
        { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
        { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
        { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
      ],
      answer: 'Mercury',
    },
    {
      question: 'Which planet is farthest from the Sun?',
      options: [
        { name: 'Neptune', emoji: '🔵', color: '#4169E1', description: 'Blue' },
        { name: 'Uranus', emoji: '💙', color: '#7CB9E8', description: 'Tilted' },
        { name: 'Saturn', emoji: '💍', color: '#F4D03F', description: 'Rings' },
        { name: 'Jupiter', emoji: '🟤', color: '#D4A574', description: 'Giant' },
      ],
      answer: 'Neptune',
    },
  ];

  const animalQuiz = animalQuizzes[animalQuestionIndex];
  const planetQuiz = planetQuizzes[planetQuestionIndex];

  const natureQuizzes = [
    {
      question: 'What does a plant need to grow?',
      options: [
        { text: '☀️ Sunlight', correct: true },
        { text: '💧 Water', correct: true },
        { text: '🍕 Pizza', correct: false },
        { text: '🌱 Soil', correct: true },
      ],
    },
    {
      question: 'Which of these are trees?',
      options: [
        { text: '🌲 Pine Tree', correct: true },
        { text: '🌻 Sunflower', correct: false },
        { text: '🌳 Oak Tree', correct: true },
        { text: '🌹 Rose', correct: false },
      ],
    },
    {
      question: 'What do bees make?',
      options: [
        { text: '🍯 Honey', correct: true },
        { text: '🥛 Milk', correct: false },
        { text: '🌼 Flowers', correct: false },
        { text: '🐝 More Bees', correct: true },
      ],
    },
    {
      question: 'Which animals can fly?',
      options: [
        { text: '🐦 Bird', correct: true },
        { text: '🐟 Fish', correct: false },
        { text: '🦋 Butterfly', correct: true },
        { text: '🐘 Elephant', correct: false },
      ],
    },
    {
      question: 'What comes from clouds?',
      options: [
        { text: '🌧️ Rain', correct: true },
        { text: '🍔 Burgers', correct: false },
        { text: '❄️ Snow', correct: true },
        { text: '🎈 Balloons', correct: false },
      ],
    },
  ];

  const natureQuiz = natureQuizzes[natureQuestionIndex];
  const timerProgress = useSharedValue(100);

  useEffect(() => {
    if (selectedGame === 'nature') {
      setNatureTimeLeft(10);
      setNatureTimerActive(true);
      setNatureSelectedAnswers(new Set());
    }
  }, [selectedGame, natureQuestionIndex]);

  useEffect(() => {
    if (selectedGame === 'nature' && natureTimerActive) {
      const timer = setInterval(() => {
        setNatureTimeLeft((prev) => {
          if (prev <= 1) {
            setNatureTimerActive(false);
            const correctCount = natureQuiz.options.filter(o => o.correct).length;
            const correctAnswered = Array.from(natureSelectedAnswers).filter(idx => natureQuiz.options[idx].correct).length;
            const totalCorrect = (natureQuestionIndex * correctCount) + correctAnswered;
            const totalQuestions = natureQuizzes.reduce((sum, q) => sum + q.options.filter(o => o.correct).length, 0);
            setTimeout(() => {
              setGameResults({ score, total: totalQuestions, correct: totalCorrect });
              setShowResultsModal(true);
            }, 100);
            return 10;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedGame, natureQuestionIndex, natureTimerActive, natureSelectedAnswers]);

  useEffect(() => {
    if (selectedGame === 'nature') {
      timerProgress.value = withTiming((natureTimeLeft / 10) * 100, { duration: 1000 });
    }
  }, [natureTimeLeft, selectedGame]);

  const timerProgressStyle = useAnimatedStyle(() => ({
    width: `${timerProgress.value}%`,
  }));

  useEffect(() => {
    if (selectedGame === 'animals' && timerActive && selectedAnswer === null) {
      const timer = setInterval(() => {
        setAnimalTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setTimeout(() => {
              setGameResults({ score, total: animalQuizzes.length, correct: animalQuestionIndex });
              setShowResultsModal(true);
            }, 100);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedGame, animalQuestionIndex, timerActive, selectedAnswer]);

  useEffect(() => {
    if (selectedGame === 'planets' && timerActive && selectedAnswer === null) {
      const timer = setInterval(() => {
        setPlanetTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setTimeout(() => {
              setGameResults({ score, total: planetQuizzes.length, correct: planetQuestionIndex });
              setShowResultsModal(true);
            }, 100);
            return 12;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedGame, planetQuestionIndex, timerActive, selectedAnswer]);

  const handleAnimalAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === animalQuiz.answer;
    
    setAnswerIsCorrect(isCorrect);
    setShowAnswerFeedback(true);
    
    if (isCorrect) {
      soundManager.playSound('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      setTimeout(() => {
        setShowAnswerFeedback(false);
        if (animalQuestionIndex < animalQuizzes.length - 1) {
          setAnimalQuestionIndex(animalQuestionIndex + 1);
          setSelectedAnswer(null);
          setAnimalTimeLeft(15);
          setTimerActive(true);
        } else {
          setGameResults({ score: newScore, total: animalQuizzes.length, correct: animalQuestionIndex + 1 });
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
      soundManager.playSound('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      setTimeout(() => {
        setShowAnswerFeedback(false);
        if (planetQuestionIndex < planetQuizzes.length - 1) {
          setPlanetQuestionIndex(planetQuestionIndex + 1);
          setSelectedAnswer(null);
          setPlanetTimeLeft(12);
          setTimerActive(true);
        } else {
          setGameResults({ score: newScore, total: planetQuizzes.length, correct: planetQuestionIndex + 1 });
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
        setGameResults({ score, total: planetQuizzes.length, correct: planetQuestionIndex });
        setShowResultsModal(true);
      }, 1500);
    }
  };

  const renderAnimalGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={styles.progressBadge}>
          <MaterialCommunityIcons name="progress-check" size={16} color="#4ECDC4" />
          <ThemedText style={styles.questionProgress}>
            {animalQuestionIndex + 1}/{animalQuizzes.length}
          </ThemedText>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: '#4ECDC4' }]}>
          <MaterialCommunityIcons name="paw" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Animals</ThemedText>
        </View>
      </View>

      <QuestionTimer timeLeft={animalTimeLeft} totalTime={15} color="#4ECDC4" />

      <View style={styles.questionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#E8F8F5' }]}>
          <MaterialCommunityIcons name="paw" size={40} color="#4ECDC4" />
        </View>
        <ThemedText style={styles.gameQuestion}>{animalQuiz.question}</ThemedText>
        
        <View style={styles.animalDisplayCard}>
          <ThemedText style={styles.animalEmoji}>{animalQuiz.animal}</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.instructionText}>What sound does it make?</ThemedText>
      <View style={styles.optionsGrid}>
        {animalQuiz.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.modernSoundButton,
              selectedAnswer === option && (option === animalQuiz.answer ? styles.correctSoundButton : styles.incorrectSoundButton),
            ]}
            onPress={() => handleAnimalAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            <MaterialCommunityIcons 
              name="volume-high" 
              size={24} 
              color={selectedAnswer === option ? '#FFFFFF' : '#4ECDC4'} 
            />
            <ThemedText style={[
              styles.soundText,
              selectedAnswer === option && styles.selectedSoundText,
            ]}>{option}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPlanetGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={styles.progressBadge}>
          <MaterialCommunityIcons name="progress-check" size={16} color="#4ECDC4" />
          <ThemedText style={styles.questionProgress}>
            {planetQuestionIndex + 1}/{planetQuizzes.length}
          </ThemedText>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: '#4ECDC4' }]}>
          <MaterialCommunityIcons name="earth" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Planets</ThemedText>
        </View>
      </View>

      <QuestionTimer timeLeft={planetTimeLeft} totalTime={12} color="#4ECDC4" />

      <View style={styles.questionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#E8F8F5' }]}>
          <MaterialCommunityIcons name="space-station" size={40} color="#4ECDC4" />
        </View>
        <ThemedText style={styles.gameQuestion}>{planetQuiz.question}</ThemedText>
      </View>

      <ThemedText style={styles.instructionText}>Select the correct planet:</ThemedText>
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
            <View style={styles.planetEmojiContainer}>
              <ThemedText style={styles.planetEmoji}>{planet.emoji}</ThemedText>
            </View>
            <ThemedText style={styles.planetName}>{planet.name}</ThemedText>
            <ThemedText style={styles.planetDescription}>{planet.description}</ThemedText>
            {selectedAnswer === planet.name && planet.name === planetQuiz.answer && (
              <View style={styles.checkMark}>
                <MaterialCommunityIcons name="check-circle" size={32} color="#4CAF50" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const handleNatureAnswer = (index: number, isCorrect: boolean) => {
    const newAnswers = new Set(natureSelectedAnswers);
    newAnswers.add(index);
    setNatureSelectedAnswers(newAnswers);

    if (isCorrect) {
      soundManager.playSound('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      const correctCount = natureQuiz.options.filter(o => o.correct).length;
      const correctAnswered = Array.from(newAnswers).filter(idx => natureQuiz.options[idx].correct).length;
      
      if (correctAnswered === correctCount) {
        setNatureTimerActive(false);
        setTimeout(() => {
          if (natureQuestionIndex < natureQuizzes.length - 1) {
            setNatureQuestionIndex(natureQuestionIndex + 1);
            setNatureSelectedAnswers(new Set());
            setScore(newScore);
            setNatureTimeLeft(10);
            setNatureTimerActive(true);
          } else {
            setGameResults({ score: newScore, total: natureQuizzes.length * correctCount, correct: natureQuizzes.length * correctCount });
            setShowResultsModal(true);
          }
        }, 1200);
      }
    } else {
      setNatureTimerActive(false);
      soundManager.playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        const totalCorrect = (natureQuestionIndex * natureQuiz.options.filter(o => o.correct).length) + 
                             Array.from(newAnswers).filter(idx => natureQuiz.options[idx].correct).length;
        const totalQuestions = natureQuizzes.reduce((sum, q) => sum + q.options.filter(o => o.correct).length, 0);
        setGameResults({ score, total: totalQuestions, correct: totalCorrect });
        setShowResultsModal(true);
      }, 800);
    }
  };

  const renderNatureGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={styles.progressBadge}>
          <MaterialCommunityIcons name="progress-check" size={16} color="#4ECDC4" />
          <ThemedText style={styles.questionProgress}>
            {natureQuestionIndex + 1}/{natureQuizzes.length}
          </ThemedText>
        </View>
        <View style={styles.timerBadge}>
          <MaterialCommunityIcons 
            name={natureTimeLeft <= 3 ? "clock-alert" : "clock-outline"} 
            size={18} 
            color={natureTimeLeft <= 3 ? "#F44336" : "#4ECDC4"} 
          />
          <ThemedText style={[
            styles.timerText,
            { color: natureTimeLeft <= 3 ? "#F44336" : "#4ECDC4" }
          ]}>{natureTimeLeft}s</ThemedText>
        </View>
      </View>

      <View style={styles.timerProgressBarContainer}>
        <Animated.View 
          style={[
            styles.timerProgressBar, 
            { backgroundColor: natureTimeLeft <= 3 ? "#F44336" : "#4ECDC4" },
            timerProgressStyle
          ]} 
        />
      </View>

      <View style={styles.questionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#E8F8F5' }]}>
          <MaterialCommunityIcons name="leaf" size={40} color="#4ECDC4" />
        </View>
        <ThemedText style={styles.gameQuestion}>{natureQuiz.question}</ThemedText>
        <View style={styles.multiSelectBadge}>
          <MaterialCommunityIcons name="checkbox-multiple-marked" size={20} color="#4ECDC4" />
          <ThemedText style={styles.multiSelectText}>Select ALL correct answers!</ThemedText>
        </View>
      </View>

      <View style={styles.natureGrid}>
        {natureQuiz.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.natureButton,
              natureSelectedAnswers.has(index) && (option.correct ? styles.correctNature : styles.incorrectNature),
            ]}
            onPress={() => handleNatureAnswer(index, option.correct)}
            disabled={natureSelectedAnswers.has(index)}
          >
            <View style={styles.natureButtonContent}>
              <ThemedText style={[
                styles.natureText,
                natureSelectedAnswers.has(index) && styles.natureTextSelected,
              ]}>{option.text}</ThemedText>
              {natureSelectedAnswers.has(index) && (
                <MaterialCommunityIcons 
                  name={option.correct ? "check-circle" : "close-circle"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <ThemedText style={styles.hintText}>
        {natureSelectedAnswers.size === 0 
          ? 'Tap your answers! You can select multiple.' 
          : `Selected ${natureSelectedAnswers.size}/${natureQuiz.options.filter(o => o.correct).length} correct answers`}
      </ThemedText>
    </View>
  );

  const renderMemoryGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#4ECDC4' }]}>
          <MaterialCommunityIcons name="brain" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Animal Memory</ThemedText>
        </View>
      </View>

      <View style={styles.memoryInstructionCard}>
        <MaterialCommunityIcons name="lightbulb-on" size={32} color="#FFD93D" />
        <ThemedText style={styles.memoryInstruction}>
          Tap cards to flip them. Match the cute animals!
        </ThemedText>
      </View>

      <MemoryGame
        key={`animalmemory-${gameKey}`}
        cards={animalMemoryCards}
        onComplete={() => {
          const finalScore = score + 20;
          setGameResults({ score: finalScore, total: animalMemoryCards.length, correct: animalMemoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#E8F8F5"
        cardFrontColors={['#4ECDC4', '#44A08D']}
      />
    </View>
  );

  const renderInsectMemoryGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#4ECDC4' }]}>
          <MaterialCommunityIcons name="butterfly" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Insect Memory</ThemedText>
        </View>
      </View>

      <View style={styles.memoryInstructionCard}>
        <MaterialCommunityIcons name="lightbulb-on" size={32} color="#FFD93D" />
        <ThemedText style={styles.memoryInstruction}>
          Match tiny creatures! Explore the insect world!
        </ThemedText>
      </View>

      <MemoryGame
        key={`insectmemory-${gameKey}`}
        cards={insectMemoryCards}
        onComplete={() => {
          const finalScore = score + 25;
          setGameResults({ score: finalScore, total: insectMemoryCards.length, correct: insectMemoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#E8F5E9"
        cardFrontColors={['#8BC34A', '#689F38']}
      />
    </View>
  );

  const renderSeaMemoryGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#4ECDC4' }]}>
          <MaterialCommunityIcons name="fish" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Ocean Memory</ThemedText>
        </View>
      </View>

      <View style={styles.memoryInstructionCard}>
        <MaterialCommunityIcons name="lightbulb-on" size={32} color="#FFD93D" />
        <ThemedText style={styles.memoryInstruction}>
          Dive deep! Match amazing sea creatures!
        </ThemedText>
      </View>

      <MemoryGame
        key={`seamemory-${gameKey}`}
        cards={seaCreatureMemoryCards}
        onComplete={() => {
          const finalScore = score + 20;
          setGameResults({ score: finalScore, total: seaCreatureMemoryCards.length, correct: seaCreatureMemoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#E0F7FA"
        cardFrontColors={['#00BCD4', '#0097A7']}
      />
    </View>
  );

  const renderSpeedScienceGame = () => (
    <View style={styles.gameContainer}>
      <LearningBuddy message="Test your science knowledge!" buddy="robot" />
      <TimedQuiz
        key={`speedscience-${gameKey}`}
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
    setNatureQuestionIndex(0);
    setSelectedAnswer(null);
    setNatureSelectedAnswers(new Set());
    setAnimalTimeLeft(15);
    setPlanetTimeLeft(12);
    setNatureTimeLeft(10);
    setTimerActive(true);
    setNatureTimerActive(true);
    setQuizCompleted(false);
    setGameKey(gameKey + 1);
  };

  const handleGoHome = () => {
    setShowResultsModal(false);
    setSelectedGame(null);
    setScore(0);
    setAnimalQuestionIndex(0);
    setPlanetQuestionIndex(0);
    setNatureQuestionIndex(0);
    setSelectedAnswer(null);
    setNatureSelectedAnswers(new Set());
    setAnimalTimeLeft(15);
    setPlanetTimeLeft(12);
    setNatureTimeLeft(10);
    setTimerActive(false);
    setNatureTimerActive(false);
    setQuizCompleted(false);
    setGameKey(0);
  };

  const handleNextGame = () => {
    setShowResultsModal(false);
    const currentGameIndex = games.findIndex(g => g.id === selectedGame);
    if (currentGameIndex < games.length - 1) {
      setSelectedGame(games[currentGameIndex + 1].id);
      setScore(0);
      setAnimalQuestionIndex(0);
      setPlanetQuestionIndex(0);
      setNatureQuestionIndex(0);
      setSelectedAnswer(null);
      setNatureSelectedAnswers(new Set());
      setAnimalTimeLeft(15);
      setPlanetTimeLeft(12);
      setNatureTimeLeft(10);
      setTimerActive(true);
      setNatureTimerActive(true);
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
          color="#4ECDC4"
          gameTitle={games.find(g => g.id === selectedGame)?.title || 'Science Game'}
          gameId={selectedGame || 'science'}
          subject="science"
        />
        <Confetti show={showConfetti} />
        <Celebration message={celebrationMessage} show={showCelebration} />
        <LinearGradient
          colors={['#4ECDC4', '#44A08D']}
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
          {selectedGame === 'animals' && renderAnimalGame()}
          {selectedGame === 'planets' && renderPlanetGame()}
          {selectedGame === 'nature' && renderNatureGame()}
          {selectedGame === 'memory' && renderMemoryGame()}
          {selectedGame === 'insectmemory' && renderInsectMemoryGame()}
          {selectedGame === 'seamemory' && renderSeaMemoryGame()}
          {selectedGame === 'speedscience' && renderSpeedScienceGame()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.scienceHeader}
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
            <MaterialCommunityIcons name="flask" size={36} color="#4ECDC4" />
          </View>
          <ThemedText style={styles.scienceTitle}>Science Adventures</ThemedText>
          <ThemedText style={styles.scienceSubtitle}>Explore and discover</ThemedText>
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
                <View style={[styles.gameIconContainer, { backgroundColor: '#4ECDC4' }]}>
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
                <MaterialCommunityIcons name="chevron-right" size={28} color="#4ECDC4" />
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
  scienceHeader: {
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
  scienceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scienceSubtitle: {
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
    color: '#4ECDC4',
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
    borderColor: '#E8F8F5',
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
  animalDisplayCard: {
    backgroundColor: '#E8F8F5',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#4ECDC4',
    minHeight: 180,
    overflow: 'visible',
  },
  animalEmoji: {
    fontSize: 88,
    lineHeight: 100,
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
  modernSoundButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 4,
    borderColor: '#E8F8F5',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  correctSoundButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  incorrectSoundButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#D32F2F',
  },
  soundText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  selectedSoundText: {
    color: '#FFFFFF',
  },
  planetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  planetButton: {
    width: 160,
    height: 180,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    position: 'relative',
    overflow: 'visible',
  },
  selectedPlanetButton: {
    borderColor: '#FFD700',
    borderWidth: 6,
    transform: [{ scale: 1.05 }],
  },
  planetEmojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'visible',
  },
  planetEmoji: {
    fontSize: 48,
    lineHeight: 56,
    textAlign: 'center',
    includeFontPadding: false,
  },
  planetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
    lineHeight: 22,
    includeFontPadding: false,
  },
  planetDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    includeFontPadding: false,
  },
  checkMark: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  natureGrid: {
    width: '100%',
    gap: 14,
    marginBottom: 20,
  },
  natureButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  natureButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderWidth: 3,
    borderColor: '#E8F8F5',
    borderRadius: 20,
  },
  correctNature: {
    backgroundColor: '#4CAF50',
  },
  incorrectNature: {
    backgroundColor: '#FF6B6B',
  },
  natureText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  natureTextSelected: {
    color: '#FFFFFF',
  },
  hintText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 12,
  },
  multiSelectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  multiSelectText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  natureButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
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
  timerProgressBarContainer: {
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
  timerProgressBar: {
    height: '100%',
    borderRadius: 5,
  },
});
