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
    { id: 'alphabet', title: '🔤 Alphabet Fun', description: 'Learn your ABCs!' },
    { id: 'spelling', title: '✏️ Spelling Bee', description: 'Spell the words!' },
    { id: 'rhyming', title: '🎵 Rhyme Time', description: 'Find words that rhyme!' },
    { id: 'memory', title: '🧠 Letter Memory', description: 'Match the letters!' },
    { id: 'vocabulary', title: '⚡ Vocabulary Quiz', description: 'Quick word challenge!' },
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
      <ThemedText style={styles.gameQuestion}>Learn the Alphabet!</ThemedText>
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
              <ThemedText style={styles.letterText}>{letter}</ThemedText>
              {alphabetGame.words[letter as keyof typeof alphabetGame.words] && (
                <>
                  <ThemedText style={styles.wordEmoji}>
                    {alphabetGame.words[letter as keyof typeof alphabetGame.words].emoji}
                  </ThemedText>
                  <ThemedText style={styles.wordText}>
                    {alphabetGame.words[letter as keyof typeof alphabetGame.words].word}
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderSpellingGame = () => (
    <View style={styles.gameContainer}>
      <ThemedText style={styles.gameQuestion}>Spell the word!</ThemedText>
      <ThemedText style={styles.spellingEmoji}>{spellingGame.image}</ThemedText>
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
            style={styles.letterButton}
            onPress={() => handleSpellingLetter(letter)}
          >
            <ThemedText style={styles.letterButtonText}>{letter}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearSpelling}>
        <ThemedText style={styles.clearText}>Clear</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderRhymingGame = () => (
    <View style={styles.gameContainer}>
      <ThemedText style={styles.gameQuestion}>Find words that rhyme with:</ThemedText>
      <View style={styles.rhymeWordContainer}>
        <ThemedText style={styles.rhymeEmoji}>{rhymingGame.emoji}</ThemedText>
        <ThemedText style={styles.rhymeWord}>{rhymingGame.word}</ThemedText>
      </View>
      <View style={styles.rhymeOptionsGrid}>
        {rhymingGame.options.map((option) => (
          <TouchableOpacity
            key={option.word}
            style={[
              styles.rhymeButton,
              option.rhymes ? styles.rhymeButtonGreen : styles.rhymeButtonRed,
            ]}
            onPress={() => handleRhymeAnswer(option.word, option.rhymes)}
          >
            <ThemedText style={styles.rhymeEmoji}>{option.emoji}</ThemedText>
            <ThemedText style={styles.rhymeOptionText}>{option.word}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMemoryGame = () => (
    <View style={styles.gameContainer}>
      <LearningBuddy message="Match the letters!" buddy="star" />
      <MemoryGame
        cards={letterMemoryCards}
        onComplete={() => {
          const finalScore = score + 20;
          setGameResults({ score: finalScore, total: letterMemoryCards.length, correct: letterMemoryCards.length });
          setShowResultsModal(true);
        }}
        cardBackColor="#E8F8E8"
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
    color: '#56C596',
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
  gameQuestion: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#56C596',
    marginBottom: 24,
    textAlign: 'center',
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
    backgroundColor: '#E8F8E8',
    width: 100,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#56C596',
  },
  selectedLetterCard: {
    backgroundColor: '#56C596',
    transform: [{ scale: 1.05 }],
  },
  letterText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#56C596',
  },
  wordEmoji: {
    fontSize: 32,
    marginTop: 8,
  },
  wordText: {
    fontSize: 14,
    color: '#56C596',
    marginTop: 4,
  },
  spellingEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  spellingWordContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  spellingLetterBox: {
    backgroundColor: '#56C596',
    width: 50,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spellingLetterText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyLetterBox: {
    backgroundColor: '#E8F8E8',
    width: 50,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#56C596',
    borderStyle: 'dashed',
  },
  emptyLetterText: {
    fontSize: 28,
    color: '#56C596',
  },
  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  letterButton: {
    backgroundColor: '#E8F8E8',
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#56C596',
  },
  letterButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#56C596',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  clearText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rhymeWordContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#E8F8E8',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#56C596',
  },
  rhymeEmoji: {
    fontSize: 48,
  },
  rhymeWord: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#56C596',
    marginTop: 8,
  },
  rhymeOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  rhymeButton: {
    width: 140,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 3,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rhymeButtonGreen: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  rhymeButtonRed: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
  rhymeOptionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
});
