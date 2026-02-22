import { useState, useEffect } from 'react';
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
import { GameResultsModal } from '@/components/game-results-modal';
import { AnswerFeedback } from '@/components/answer-feedback';
import { QuestionTimer } from '@/components/question-timer';

export default function EnglishScreen() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [spellingInput, setSpellingInput] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [gameResults, setGameResults] = useState({ score: 0, total: 0, correct: 0 });
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [spellingQuestionIndex, setSpellingQuestionIndex] = useState(0);
  const [spellingTimeLeft, setSpellingTimeLeft] = useState(20);
  const [spellingTimerActive, setSpellingTimerActive] = useState(true);

  const showCelebrationWithMessage = (message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const games = [
    { 
      id: 'alphabet', 
      title: 'Alphabet Fun', 
      description: 'All 26 letters + Quiz mode!', 
      icon: 'alphabet-latin',
      difficulty: 'Easy',
      colors: ['#E8F5E9', '#C8E6C9']
    },
    { 
      id: 'spelling', 
      title: 'Spelling Bee', 
      description: '8 words to spell!', 
      icon: 'pencil',
      difficulty: 'Medium',
      colors: ['#F1F8E9', '#DCEDC8']
    },
    { 
      id: 'rhyming', 
      title: 'Rhyme Time', 
      description: 'Find rhyming words', 
      icon: 'music-note',
      difficulty: 'Medium',
      colors: ['#F1F8E9', '#DCEDC8']
    },
    { 
      id: 'memory', 
      title: 'Letter Memory', 
      description: 'Match letter symbols', 
      icon: 'brain',
      difficulty: 'Easy',
      colors: ['#E8F5E9', '#C8E6C9']
    },
    { 
      id: 'emojimemory', 
      title: 'Emoji Memory', 
      description: 'Match fun emojis', 
      icon: 'emoticon',
      difficulty: 'Easy',
      colors: ['#E8F5E9', '#C8E6C9']
    },
    { 
      id: 'foodmemory', 
      title: 'Food Memory', 
      description: 'Match yummy foods', 
      icon: 'food',
      difficulty: 'Medium',
      colors: ['#F1F8E9', '#DCEDC8']
    },
    { 
      id: 'vocabulary', 
      title: 'Vocabulary Quiz', 
      description: 'Beat the clock!', 
      icon: 'lightning-bolt',
      difficulty: 'Hard',
      colors: ['#E0F2F1', '#B2DFDB']
    },
  ];

  const letterMemoryCards = ['🅰️', '🅱️', '🆎', '🅾️', '🆑', '🆒'];
  const emojiMemoryCards = ['😀', '😎', '🥳', '🤓', '😴', '🤩'];
  const foodMemoryCards = ['🍕', '🍔', '🌮', '🍰', '🍪', '🥤'];

  const vocabularyQuestions = [
    { question: 'Which word means "big"?', options: ['Small', 'Large', 'Tiny', 'Little'], correctAnswer: 'Large', emoji: '📏' },
    { question: 'What is a baby dog called?', options: ['Kitten', 'Puppy', 'Calf', 'Chick'], correctAnswer: 'Puppy', emoji: '🐕' },
    { question: 'Which word rhymes with "cat"?', options: ['Dog', 'Hat', 'Bird', 'Fish'], correctAnswer: 'Hat', emoji: '🎩' },
    { question: 'What color is grass?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctAnswer: 'Green', emoji: '🌱' },
    { question: 'Opposite of "happy"?', options: ['Sad', 'Glad', 'Jolly', 'Merry'], correctAnswer: 'Sad', emoji: '😢' },
  ];

  const alphabetData = {
    A: { word: 'Apple', emoji: '🍎', sound: 'ah' },
    B: { word: 'Ball', emoji: '⚽', sound: 'buh' },
    C: { word: 'Cat', emoji: '🐱', sound: 'kuh' },
    D: { word: 'Dog', emoji: '🐕', sound: 'duh' },
    E: { word: 'Elephant', emoji: '🐘', sound: 'eh' },
    F: { word: 'Fish', emoji: '🐠', sound: 'fuh' },
    G: { word: 'Grapes', emoji: '🍇', sound: 'guh' },
    H: { word: 'Hat', emoji: '🎩', sound: 'huh' },
    I: { word: 'Ice Cream', emoji: '🍦', sound: 'ih' },
    J: { word: 'Juice', emoji: '🧃', sound: 'juh' },
    K: { word: 'Kite', emoji: '🪁', sound: 'kuh' },
    L: { word: 'Lion', emoji: '🦁', sound: 'luh' },
    M: { word: 'Moon', emoji: '🌙', sound: 'muh' },
    N: { word: 'Nest', emoji: '🪺', sound: 'nuh' },
    O: { word: 'Orange', emoji: '🍊', sound: 'oh' },
    P: { word: 'Pizza', emoji: '🍕', sound: 'puh' },
    Q: { word: 'Queen', emoji: '👸', sound: 'kwuh' },
    R: { word: 'Rainbow', emoji: '🌈', sound: 'ruh' },
    S: { word: 'Sun', emoji: '☀️', sound: 'sss' },
    T: { word: 'Tree', emoji: '🌳', sound: 'tuh' },
    U: { word: 'Umbrella', emoji: '☂️', sound: 'uh' },
    V: { word: 'Volcano', emoji: '🌋', sound: 'vuh' },
    W: { word: 'Watermelon', emoji: '🍉', sound: 'wuh' },
    X: { word: 'Xylophone', emoji: '🎵', sound: 'ks' },
    Y: { word: 'Yo-yo', emoji: '🪀', sound: 'yuh' },
    Z: { word: 'Zebra', emoji: '🦓', sound: 'zuh' },
  };

  const allLetters = Object.keys(alphabetData);
  const [alphabetMode, setAlphabetMode] = useState<'explore' | 'quiz'>('explore');
  const [alphabetQuizIndex, setAlphabetQuizIndex] = useState(0);
  const [alphabetQuizAnswered, setAlphabetQuizAnswered] = useState(false);

  const alphabetQuizQuestions = [
    { letter: 'A', options: ['🍎', '⚽', '🐱', '🐕'], answer: '🍎' },
    { letter: 'B', options: ['🍎', '⚽', '🐱', '🐕'], answer: '⚽' },
    { letter: 'C', options: ['🍎', '⚽', '🐱', '🐕'], answer: '🐱' },
    { letter: 'D', options: ['🍎', '⚽', '🐱', '🐕'], answer: '🐕' },
    { letter: 'E', options: ['🐘', '🐠', '🍇', '🎩'], answer: '🐘' },
    { letter: 'F', options: ['🐘', '🐠', '🍇', '🎩'], answer: '🐠' },
    { letter: 'L', options: ['🦁', '🌙', '🪺', '🍊'], answer: '🦁' },
    { letter: 'S', options: ['☀️', '🌈', '🌳', '🍕'], answer: '☀️' },
  ];

  const spellingWords = [
    { 
      word: 'CAT', 
      image: '🐱', 
      scrambledLetters: ['T', 'A', 'C', 'B', 'D', 'E'],
      hint: 'A furry pet that meows',
      difficulty: 'Easy',
      time: 20
    },
    { 
      word: 'DOG', 
      image: '🐕', 
      scrambledLetters: ['G', 'O', 'D', 'C', 'A', 'T'],
      hint: 'A pet that barks',
      difficulty: 'Easy',
      time: 20
    },
    { 
      word: 'SUN', 
      image: '☀️', 
      scrambledLetters: ['N', 'U', 'S', 'M', 'O', 'T'],
      hint: 'Bright in the sky',
      difficulty: 'Easy',
      time: 20
    },
    { 
      word: 'TREE', 
      image: '🌳', 
      scrambledLetters: ['E', 'T', 'R', 'E', 'A', 'S'],
      hint: 'Has leaves and bark',
      difficulty: 'Medium',
      time: 25
    },
    { 
      word: 'FISH', 
      image: '🐠', 
      scrambledLetters: ['H', 'I', 'S', 'F', 'D', 'K'],
      hint: 'Swims in water',
      difficulty: 'Medium',
      time: 25
    },
    { 
      word: 'BIRD', 
      image: '🐦', 
      scrambledLetters: ['R', 'B', 'I', 'D', 'P', 'T'],
      hint: 'Can fly in the sky',
      difficulty: 'Medium',
      time: 25
    },
    { 
      word: 'APPLE', 
      image: '🍎', 
      scrambledLetters: ['P', 'A', 'L', 'E', 'P', 'O', 'I', 'B'],
      hint: 'Red fruit, keeps doctor away',
      difficulty: 'Hard',
      time: 30
    },
    { 
      word: 'FLOWER', 
      image: '🌸', 
      scrambledLetters: ['W', 'F', 'L', 'O', 'E', 'R', 'T', 'S'],
      hint: 'Beautiful plant that blooms',
      difficulty: 'Hard',
      time: 30
    },
  ];

  const spellingGame = spellingWords[spellingQuestionIndex];
  const [showSpellingHint, setShowSpellingHint] = useState(false);

  const rhymingGame = {
    word: 'CAT',
    emoji: '🐱',
    options: [
      { word: 'HAT', emoji: '🎩', rhymes: true },
      { word: 'DOG', emoji: '🐕', rhymes: false },
      { word: 'BAT', emoji: '🦇', rhymes: true },
      { word: 'CAR', emoji: '🚗', rhymes: false },
    ],
  };

  const handleLetterPress = (letter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedLetter(letter);
  };

  const handleAlphabetQuizAnswer = (emoji: string) => {
    const currentQuestion = alphabetQuizQuestions[alphabetQuizIndex];
    const isCorrect = emoji === currentQuestion.answer;
    
    setAlphabetQuizAnswered(true);
    
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      setTimeout(() => {
        if (alphabetQuizIndex < alphabetQuizQuestions.length - 1) {
          setAlphabetQuizIndex(alphabetQuizIndex + 1);
          setAlphabetQuizAnswered(false);
        } else {
          setGameResults({ score: newScore, total: alphabetQuizQuestions.length, correct: alphabetQuizIndex + 1 });
          setShowResultsModal(true);
        }
      }, 1500);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        setGameResults({ score, total: alphabetQuizQuestions.length, correct: alphabetQuizIndex });
        setShowResultsModal(true);
      }, 1500);
    }
  };

  useEffect(() => {
    if (selectedGame === 'spelling' && spellingTimerActive && spellingGame && spellingInput.length < spellingGame.word.length) {
      const timer = setInterval(() => {
        setSpellingTimeLeft((prev) => {
          if (prev <= 1) {
            setSpellingTimerActive(false);
            setTimeout(() => {
              setGameResults({ score, total: spellingWords.length, correct: spellingQuestionIndex });
              setShowResultsModal(true);
            }, 100);
            return spellingGame?.time || 20;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedGame, spellingQuestionIndex, spellingTimerActive, spellingInput, spellingGame]);

  const handleSpellingLetter = (letter: string) => {
    if (spellingInput.length >= spellingGame.word.length) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newInput = [...spellingInput, letter];
    setSpellingInput(newInput);
    
    if (newInput.join('') === spellingGame.word) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSpellingTimerActive(false);
      const newScore = score + 15;
      setScore(newScore);
      showCelebrationWithMessage('Perfect spelling!');
      
      setTimeout(() => {
        if (spellingQuestionIndex < spellingWords.length - 1) {
          setSpellingQuestionIndex(spellingQuestionIndex + 1);
          setSpellingInput([]);
          setShowSpellingHint(false);
          setSpellingTimeLeft(spellingWords[spellingQuestionIndex + 1].time);
          setSpellingTimerActive(true);
        } else {
          setGameResults({ score: newScore, total: spellingWords.length, correct: spellingQuestionIndex + 1 });
          setShowResultsModal(true);
        }
      }, 2000);
    } else if (newInput.length === spellingGame.word.length && newInput.join('') !== spellingGame.word) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setSpellingTimerActive(false);
      setTimeout(() => {
        setGameResults({ score, total: spellingWords.length, correct: spellingQuestionIndex });
        setShowResultsModal(true);
      }, 1000);
    }
  };

  const clearSpelling = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSpellingInput([]);
  };

  const removeLastLetter = () => {
    if (spellingInput.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSpellingInput(spellingInput.slice(0, -1));
    }
  };

  const [rhymeAttempts, setRhymeAttempts] = useState(0);
  const [rhymeCorrect, setRhymeCorrect] = useState(0);

  const handleRhymeAnswer = (word: string, rhymes: boolean) => {
    const newAttempts = rhymeAttempts + 1;
    setRhymeAttempts(newAttempts);

    if (rhymes) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      const newCorrect = rhymeCorrect + 1;
      setScore(newScore);
      setRhymeCorrect(newCorrect);
      showCelebrationWithMessage(`Yes! ${word} rhymes!`);
      
      if (newAttempts >= rhymingGame.options.length) {
        setTimeout(() => {
          setGameResults({ score: newScore, total: rhymingGame.options.filter(o => o.rhymes).length, correct: newCorrect });
          setShowResultsModal(true);
        }, 1500);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        setGameResults({ score, total: rhymingGame.options.filter(o => o.rhymes).length, correct: rhymeCorrect });
        setShowResultsModal(true);
      }, 500);
    }
  };

  const renderAlphabetExplore = () => (
    <>
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, alphabetMode === 'explore' && styles.modeButtonActive]}
          onPress={() => setAlphabetMode('explore')}
        >
          <MaterialCommunityIcons name="book-open-page-variant" size={20} color={alphabetMode === 'explore' ? '#FFFFFF' : '#56C596'} />
          <ThemedText style={[styles.modeButtonText, alphabetMode === 'explore' && styles.modeButtonTextActive]}>
            Explore
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, alphabetMode === 'quiz' && styles.modeButtonActive]}
          onPress={() => setAlphabetMode('quiz')}
        >
          <MaterialCommunityIcons name="head-question" size={20} color={alphabetMode === 'quiz' ? '#FFFFFF' : '#56C596'} />
          <ThemedText style={[styles.modeButtonText, alphabetMode === 'quiz' && styles.modeButtonTextActive]}>
            Quiz
          </ThemedText>
        </TouchableOpacity>
      </View>

      {selectedLetter && (
        <View style={styles.selectedLetterDisplay}>
          <View style={styles.bigLetterCircle}>
            <ThemedText style={styles.bigLetter}>{selectedLetter}</ThemedText>
          </View>
          <View style={styles.selectedLetterInfo}>
            <ThemedText style={styles.selectedEmoji}>
              {alphabetData[selectedLetter as keyof typeof alphabetData]?.emoji}
            </ThemedText>
            <ThemedText style={styles.selectedWord}>
              {alphabetData[selectedLetter as keyof typeof alphabetData]?.word}
            </ThemedText>
            <View style={styles.soundBadge}>
              <MaterialCommunityIcons name="volume-high" size={16} color="#56C596" />
              <ThemedText style={styles.soundText}>
                "{alphabetData[selectedLetter as keyof typeof alphabetData]?.sound}"
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      <View style={styles.alphabetGridContainer}>
        <View style={styles.alphabetGrid}>
          {allLetters.map((letter) => (
            <TouchableOpacity
              key={letter}
              style={[
                styles.letterCard,
                selectedLetter === letter && styles.selectedLetterCard,
              ]}
              onPress={() => handleLetterPress(letter)}
            >
              <LinearGradient
                colors={selectedLetter === letter ? ['#56C596', '#3AA76D'] : ['#FFFFFF', '#E8F8E8']}
                style={styles.letterCardContent}
              >
                <ThemedText style={[
                  styles.letterText,
                  selectedLetter === letter && styles.selectedLetterText,
                ]}>{letter}</ThemedText>
                <ThemedText style={[styles.miniEmoji, selectedLetter === letter && styles.miniEmojiSelected]}>
                  {alphabetData[letter as keyof typeof alphabetData]?.emoji}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  const renderAlphabetQuiz = () => {
    const currentQuestion = alphabetQuizQuestions[alphabetQuizIndex];
    const letterData = alphabetData[currentQuestion.letter as keyof typeof alphabetData];
    
    return (
      <View style={styles.quizContentContainer}>
        <View style={styles.questionCard}>
          <ThemedText style={styles.gameQuestion}>Which picture starts with:</ThemedText>
          <View style={styles.quizLetterDisplay}>
            <ThemedText style={styles.quizLetter}>{currentQuestion.letter}</ThemedText>
            <View style={styles.soundBadge}>
              <MaterialCommunityIcons name="volume-high" size={16} color="#56C596" />
              <ThemedText style={styles.soundText}>"{letterData.sound}"</ThemedText>
            </View>
          </View>
        </View>

        <ThemedText style={styles.instructionText}>Tap the correct picture:</ThemedText>
        <View style={styles.quizOptionsGrid}>
          {currentQuestion.options.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.emojiQuizButton,
                alphabetQuizAnswered && emoji === currentQuestion.answer && styles.correctEmojiButton,
                alphabetQuizAnswered && emoji !== currentQuestion.answer && styles.incorrectEmojiButton,
              ]}
              onPress={() => handleAlphabetQuizAnswer(emoji)}
              disabled={alphabetQuizAnswered}
            >
              <ThemedText style={styles.quizEmoji}>{emoji}</ThemedText>
              {alphabetQuizAnswered && emoji === currentQuestion.answer && (
                <View style={styles.emojiCheckBadge}>
                  <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderAlphabetGame = () => (
    <View style={styles.alphabetGameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#56C596' }]}>
          <MaterialCommunityIcons name="alphabet-latin" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Alphabet</ThemedText>
        </View>
        {alphabetMode === 'quiz' && (
          <View style={styles.progressBadge}>
            <MaterialCommunityIcons name="progress-check" size={16} color="#56C596" />
            <ThemedText style={[styles.questionProgress, { color: '#56C596' }]}>
              {alphabetQuizIndex + 1}/{alphabetQuizQuestions.length}
            </ThemedText>
          </View>
        )}
      </View>

      <View style={styles.questionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#E8F8E8' }]}>
          <MaterialCommunityIcons name="format-letter-case" size={40} color="#56C596" />
        </View>
        <ThemedText style={styles.gameQuestion}>
          {alphabetMode === 'explore' ? 'Learn the Alphabet!' : 'Letter Recognition Quiz!'}
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          {alphabetMode === 'explore' ? 'Tap letters to see words and sounds' : 'Match letters to pictures'}
        </ThemedText>
      </View>

      {alphabetMode === 'explore' ? renderAlphabetExplore() : renderAlphabetQuiz()}
    </View>
  );

  const renderSpellingGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={styles.progressBadge}>
          <MaterialCommunityIcons name="progress-check" size={16} color="#56C596" />
          <ThemedText style={[styles.questionProgress, { color: '#56C596' }]}>
            {spellingQuestionIndex + 1}/{spellingWords.length}
          </ThemedText>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: '#56C596' }]}>
          <MaterialCommunityIcons name="pencil" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Spelling</ThemedText>
        </View>
      </View>

      <QuestionTimer timeLeft={spellingTimeLeft} totalTime={spellingGame.time} color="#56C596" />

      <View style={styles.spellingQuestionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#E8F8E8' }]}>
          <MaterialCommunityIcons name="spellcheck" size={40} color="#56C596" />
        </View>
        
        <View style={styles.difficultyBadgeSpelling}>
          <MaterialCommunityIcons 
            name={spellingGame.difficulty === 'Easy' ? 'signal-cellular-1' : 
                  spellingGame.difficulty === 'Medium' ? 'signal-cellular-2' : 'signal-cellular-3'} 
            size={16} 
            color="#FFFFFF" 
          />
          <ThemedText style={styles.difficultyTextWhite}>{spellingGame.difficulty}</ThemedText>
        </View>

        <ThemedText style={styles.gameQuestion}>Spell this word:</ThemedText>
      </View>

      <View style={styles.imageCard}>
        <View style={styles.emojiContainer}>
          <ThemedText style={styles.spellingEmoji}>{spellingGame.image}</ThemedText>
        </View>
        <ThemedText style={styles.wordLengthHint}>
          {spellingGame.word.length} letters
        </ThemedText>
      </View>

      {!showSpellingHint ? (
        <TouchableOpacity 
          style={styles.hintButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowSpellingHint(true);
          }}
        >
          <MaterialCommunityIcons name="lightbulb-outline" size={18} color="#56C596" />
          <ThemedText style={[styles.hintButtonText, { color: '#56C596' }]}>Need a Hint?</ThemedText>
        </TouchableOpacity>
      ) : (
        <View style={styles.spellingHintCard}>
          <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD93D" />
          <ThemedText style={styles.spellingHintText}>{spellingGame.hint}</ThemedText>
        </View>
      )}

      <ThemedText style={styles.instructionText}>Tap letters to spell the word:</ThemedText>
      <View style={styles.spellingWordContainer}>
        {spellingInput.map((letter, index) => (
          <View key={index} style={styles.spellingLetterBox}>
            <ThemedText style={styles.spellingLetterText}>{letter}</ThemedText>
          </View>
        ))}
        {Array.from({ length: spellingGame.word.length - spellingInput.length }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.emptyLetterBox}>
            <ThemedText style={styles.emptyLetterText}>_</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.lettersGrid}>
        {spellingGame.scrambledLetters.map((letter, index) => (
          <TouchableOpacity
            key={`${letter}-${index}`}
            style={[
              styles.letterButton,
              spellingInput.length >= spellingGame.word.length && styles.letterButtonDisabled
            ]}
            onPress={() => handleSpellingLetter(letter)}
            disabled={spellingInput.length >= spellingGame.word.length}
          >
            <ThemedText style={styles.letterButtonText}>{letter}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.spellingControls}>
        <TouchableOpacity style={styles.backspaceButton} onPress={removeLastLetter}>
          <MaterialCommunityIcons name="backspace-outline" size={22} color="#FFFFFF" />
          <ThemedText style={styles.clearText}>Undo</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearSpelling}>
          <MaterialCommunityIcons name="eraser" size={22} color="#FFFFFF" />
          <ThemedText style={styles.clearText}>Clear All</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRhymingGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#56C596' }]}>
          <MaterialCommunityIcons name="music-note" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Rhyming</ThemedText>
        </View>
      </View>

      <View style={styles.questionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#E8F8E8' }]}>
          <MaterialCommunityIcons name="rhombus-split" size={40} color="#56C596" />
        </View>
        <ThemedText style={styles.gameQuestion}>Find words that rhyme with:</ThemedText>
        
        <View style={styles.rhymeWordContainer}>
          <ThemedText style={styles.rhymeEmoji}>{rhymingGame.emoji}</ThemedText>
          <ThemedText style={styles.rhymeWord}>{rhymingGame.word}</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.instructionText}>Tap words that rhyme:</ThemedText>
      <View style={styles.rhymeOptionsGrid}>
        {rhymingGame.options.map((option) => (
          <TouchableOpacity
            key={option.word}
            style={[
              styles.rhymeButton,
            ]}
            onPress={() => handleRhymeAnswer(option.word, option.rhymes)}
          >
            <View style={styles.rhymeButtonContent}>
              <ThemedText style={styles.rhymeButtonEmoji}>{option.emoji}</ThemedText>
              <ThemedText style={styles.rhymeOptionText}>{option.word}</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMemoryGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#56C596' }]}>
          <MaterialCommunityIcons name="brain" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Letter Memory</ThemedText>
        </View>
      </View>

      <View style={styles.memoryInstructionCard}>
        <MaterialCommunityIcons name="lightbulb-on" size={32} color="#FFD93D" />
        <ThemedText style={styles.memoryInstruction}>
          Tap cards to flip them. Match the letter symbols!
        </ThemedText>
      </View>

      <MemoryGame
        key={`lettermemory-${gameKey}`}
        cards={letterMemoryCards}
        onComplete={() => {
          const finalScore = score + 20;
          setGameResults({ score: finalScore, total: letterMemoryCards.length, correct: letterMemoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#E8F8E8"
        cardFrontColors={['#56C596', '#3AA76D']}
      />
    </View>
  );

  const renderEmojiMemoryGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#56C596' }]}>
          <MaterialCommunityIcons name="emoticon" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Emoji Memory</ThemedText>
        </View>
      </View>

      <View style={styles.memoryInstructionCard}>
        <MaterialCommunityIcons name="lightbulb-on" size={32} color="#FFD93D" />
        <ThemedText style={styles.memoryInstruction}>
          Match happy faces! Remember the emotions!
        </ThemedText>
      </View>

      <MemoryGame
        key={`emojimemory-${gameKey}`}
        cards={emojiMemoryCards}
        onComplete={() => {
          const finalScore = score + 20;
          setGameResults({ score: finalScore, total: emojiMemoryCards.length, correct: emojiMemoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#FFF9E6"
        cardFrontColors={['#FFC107', '#FFA000']}
      />
    </View>
  );

  const renderFoodMemoryGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#56C596' }]}>
          <MaterialCommunityIcons name="food" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Food Memory</ThemedText>
        </View>
      </View>

      <View style={styles.memoryInstructionCard}>
        <MaterialCommunityIcons name="lightbulb-on" size={32} color="#FFD93D" />
        <ThemedText style={styles.memoryInstruction}>
          Match yummy foods! Don't get hungry!
        </ThemedText>
      </View>

      <MemoryGame
        key={`foodmemory-${gameKey}`}
        cards={foodMemoryCards}
        onComplete={() => {
          const finalScore = score + 25;
          setGameResults({ score: finalScore, total: foodMemoryCards.length, correct: foodMemoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#FFF3E0"
        cardFrontColors={['#FF9800', '#F57C00']}
      />
    </View>
  );

  const renderVocabularyGame = () => (
    <View style={styles.gameContainer}>
      <LearningBuddy message="Show off your word skills!" buddy="robot" />
      <TimedQuiz
        key={`vocabulary-${gameKey}`}
        questions={vocabularyQuestions}
        timePerQuestion={12}
        onComplete={(finalScore, correctAnswers) => {
          setGameResults({ score: finalScore, total: vocabularyQuestions.length, correct: correctAnswers });
          setShowResultsModal(true);
        }}
        color="#56C596"
      />
    </View>
  );

  const handleRestart = () => {
    setShowResultsModal(false);
    setScore(0);
    setSelectedLetter(null);
    setSpellingInput([]);
    setSpellingQuestionIndex(0);
    setSpellingTimeLeft(20);
    setSpellingTimerActive(true);
    setShowSpellingHint(false);
    setAlphabetQuizIndex(0);
    setAlphabetQuizAnswered(false);
    setAlphabetMode('explore');
    setQuizCompleted(false);
    setRhymeAttempts(0);
    setRhymeCorrect(0);
    setGameKey(gameKey + 1);
  };

  const handleGoHome = () => {
    setShowResultsModal(false);
    setSelectedGame(null);
    setScore(0);
    setSelectedLetter(null);
    setSpellingInput([]);
    setQuizCompleted(false);
    setRhymeAttempts(0);
    setRhymeCorrect(0);
    setGameKey(0);
  };

  const handleNextGame = () => {
    setShowResultsModal(false);
    const currentGameIndex = games.findIndex(g => g.id === selectedGame);
    if (currentGameIndex < games.length - 1) {
      setSelectedGame(games[currentGameIndex + 1].id);
      setScore(0);
      setSelectedLetter(null);
      setSpellingInput([]);
      setQuizCompleted(false);
      setRhymeAttempts(0);
      setRhymeCorrect(0);
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
          color="#56C596"
          gameTitle={games.find(g => g.id === selectedGame)?.title || 'English Game'}
          gameId={selectedGame || 'english'}
          subject="english"
        />
        <Confetti show={showConfetti} />
        <Celebration message={celebrationMessage} show={showCelebration} />
        <LinearGradient
          colors={['#56C596', '#3AA76D']}
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
          {selectedGame === 'alphabet' && renderAlphabetGame()}
          {selectedGame === 'spelling' && renderSpellingGame()}
          {selectedGame === 'rhyming' && renderRhymingGame()}
          {selectedGame === 'memory' && renderMemoryGame()}
          {selectedGame === 'emojimemory' && renderEmojiMemoryGame()}
          {selectedGame === 'foodmemory' && renderFoodMemoryGame()}
          {selectedGame === 'vocabulary' && renderVocabularyGame()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#56C596', '#3AA76D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.englishHeader}
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
            <MaterialCommunityIcons name="book-alphabet" size={36} color="#56C596" />
          </View>
          <ThemedText style={styles.englishTitle}>English Fun</ThemedText>
          <ThemedText style={styles.englishSubtitle}>Learn words and letters</ThemedText>
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
                <View style={[styles.gameIconContainer, { backgroundColor: '#56C596' }]}>
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
                <MaterialCommunityIcons name="chevron-right" size={28} color="#56C596" />
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
  englishHeader: {
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
  englishTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  englishSubtitle: {
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
  alphabetGameContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  quizContentContainer: {
    paddingBottom: 40,
    minHeight: 600,
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
    color: '#56C596',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
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
    borderColor: '#E8F8E8',
    marginTop: 8,
  },
  spellingQuestionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: '#E8F8E8',
    marginTop: 8,
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
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  imageCard: {
    backgroundColor: '#E8F8E8',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 32,
    marginVertical: 16,
    marginHorizontal: 8,
    borderWidth: 4,
    borderColor: '#56C596',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    paddingVertical: 10,
    width: '100%',
  },
  difficultyBadgeSpelling: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#56C596',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  difficultyTextWhite: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wordLengthHint: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    lineHeight: 20,
  },
  spellingHintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#FFD93D',
  },
  spellingHintText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: '#E8F8E8',
  },
  hintButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  alphabetScroll: {
    width: '100%',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#56C596',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  modeButtonActive: {
    backgroundColor: '#56C596',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#56C596',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  selectedLetterDisplay: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: '#56C596',
  },
  bigLetterCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#56C596',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bigLetter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  selectedLetterInfo: {
    flex: 1,
    gap: 6,
  },
  selectedEmoji: {
    fontSize: 40,
  },
  selectedWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  soundBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F8E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  soundText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#56C596',
  },
  alphabetGridContainer: {
    width: '100%',
    marginBottom: 20,
  },
  alphabetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  letterCard: {
    width: 70,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  letterCardContent: {
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#56C596',
    borderRadius: 16,
    minHeight: 85,
    justifyContent: 'center',
  },
  selectedLetterCard: {
    transform: [{ scale: 1.1 }],
    elevation: 8,
  },
  letterText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#56C596',
  },
  selectedLetterText: {
    color: '#FFFFFF',
  },
  miniEmoji: {
    fontSize: 20,
    marginTop: 4,
    opacity: 0.8,
  },
  miniEmojiSelected: {
    opacity: 1,
  },
  quizLetterDisplay: {
    backgroundColor: '#E8F8E8',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 3,
    borderColor: '#56C596',
    marginVertical: 16,
  },
  quizLetter: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#56C596',
    lineHeight: 80,
  },
  quizOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
    marginBottom: 40,
    paddingVertical: 10,
  },
  emojiQuizButton: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E8F8E8',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: 'relative',
    marginVertical: 8,
  },
  correctEmojiButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  incorrectEmojiButton: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
    borderColor: '#CCCCCC',
  },
  quizEmoji: {
    fontSize: 64,
    lineHeight: 70,
  },
  emojiCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spellingEmoji: {
    fontSize: 88,
    lineHeight: 100,
    textAlign: 'center',
    includeFontPadding: false,
  },
  spellingWordContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    justifyContent: 'center',
    flexWrap: 'wrap',
    minHeight: 75,
  },
  spellingLetterBox: {
    backgroundColor: '#56C596',
    width: 55,
    height: 65,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  spellingLetterText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyLetterBox: {
    backgroundColor: '#FFFFFF',
    width: 55,
    height: 65,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#56C596',
    borderStyle: 'dashed',
  },
  emptyLetterText: {
    fontSize: 32,
    color: '#CCC',
  },
  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  letterButton: {
    backgroundColor: '#FFFFFF',
    width: 68,
    height: 68,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E8F8E8',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  letterButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#F5F5F5',
  },
  letterButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#56C596',
  },
  spellingControls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backspaceButton: {
    backgroundColor: '#FF9800',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  clearText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rhymeWordContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#E8F8E8',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#56C596',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rhymeEmoji: {
    fontSize: 64,
  },
  rhymeWord: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#56C596',
    marginTop: 12,
    letterSpacing: 2,
  },
  rhymeOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
  },
  rhymeButton: {
    width: 145,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  rhymeButtonContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E8F8E8',
    borderRadius: 20,
  },
  rhymeButtonEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  rhymeOptionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#56C596',
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
});
