import { AdBanner } from '@/components/ad-banner';
import { AnswerFeedback } from '@/components/answer-feedback';
import { Celebration } from '@/components/celebration';
import { Confetti } from '@/components/confetti';
import { GameResultsModal } from '@/components/game-results-modal';
import { HintButton } from '@/components/hint-button';
import { MemoryGame } from '@/components/memory-game';
import { QuestionTimer } from '@/components/question-timer';
import { ThemedText } from '@/components/themed-text';
import { TimedQuiz } from '@/components/timed-quiz';
import {
  ALPHABET_QUIZ_POOL,
  ALPHABET_QUIZ_ROUND_LENGTH,
  RHYMING_POOL,
  RHYMING_ROUND_LENGTH,
  SPELLING_POOL,
  SPELLING_ROUND_LENGTH,
  VOCABULARY_POOL,
  VOCABULARY_ROUND_LENGTH,
} from '@/data/questions/english';
import { pickWrongOptionsToHide } from '@/utils/hints';
import { pickRandomQuestions } from '@/utils/question-pool';
import { soundManager } from '@/utils/sound-manager';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Random spelling round, ordered easy -> hard like the original fixed list.
const drawSpellingRound = () =>
  pickRandomQuestions(SPELLING_POOL, SPELLING_ROUND_LENGTH).sort((a, b) => a.time - b.time);

export default function EnglishScreen() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [spellingInput, setSpellingInput] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [celebrationSubtitle, setCelebrationSubtitle] = useState<string | undefined>(undefined);
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
  const [rhymeQuestionIndex, setRhymeQuestionIndex] = useState(0);
  const [rhymeSelectedAnswers, setRhymeSelectedAnswers] = useState<Set<string>>(new Set());
  const [rhymeTimeLeft, setRhymeTimeLeft] = useState(15);
  const [rhymeTimerActive, setRhymeTimerActive] = useState(true);

  const showCelebrationWithMessage = (message: string, subtitle?: string) => {
    setCelebrationSubtitle(subtitle);
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

  const [vocabularyRound, setVocabularyRound] = useState(() =>
    pickRandomQuestions(VOCABULARY_POOL, VOCABULARY_ROUND_LENGTH)
  );

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

  const [alphabetQuizRound, setAlphabetQuizRound] = useState(() =>
    pickRandomQuestions(ALPHABET_QUIZ_POOL, ALPHABET_QUIZ_ROUND_LENGTH)
  );

  const [spellingRound, setSpellingRound] = useState(drawSpellingRound);
  const spellingGame = spellingRound[spellingQuestionIndex];
  const [showSpellingHint, setShowSpellingHint] = useState(false);

  const [rhymingRound, setRhymingRound] = useState(() =>
    pickRandomQuestions(RHYMING_POOL, RHYMING_ROUND_LENGTH)
  );
  const rhymingGame = rhymingRound[rhymeQuestionIndex];

  // Rewarded "💡 Hint" state. Each hint remembers which question it belongs to
  // (round array + index), so it resets automatically whenever the question changes:
  // next question, restart / new round (fresh round array) or switching games.
  type HintFor<T> = { round: readonly unknown[]; index: number; value: T } | null;
  const [alphabetHint, setAlphabetHint] = useState<HintFor<string[]>>(null);
  const [spellingHint, setSpellingHint] = useState<HintFor<true>>(null);
  const [rhymeHint, setRhymeHint] = useState<HintFor<string[]>>(null);
  // True while the hint prompt / video is on screen. Countdowns don't tick while it is set,
  // and clearing it never re-activates a timer that stopped because the question ended.
  const [hintPaused, setHintPaused] = useState(false);
  const pauseForHint = () => setHintPaused(true);
  const resumeAfterHint = () => setHintPaused(false);

  const alphabetHintUsed =
    alphabetHint?.round === alphabetQuizRound && alphabetHint.index === alphabetQuizIndex;
  const alphabetHiddenOptions = alphabetHintUsed ? alphabetHint.value : [];
  const spellingHintUsed =
    spellingHint?.round === spellingRound && spellingHint.index === spellingQuestionIndex;
  const rhymeHintUsed = rhymeHint?.round === rhymingRound && rhymeHint.index === rhymeQuestionIndex;
  const rhymeHiddenOptions = rhymeHintUsed ? rhymeHint.value : [];

  // Draws a fresh random round for a game and resets its progress.
  const startNewRound = (gameId: string) => {
    if (gameId === 'alphabet') {
      setAlphabetQuizRound(pickRandomQuestions(ALPHABET_QUIZ_POOL, ALPHABET_QUIZ_ROUND_LENGTH));
      setAlphabetQuizIndex(0);
      setAlphabetQuizAnswered(false);
    } else if (gameId === 'spelling') {
      const round = drawSpellingRound();
      setSpellingRound(round);
      setSpellingQuestionIndex(0);
      setSpellingInput([]);
      setShowSpellingHint(false);
      setSpellingTimeLeft(round[0].time);
      setSpellingTimerActive(true);
    } else if (gameId === 'rhyming') {
      setRhymingRound(pickRandomQuestions(RHYMING_POOL, RHYMING_ROUND_LENGTH));
      setRhymeQuestionIndex(0);
      setRhymeSelectedAnswers(new Set());
      setRhymeTimeLeft(15);
      setRhymeTimerActive(true);
    } else if (gameId === 'vocabulary') {
      setVocabularyRound(pickRandomQuestions(VOCABULARY_POOL, VOCABULARY_ROUND_LENGTH));
    }
  };

  const handleLetterPress = (letter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedLetter(letter);
  };

  const handleAlphabetQuizAnswer = (emoji: string) => {
    const currentQuestion = alphabetQuizRound[alphabetQuizIndex];
    const isCorrect = emoji === currentQuestion.answer;
    
    setAlphabetQuizAnswered(true);
    
    if (isCorrect) {
      soundManager.playSound('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      setTimeout(() => {
        if (alphabetQuizIndex < alphabetQuizRound.length - 1) {
          setAlphabetQuizIndex(alphabetQuizIndex + 1);
          setAlphabetQuizAnswered(false);
        } else {
          setGameResults({ score: newScore, total: alphabetQuizRound.length, correct: alphabetQuizIndex + 1 });
          setShowResultsModal(true);
        }
      }, 1500);
    } else {
      soundManager.playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        setGameResults({ score, total: alphabetQuizRound.length, correct: alphabetQuizIndex });
        setShowResultsModal(true);
      }, 1500);
    }
  };

  useEffect(() => {
    if (selectedGame === 'spelling' && spellingTimerActive && !hintPaused && spellingGame && spellingInput.length < spellingGame.word.length) {
      const timer = setInterval(() => {
        setSpellingTimeLeft((prev) => {
          if (prev <= 1) {
            setSpellingTimerActive(false);
            setTimeout(() => {
              setGameResults({ score, total: spellingRound.length, correct: spellingQuestionIndex });
              setShowResultsModal(true);
            }, 100);
            return spellingGame?.time || 20;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedGame, spellingQuestionIndex, spellingTimerActive, hintPaused, spellingInput, spellingGame]);

  useEffect(() => {
    if (selectedGame === 'rhyming') {
      setRhymeTimeLeft(15);
      setRhymeTimerActive(true);
      setRhymeSelectedAnswers(new Set());
    }
  }, [selectedGame, rhymeQuestionIndex]);

  useEffect(() => {
    if (selectedGame === 'rhyming' && rhymeTimerActive && !hintPaused && rhymingGame) {
      const timer = setInterval(() => {
        setRhymeTimeLeft((prev) => {
          if (prev <= 1) {
            setRhymeTimerActive(false);
            const correctAnswers = Array.from(rhymeSelectedAnswers).filter(
              word => rhymingGame.options.find(o => o.word === word)?.rhymes
            ).length;
            const totalCorrect = (rhymeQuestionIndex * 2) + correctAnswers;
            setTimeout(() => {
              setGameResults({ score, total: rhymingRound.length * 2, correct: totalCorrect });
              setShowResultsModal(true);
            }, 100);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedGame, rhymeQuestionIndex, rhymeTimerActive, hintPaused, rhymeSelectedAnswers.size]);

  // `baseInput` lets the hint append to a corrected prefix; normal taps use the current input.
  const handleSpellingLetter = (letter: string, baseInput: string[] = spellingInput) => {
    if (baseInput.length >= spellingGame.word.length) return;

    soundManager.playSound('click');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newInput = [...baseInput, letter];
    setSpellingInput(newInput);
    
    if (newInput.join('') === spellingGame.word) {
      soundManager.playSound('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSpellingTimerActive(false);
      const newScore = score + 15;
      setScore(newScore);
      showCelebrationWithMessage('Perfect Spelling!', `You spelled ${spellingGame.word}!`);
      
      setTimeout(() => {
        if (spellingQuestionIndex < spellingRound.length - 1) {
          setSpellingQuestionIndex(spellingQuestionIndex + 1);
          setSpellingInput([]);
          setShowSpellingHint(false);
          setSpellingTimeLeft(spellingRound[spellingQuestionIndex + 1].time);
          setSpellingTimerActive(true);
        } else {
          setGameResults({ score: newScore, total: spellingRound.length, correct: spellingQuestionIndex + 1 });
          setShowResultsModal(true);
        }
      }, 2000);
    } else if (newInput.length === spellingGame.word.length && newInput.join('') !== spellingGame.word) {
      soundManager.playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setSpellingTimerActive(false);
      setTimeout(() => {
        setGameResults({ score, total: spellingRound.length, correct: spellingQuestionIndex });
        setShowResultsModal(true);
      }, 1000);
    }
  };

  // Spelling hint: fill in the next correct letter, as if the child tapped the right tile.
  // If the input already contains a wrong letter, it is trimmed back to the longest correct
  // prefix first, so the hint always leaves the word on the right track.
  const revealSpellingHint = () => {
    const word = spellingGame.word;
    let correctLength = 0;
    while (correctLength < spellingInput.length && spellingInput[correctLength] === word[correctLength]) {
      correctLength++;
    }
    if (correctLength >= word.length) return;
    setSpellingHint({ round: spellingRound, index: spellingQuestionIndex, value: true });
    handleSpellingLetter(word[correctLength], spellingInput.slice(0, correctLength));
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
    const newAnswers = new Set(rhymeSelectedAnswers);
    newAnswers.add(word);
    setRhymeSelectedAnswers(newAnswers);

    if (rhymes) {
      soundManager.playSound('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 10;
      setScore(newScore);
      
      const correctOptions = rhymingGame.options.filter(o => o.rhymes);
      const correctAnswered = Array.from(newAnswers).filter(
        w => rhymingGame.options.find(o => o.word === w)?.rhymes
      ).length;
      
      // Check if found all rhymes
      if (correctAnswered === correctOptions.length) {
        setRhymeTimerActive(false);
        setTimeout(() => {
          if (rhymeQuestionIndex < rhymingRound.length - 1) {
            setRhymeQuestionIndex(rhymeQuestionIndex + 1);
            setRhymeSelectedAnswers(new Set());
            setScore(newScore);
            setRhymeTimeLeft(15);
            setRhymeTimerActive(true);
          } else {
            setGameResults({ score: newScore, total: rhymingRound.length * 2, correct: rhymingRound.length * 2 });
            setShowResultsModal(true);
          }
        }, 1500);
      }
    } else {
      soundManager.playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setRhymeTimerActive(false);
      const correctAnswers = Array.from(newAnswers).filter(
        w => rhymingGame.options.find(o => o.word === w)?.rhymes
      ).length;
      const totalCorrect = (rhymeQuestionIndex * 2) + correctAnswers;
      setTimeout(() => {
        setGameResults({ score, total: rhymingRound.length * 2, correct: totalCorrect });
        setShowResultsModal(true);
      }, 1000);
    }
  };

  const renderAlphabetExplore = () => (
    <>
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, alphabetMode === 'explore' && styles.modeButtonActive]}
          onPress={() => {
            setAlphabetHint(null);
            setAlphabetMode('explore');
          }}
        >
          <MaterialCommunityIcons name="book-open-page-variant" size={20} color={alphabetMode === 'explore' ? '#FFFFFF' : '#56C596'} />
          <ThemedText style={[styles.modeButtonText, alphabetMode === 'explore' && styles.modeButtonTextActive]}>
            Explore
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, alphabetMode === 'quiz' && styles.modeButtonActive]}
          onPress={() => {
            if (alphabetMode !== 'quiz' && alphabetQuizIndex === 0 && !alphabetQuizAnswered) {
              startNewRound('alphabet');
            }
            setAlphabetHint(null);
            setAlphabetMode('quiz');
          }}
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
    const currentQuestion = alphabetQuizRound[alphabetQuizIndex];
    const letterData = alphabetData[currentQuestion.letter as keyof typeof alphabetData];
    
    return (
      <View style={styles.quizContentContainer}>
        <HintButton
          used={alphabetHintUsed}
          disabled={alphabetQuizAnswered}
          onReveal={() =>
            setAlphabetHint({
              round: alphabetQuizRound,
              index: alphabetQuizIndex,
              value: pickWrongOptionsToHide(currentQuestion.options, (emoji) => emoji === currentQuestion.answer, 2),
            })
          }
        />
        <View style={styles.questionCard}>
          <ThemedText style={styles.gameQuestion}>Which picture starts with:</ThemedText>
          <View style={styles.quizLetterDisplay}>
            <ThemedText style={styles.quizLetter}>{currentQuestion.letter}</ThemedText>
            <View style={styles.soundBadge}>
              <MaterialCommunityIcons name="volume-high" size={16} color="#56C596" />
              <ThemedText style={styles.soundText}>"{letterData?.sound}"</ThemedText>
            </View>
          </View>
        </View>

        <ThemedText style={styles.instructionText}>Tap the correct picture:</ThemedText>
        <View style={styles.quizOptionsGrid}>
          {currentQuestion.options.map((emoji, index) => {
            const isHidden = alphabetHiddenOptions.includes(emoji);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.emojiQuizButton,
                  alphabetQuizAnswered && emoji === currentQuestion.answer && styles.correctEmojiButton,
                  alphabetQuizAnswered && emoji !== currentQuestion.answer && styles.incorrectEmojiButton,
                  isHidden && styles.hintHiddenOption,
                ]}
                onPress={() => handleAlphabetQuizAnswer(emoji)}
                disabled={alphabetQuizAnswered || isHidden}
              >
                <ThemedText style={styles.quizEmoji}>{emoji}</ThemedText>
                {alphabetQuizAnswered && emoji === currentQuestion.answer && (
                  <View style={styles.emojiCheckBadge}>
                    <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
              {alphabetQuizIndex + 1}/{alphabetQuizRound.length}
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
            {spellingQuestionIndex + 1}/{spellingRound.length}
          </ThemedText>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: '#56C596' }]}>
          <MaterialCommunityIcons name="pencil" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Spelling</ThemedText>
        </View>
      </View>

      <QuestionTimer timeLeft={spellingTimeLeft} totalTime={spellingGame.time} color="#56C596" />

      <HintButton
        used={spellingHintUsed}
        disabled={!spellingTimerActive || spellingInput.length >= spellingGame.word.length}
        description="The next letter will be filled in for you!"
        onPause={pauseForHint}
        onResume={resumeAfterHint}
        onReveal={revealSpellingHint}
      />

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

  const renderRhymingGame = () => {
    const rhymingCorrectCount = rhymingGame.options.filter(o => o.rhymes).length;
    const selectedCorrectCount = Array.from(rhymeSelectedAnswers).filter(
      w => rhymingGame.options.find(o => o.word === w)?.rhymes
    ).length;
    // Question is over once a wrong word was picked or every rhyme was found.
    const rhymeAnswered =
      selectedCorrectCount === rhymingCorrectCount ||
      Array.from(rhymeSelectedAnswers).some(
        w => rhymingGame.options.find(o => o.word === w)?.rhymes === false
      );

    return (
      <View style={styles.gameContainer}>
        <View style={styles.questionHeader}>
          <View style={styles.progressBadge}>
            <MaterialCommunityIcons name="progress-check" size={16} color="#56C596" />
            <ThemedText style={[styles.questionProgress, { color: '#56C596' }]}>
              {rhymeQuestionIndex + 1}/{rhymingRound.length}
            </ThemedText>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: '#56C596' }]}>
            <MaterialCommunityIcons name="music-note" size={18} color="#FFFFFF" />
            <ThemedText style={styles.categoryText}>Rhyming</ThemedText>
          </View>
        </View>

        <QuestionTimer timeLeft={rhymeTimeLeft} totalTime={15} color="#56C596" />

        <HintButton
          used={rhymeHintUsed}
          disabled={rhymeAnswered || !rhymeTimerActive}
          description="One word that doesn't rhyme will disappear!"
          onPause={pauseForHint}
          onResume={resumeAfterHint}
          onReveal={() =>
            setRhymeHint({
              round: rhymingRound,
              index: rhymeQuestionIndex,
              value: pickWrongOptionsToHide(rhymingGame.options, (o) => o.rhymes, 1).map((o) => o.word),
            })
          }
        />

        <View style={styles.questionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#E8F8E8' }]}>
          <MaterialCommunityIcons name="music-clef-treble" size={40} color="#56C596" />
        </View>
        <ThemedText style={styles.gameQuestion}>Find words that rhyme with:</ThemedText>
        
        <View style={styles.rhymeWordContainer}>
          <View style={styles.rhymeEmojiCircleSimple}>
            <ThemedText style={styles.rhymeEmoji}>{rhymingGame.emoji}</ThemedText>
          </View>
          <View>
            <ThemedText style={styles.rhymeWord}>{rhymingGame.word}</ThemedText>
            <View style={styles.soundBadge}>
              <MaterialCommunityIcons name="music" size={14} color="#9C27B0" />
              <ThemedText style={styles.soundText}>"{rhymingGame.sound}"</ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.rhymeProgressCard}>
        <MaterialCommunityIcons name="checkbox-multiple-marked" size={18} color="#56C596" />
        <ThemedText style={styles.rhymeProgressTextSimple}>
          Found {selectedCorrectCount}/{rhymingCorrectCount} rhymes - Find ALL!
        </ThemedText>
      </View>
      <View style={styles.rhymeOptionsGrid}>
        {rhymingGame.options.map((option) => {
          const isSelected = rhymeSelectedAnswers.has(option.word);
          const isCorrect = option.rhymes;
          const isHidden = rhymeHiddenOptions.includes(option.word);

          return (
            <TouchableOpacity
              key={option.word}
              style={[
                styles.rhymeButton,
                isSelected && isCorrect && styles.rhymeCorrectButton,
                isSelected && !isCorrect && styles.rhymeIncorrectButton,
                isHidden && styles.hintHiddenOption,
              ]}
              onPress={() => handleRhymeAnswer(option.word, option.rhymes)}
              disabled={rhymeSelectedAnswers.has(option.word) || isHidden}
              activeOpacity={0.8}
            >
              <View style={styles.rhymeButtonContent}>
                <View style={[
                  styles.rhymeEmojiBoxSimple,
                  isSelected && isCorrect && styles.rhymeEmojiBoxCorrect,
                  isSelected && !isCorrect && styles.rhymeEmojiBoxIncorrect,
                ]}>
                  <ThemedText style={styles.rhymeButtonEmoji}>{option.emoji}</ThemedText>
                  {isSelected && (
                    <View style={styles.rhymeEmojiCheckBadge}>
                      <MaterialCommunityIcons 
                        name={isCorrect ? "check" : "close"} 
                        size={16} 
                        color="#FFFFFF" 
                      />
                    </View>
                  )}
                </View>
                <ThemedText style={[
                  styles.rhymeOptionText,
                ]}>{option.word}</ThemedText>
                {isSelected && (
                  <View style={[
                    styles.rhymeStatusBadge,
                    isCorrect && styles.rhymeStatusCorrect,
                    !isCorrect && styles.rhymeStatusIncorrect,
                  ]}>
                    <MaterialCommunityIcons 
                      name={isCorrect ? "check-circle" : "close-circle"} 
                      size={24} 
                      color="#FFFFFF" 
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
    );
  };

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
      <TimedQuiz
        key={`vocabulary-${gameKey}`}
        questions={vocabularyRound}
        timePerQuestion={12}
        onComplete={(finalScore, correctAnswers) => {
          setGameResults({ score: finalScore, total: vocabularyRound.length, correct: correctAnswers });
          setShowResultsModal(true);
        }}
        color="#56C596"
      />
    </View>
  );

  const handleRestart = () => {
    const newSpellingRound = drawSpellingRound();
    setShowResultsModal(false);
    setScore(0);
    setSelectedLetter(null);
    setSpellingRound(newSpellingRound);
    setAlphabetQuizRound(pickRandomQuestions(ALPHABET_QUIZ_POOL, ALPHABET_QUIZ_ROUND_LENGTH));
    setRhymingRound(pickRandomQuestions(RHYMING_POOL, RHYMING_ROUND_LENGTH));
    setVocabularyRound(pickRandomQuestions(VOCABULARY_POOL, VOCABULARY_ROUND_LENGTH));
    setSpellingInput([]);
    setSpellingQuestionIndex(0);
    setSpellingTimeLeft(newSpellingRound[0].time);
    setSpellingTimerActive(true);
    setShowSpellingHint(false);
    setAlphabetQuizIndex(0);
    setAlphabetQuizAnswered(false);
    setAlphabetMode('explore');
    setRhymeQuestionIndex(0);
    setRhymeSelectedAnswers(new Set());
    setRhymeTimeLeft(15);
    setRhymeTimerActive(true);
    setQuizCompleted(false);
    setHintPaused(false);
    setGameKey(gameKey + 1);
  };

  const handleGoHome = () => {
    setShowResultsModal(false);
    setSelectedGame(null);
    setScore(0);
    setSelectedLetter(null);
    setSpellingInput([]);
    setRhymeQuestionIndex(0);
    setRhymeSelectedAnswers(new Set());
    setRhymeTimerActive(false);
    setQuizCompleted(false);
    setHintPaused(false);
    setGameKey(0);
  };

  const handleNextGame = () => {
    setShowResultsModal(false);
    const currentGameIndex = games.findIndex(g => g.id === selectedGame);
    if (currentGameIndex < games.length - 1) {
      const nextGameId = games[currentGameIndex + 1].id;
      startNewRound(nextGameId);
      setSelectedGame(nextGameId);
      setScore(0);
      setSelectedLetter(null);
      setSpellingInput([]);
      setRhymeQuestionIndex(0);
      setRhymeSelectedAnswers(new Set());
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
          color="#56C596"
          gameTitle={games.find(g => g.id === selectedGame)?.title || 'English Game'}
          gameId={selectedGame || 'english'}
          subject="english"
        />
        <Confetti show={showConfetti} />
        <Celebration message={celebrationMessage} subtitle={celebrationSubtitle} show={showCelebration} />
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
              soundManager.playSound('click');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // Draw a fresh random round (and reset progress) when selecting
              startNewRound(game.id);
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
      <AdBanner />
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
    padding: 16,
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
    padding: 2,
    marginBottom: 10,
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    // marginVertical: 5,
    // marginHorizontal: 8,
    borderWidth: 4,
    borderColor: '#56C596',
    alignItems: 'center',
    justifyContent: 'center',
    // minHeight: 200,
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
  // Option removed by a hint: stays in place (no layout jump) but is faded out and untappable.
  hintHiddenOption: {
    opacity: 0.25,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E8F8E8',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#56C596',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    gap: 16,
    marginVertical: 10,
    minHeight: 90,
    justifyContent: 'center',
  },
  rhymeEmojiCircleSimple: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    overflow: 'visible',
  },
  rhymeEmoji: {
    fontSize: 36,
    lineHeight: 44,
    textAlign: 'center',
    includeFontPadding: false,
  },
  rhymeWord: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#56C596',
    letterSpacing: 1,
    lineHeight: 36,
    includeFontPadding: false,
  },
  rhymeOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  rhymeButton: {
    width: 140,
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
    padding: 14,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E8F8E8',
    borderRadius: 20,
    minHeight: 130,
    justifyContent: 'center',
  },
  rhymeEmojiBoxSimple: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  rhymeEmojiBoxCorrect: {
    backgroundColor: '#C8E6C9',
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  rhymeEmojiBoxIncorrect: {
    backgroundColor: '#FFCDD2',
    borderWidth: 3,
    borderColor: '#F44336',
  },
  rhymeEmojiCheckBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  rhymeButtonEmoji: {
    fontSize: 36,
    lineHeight: 44,
    textAlign: 'center',
    includeFontPadding: false,
  },
  rhymeOptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#56C596',
    lineHeight: 24,
    includeFontPadding: false,
  },
  rhymeCorrectButton: {
    backgroundColor: '#4CAF50',
  },
  rhymeIncorrectButton: {
    backgroundColor: '#FF6B6B',
  },
  rhymeTextWhite: {
    color: '#FFFFFF',
  },
  rhymeStatusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  rhymeStatusCorrect: {
    backgroundColor: 'transparent',
  },
  rhymeStatusIncorrect: {
    backgroundColor: 'transparent',
  },
  rhymeProgressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E8F8E8',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#56C596',
  },
  rhymeProgressTextSimple: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#56C596',
    flex: 1,
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
