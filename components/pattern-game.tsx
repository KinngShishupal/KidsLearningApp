import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PatternCelebration } from '@/components/pattern-celebration';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Pattern {
  sequence: string[];
  options: string[];
  missingIndex: number;
  hint?: string;
  type?: string;
}

interface PatternGameProps {
  patterns: Pattern[];
  onComplete: (score: number, correctAnswers: number) => void;
  color?: string;
}

export function PatternGame({ patterns, onComplete, color = '#FF6B6B' }: PatternGameProps) {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  const pattern = patterns[currentPattern];
  const pulseAnimation = useSharedValue(1);

  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, [currentPattern]);

  const missingBoxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === pattern.sequence[pattern.missingIndex];
    setLastAnswerCorrect(isCorrect);
    setShowCelebration(true);

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 15;
      const newCorrectCount = correctCount + 1;
      setScore(newScore);
      setCorrectCount(newCorrectCount);
      setShowExplanation(true);
      
      setTimeout(() => {
        setShowCelebration(false);
        setShowExplanation(false);
        if (currentPattern < patterns.length - 1) {
          setCurrentPattern(currentPattern + 1);
          setSelectedAnswer(null);
          setShowHint(false);
        } else {
          onComplete(newScore, newCorrectCount);
        }
      }, 2000);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setShowExplanation(true);
      setTimeout(() => {
        setShowCelebration(false);
        setShowExplanation(false);
        onComplete(score, correctCount);
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      <PatternCelebration 
        show={showCelebration} 
        isCorrect={lastAnswerCorrect} 
        patternType={pattern.type} 
      />
      <View style={styles.header}>
        <View style={styles.progressBadge}>
          <MaterialCommunityIcons name="progress-check" size={16} color={color} />
          <ThemedText style={[styles.questionNumber, { color }]}>
            {currentPattern + 1}/{patterns.length}
          </ThemedText>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: color }]}>
          <ThemedText style={styles.categoryText}>Pattern</ThemedText>
        </View>
      </View>

      <View style={[styles.questionCard, { borderColor: color + '40' }]}>
        <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
          <MaterialCommunityIcons name="puzzle" size={40} color={color} />
        </View>
        <View style={styles.titleRow}>
          <ThemedText style={styles.title}>Find the Pattern!</ThemedText>
          {pattern.type && (
            <View style={[styles.typeBadge, { backgroundColor: color }]}>
              <ThemedText style={styles.typeText}>{pattern.type}</ThemedText>
            </View>
          )}
        </View>
        
        <View style={styles.patternDisplayCard}>
          <View style={styles.patternContainer}>
            {pattern.sequence.map((item, index) => (
              <View key={index} style={styles.patternItemContainer}>
                {index === pattern.missingIndex ? (
                  <Animated.View style={[styles.missingBox, { borderColor: color }, missingBoxStyle]}>
                    <MaterialCommunityIcons name="help" size={32} color={color} />
                  </Animated.View>
                ) : (
                  <View style={[styles.patternBox, { backgroundColor: color }]}>
                    <ThemedText style={styles.patternItem}>{item}</ThemedText>
                    <View style={styles.indexBadge}>
                      <ThemedText style={styles.indexText}>{index + 1}</ThemedText>
                    </View>
                  </View>
                )}
                {index < pattern.sequence.length - 1 && (
                  <MaterialCommunityIcons 
                    name="arrow-right" 
                    size={16} 
                    color="#999" 
                    style={styles.arrowIcon}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        {pattern.hint && !selectedAnswer && (
          <TouchableOpacity 
            style={styles.hintButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowHint(!showHint);
            }}
          >
            <MaterialCommunityIcons name={showHint ? "lightbulb-on" : "lightbulb-outline"} size={20} color={color} />
            <ThemedText style={[styles.hintButtonText, { color }]}>
              {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </ThemedText>
          </TouchableOpacity>
        )}

        {showHint && pattern.hint && (
          <View style={[styles.hintCard, { backgroundColor: color + '10', borderColor: color }]}>
            <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD93D" />
            <ThemedText style={styles.hintText}>{pattern.hint}</ThemedText>
          </View>
        )}
      </View>

      {showExplanation && (
        <View style={[
          styles.explanationCard, 
          { 
            backgroundColor: selectedAnswer === pattern.sequence[pattern.missingIndex] ? '#E8F5E9' : '#FFEBEE',
            borderColor: selectedAnswer === pattern.sequence[pattern.missingIndex] ? '#4CAF50' : '#F44336'
          }
        ]}>
          <MaterialCommunityIcons 
            name={selectedAnswer === pattern.sequence[pattern.missingIndex] ? "check-circle" : "information"} 
            size={24} 
            color={selectedAnswer === pattern.sequence[pattern.missingIndex] ? '#4CAF50' : '#F44336'} 
          />
          <View style={styles.explanationContent}>
            <ThemedText style={styles.explanationTitle}>
              {selectedAnswer === pattern.sequence[pattern.missingIndex] ? 'Perfect! 🎉' : 'The answer was:'}
            </ThemedText>
            <ThemedText style={styles.explanationText}>
              {selectedAnswer === pattern.sequence[pattern.missingIndex] 
                ? `Great job spotting the ${pattern.type?.toLowerCase()} pattern!` 
                : `The pattern continues with: ${pattern.sequence[pattern.missingIndex]}`}
            </ThemedText>
          </View>
        </View>
      )}

      <ThemedText style={styles.instructionText}>Tap to complete the pattern:</ThemedText>

      <View style={styles.optionsContainer}>
        {pattern.options.map((option, index) => {
          let buttonStyle = [styles.optionButton];
          if (selectedAnswer === option) {
            if (option === pattern.sequence[pattern.missingIndex]) {
              buttonStyle.push(styles.correctOption);
            } else {
              buttonStyle.push(styles.incorrectOption);
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <ThemedText style={styles.optionText}>{option}</ThemedText>
              {selectedAnswer === option && option === pattern.sequence[pattern.missingIndex] && (
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
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  },
  iconCircle: {
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  patternDisplayCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFE5E5',
  },
  patternContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowIcon: {
    opacity: 0.5,
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
  },
  hintButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  explanationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    gap: 12,
    borderWidth: 3,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  explanationContent: {
    flex: 1,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  patternBox: {
    width: 70,
    height: 70,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    position: 'relative',
  },
  indexBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
  },
  missingBox: {
    width: 70,
    height: 70,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderStyle: 'dashed',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  patternItem: {
    fontSize: 42,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    width: 85,
    height: 85,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F0F0F0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: 'relative',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
    transform: [{ scale: 1.05 }],
  },
  incorrectOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#D32F2F',
  },
  optionText: {
    fontSize: 38,
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
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
