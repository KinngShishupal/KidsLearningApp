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
import { GameResultsModal } from '@/components/game-results-modal';
import { AnswerFeedback } from '@/components/answer-feedback';

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

  const showCelebrationWithMessage = (message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const games = [
    { 
      id: 'alphabet', 
      title: 'Alphabet Fun', 
      description: 'Learn your ABCs', 
      icon: 'alphabet-latin',
      difficulty: 'Easy',
      colors: ['#E8F5E9', '#C8E6C9']
    },
    { 
      id: 'spelling', 
      title: 'Spelling Bee', 
      description: 'Build words from letters', 
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
      description: 'Match letter pairs', 
      icon: 'brain',
      difficulty: 'Easy',
      colors: ['#E8F5E9', '#C8E6C9']
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

  const vocabularyQuestions = [
    { question: 'Which word means "big"?', options: ['Small', 'Large', 'Tiny', 'Little'], correctAnswer: 'Large', emoji: '📏' },
    { question: 'What is a baby dog called?', options: ['Kitten', 'Puppy', 'Calf', 'Chick'], correctAnswer: 'Puppy', emoji: '🐕' },
    { question: 'Which word rhymes with "cat"?', options: ['Dog', 'Hat', 'Bird', 'Fish'], correctAnswer: 'Hat', emoji: '🎩' },
    { question: 'What color is grass?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctAnswer: 'Green', emoji: '🌱' },
    { question: 'Opposite of "happy"?', options: ['Sad', 'Glad', 'Jolly', 'Merry'], correctAnswer: 'Sad', emoji: '😢' },
  ];

  const alphabetGame = {
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    words: {
      A: { word: 'Apple', emoji: '🍎' },
      B: { word: 'Ball', emoji: '⚽' },
      C: { word: 'Cat', emoji: '🐱' },
      D: { word: 'Dog', emoji: '🐕' },
      E: { word: 'Elephant', emoji: '🐘' },
      F: { word: 'Fish', emoji: '🐠' },
    },
  };

  const spellingGame = {
    image: '🐱',
    word: 'CAT',
    scrambledLetters: ['T', 'A', 'C', 'B', 'D', 'E'],
  };

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLetter(letter);
  };

  const handleSpellingLetter = (letter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newInput = [...spellingInput, letter];
    setSpellingInput(newInput);
    if (newInput.join('') === spellingGame.word) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore(score + 10);
      showCelebrationWithMessage('Perfect spelling!');
      setTimeout(() => {
        setSpellingInput([]);
      }, 2000);
    }
  };

  const clearSpelling = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSpellingInput([]);
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

  const renderAlphabetGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#56C596' }]}>
          <MaterialCommunityIcons name="alphabet-latin" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Alphabet</ThemedText>
        </View>
      </View>

      <View style={styles.questionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#E8F8E8' }]}>
          <MaterialCommunityIcons name="format-letter-case" size={40} color="#56C596" />
        </View>
        <ThemedText style={styles.gameQuestion}>Tap letters to learn!</ThemedText>
        <ThemedText style={styles.instructionText}>Each letter has a fun word</ThemedText>
      </View>

      <ScrollView style={styles.alphabetScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.alphabetGrid}>
          {alphabetGame.letters.map((letter) => (
            <TouchableOpacity
              key={letter}
              style={[
                styles.letterCard,
                selectedLetter === letter && styles.selectedLetterCard,
              ]}
              onPress={() => handleLetterPress(letter)}
            >
              <LinearGradient
                colors={selectedLetter === letter ? ['#56C596', '#3AA76D'] : ['#FFFFFF', '#F0F0F0']}
                style={styles.letterCardContent}
              >
                <ThemedText style={[
                  styles.letterText,
                  selectedLetter === letter && styles.selectedLetterText,
                ]}>{letter}</ThemedText>
                {alphabetGame.words[letter as keyof typeof alphabetGame.words] && (
                  <>
                    <ThemedText style={styles.wordEmoji}>
                      {alphabetGame.words[letter as keyof typeof alphabetGame.words].emoji}
                    </ThemedText>
                    <ThemedText style={[
                      styles.wordText,
                      selectedLetter === letter && styles.selectedWordText,
                    ]}>
                      {alphabetGame.words[letter as keyof typeof alphabetGame.words].word}
                    </ThemedText>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderSpellingGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.questionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: '#56C596' }]}>
          <MaterialCommunityIcons name="pencil" size={18} color="#FFFFFF" />
          <ThemedText style={styles.categoryText}>Spelling</ThemedText>
        </View>
      </View>

      <View style={styles.questionCard}>
        <View style={[styles.questionIconCircle, { backgroundColor: '#E8F8E8' }]}>
          <MaterialCommunityIcons name="spellcheck" size={40} color="#56C596" />
        </View>
        <ThemedText style={styles.gameQuestion}>Spell this word:</ThemedText>
        
        <View style={styles.imageCard}>
          <ThemedText style={styles.spellingEmoji}>{spellingGame.image}</ThemedText>
        </View>

        <ThemedText style={styles.instructionText}>Build the word by tapping letters:</ThemedText>
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
      </View>

      <View style={styles.lettersGrid}>
        {spellingGame.scrambledLetters.map((letter, index) => (
          <TouchableOpacity
            key={`${letter}-${index}`}
            style={styles.letterButton}
            onPress={() => handleSpellingLetter(letter)}
          >
            <ThemedText style={styles.letterButtonText}>{letter}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.clearButton} onPress={clearSpelling}>
        <MaterialCommunityIcons name="eraser" size={20} color="#FFFFFF" />
        <ThemedText style={styles.clearText}>Clear</ThemedText>
      </TouchableOpacity>
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
          <ThemedText style={styles.categoryText}>Memory</ThemedText>
        </View>
      </View>

      <View style={styles.memoryInstructionCard}>
        <MaterialCommunityIcons name="lightbulb-on" size={32} color="#FFD93D" />
        <ThemedText style={styles.memoryInstruction}>
          Tap cards to flip them. Match the letters!
        </ThemedText>
      </View>

      <MemoryGame
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

  const renderVocabularyGame = () => (
    <View style={styles.gameContainer}>
      <LearningBuddy message="Show off your word skills!" buddy="robot" />
      <TimedQuiz
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
    setQuizCompleted(false);
    setRhymeAttempts(0);
    setRhymeCorrect(0);
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
          {selectedGame === 'alphabet' && renderAlphabetGame()}
          {selectedGame === 'spelling' && renderSpellingGame()}
          {selectedGame === 'rhyming' && renderRhymingGame()}
          {selectedGame === 'memory' && renderMemoryGame()}
          {selectedGame === 'vocabulary' && renderVocabularyGame()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.englishHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backText}>← Home</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.englishTitle}>English Fun 📚</ThemedText>
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
                <View style={[styles.gameIconContainer, { backgroundColor: '#56C596' }]}>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#56C596',
  },
  englishTitle: {
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
    backgroundColor: '#56C596',
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
    textAlign: 'center',
  },
  imageCard: {
    backgroundColor: '#E8F8E8',
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    borderWidth: 3,
    borderColor: '#56C596',
  },
  alphabetScroll: {
    width: '100%',
  },
  alphabetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  letterCard: {
    width: 100,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  letterCardContent: {
    padding: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#56C596',
    borderRadius: 20,
  },
  selectedLetterCard: {
    transform: [{ scale: 1.05 }],
    elevation: 8,
  },
  letterText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#56C596',
  },
  selectedLetterText: {
    color: '#FFFFFF',
  },
  wordEmoji: {
    fontSize: 32,
    marginTop: 8,
  },
  wordText: {
    fontSize: 13,
    color: '#56C596',
    marginTop: 4,
    fontWeight: '600',
  },
  selectedWordText: {
    color: '#FFFFFF',
  },
  spellingEmoji: {
    fontSize: 100,
  },
  spellingWordContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'center',
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
    width: 65,
    height: 65,
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
  letterButtonText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#56C596',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
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
    fontSize: 16,
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
