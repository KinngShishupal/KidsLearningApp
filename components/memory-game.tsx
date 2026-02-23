import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { soundManager } from '@/utils/sound-manager';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Card {
  id: number;
  content: string;
  matched: boolean;
  flipped: boolean;
}

interface MemoryGameProps {
  cards: string[];
  onComplete: () => void;
  cardBackColor?: string;
  cardFrontColors?: string[];
}

export function MemoryGame({ 
  cards, 
  onComplete, 
  cardBackColor = '#FFE5E5',
  cardFrontColors = ['#FF6B6B', '#FF8E53']
}: MemoryGameProps) {
  const [gameCards, setGameCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (cards.length > 0) {
      const doubled = [...cards, ...cards];
      const shuffled = doubled
        .map((content, index) => ({
          id: index,
          content,
          matched: false,
          flipped: false,
        }))
        .sort(() => Math.random() - 0.5);
      setGameCards(shuffled);
      setIsInitialized(true);
    }
  }, [cards]);

  const handleCardPress = (index: number) => {
    if (!isInitialized) return;
    if (flippedIndices.length === 2) return;
    if (gameCards[index]?.flipped || gameCards[index]?.matched) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newCards = [...gameCards];
    newCards[index].flipped = true;
    setGameCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (gameCards[first].content === gameCards[second].content) {
        soundManager.playSound('correct');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => {
          const updatedCards = [...gameCards];
          updatedCards[first].matched = true;
          updatedCards[second].matched = true;
          setGameCards(updatedCards);
          setFlippedIndices([]);
          setMatchedPairs(matchedPairs + 1);

          if (updatedCards.every(card => card.matched)) {
            setTimeout(() => {
              soundManager.playSound('celebration');
              onComplete();
            }, 500);
          }
        }, 600);
      } else {
        soundManager.playSound('wrong');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setTimeout(() => {
          const updatedCards = [...gameCards];
          updatedCards[first].flipped = false;
          updatedCards[second].flipped = false;
          setGameCards(updatedCards);
          setFlippedIndices([]);
        }, 1200);
      }
    }
  };

  if (!isInitialized || gameCards.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.loadingText}>Preparing cards...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsBar}>
        <View style={styles.statBadge}>
          <MaterialCommunityIcons name="gesture-tap" size={18} color="#FF6B6B" />
          <ThemedText style={styles.movesText}>Moves: {moves}</ThemedText>
        </View>
        <View style={styles.statBadge}>
          <MaterialCommunityIcons name="cards" size={18} color="#4CAF50" />
          <ThemedText style={styles.pairsText}>Pairs: {matchedPairs}/{cards.length}</ThemedText>
        </View>
      </View>
      <View style={styles.grid}>
        {gameCards.map((card, index) => (
          <MemoryCard
            key={card.id}
            content={card.content}
            flipped={card.flipped || card.matched}
            matched={card.matched}
            onPress={() => handleCardPress(index)}
            backColor={cardBackColor}
            frontColors={cardFrontColors}
          />
        ))}
      </View>
    </View>
  );
}

function MemoryCard({ 
  content, 
  flipped, 
  matched, 
  onPress, 
  backColor,
  frontColors
}: { 
  content: string; 
  flipped: boolean; 
  matched: boolean; 
  onPress: () => void;
  backColor: string;
  frontColors: string[];
}) {
  const rotateValue = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (flipped) {
      rotateValue.value = withTiming(180, { duration: 400 });
      scale.value = withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1, { damping: 12 })
      );
    } else {
      rotateValue.value = withTiming(0, { duration: 400 });
    }
  }, [flipped]);

  useEffect(() => {
    if (matched) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8 }),
        withSpring(0.95, { damping: 10 })
      );
    }
  }, [matched]);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotateValue.value}deg` },
      { scale: scale.value }
    ],
    opacity: rotateValue.value > 90 ? 0 : 1,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotateValue.value - 180}deg` },
      { scale: scale.value }
    ],
    opacity: rotateValue.value > 90 ? 1 : 0,
  }));

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={onPress}
      disabled={matched || flipped}
      activeOpacity={0.9}
    >
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <LinearGradient
          colors={frontColors}
          style={styles.cardGradient}
        >
          <MaterialCommunityIcons name="help" size={32} color="rgba(255, 255, 255, 0.8)" />
          <View style={styles.sparkle}>
            <MaterialCommunityIcons name="star-four-points" size={16} color="rgba(255, 255, 255, 0.6)" />
          </View>
        </LinearGradient>
      </Animated.View>
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <View style={[styles.cardBackContent, matched && styles.matchedCard]}>
          <ThemedText style={styles.cardContent}>{content}</ThemedText>
          {matched && (
            <View style={styles.matchBadge}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    fontSize: 18,
    color: '#999',
    padding: 40,
  },
  statsBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  movesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pairsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    maxWidth: 400,
  },
  cardContainer: {
    width: 85,
    height: 85,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  cardFront: {
    position: 'absolute',
  },
  cardBack: {
    position: 'absolute',
  },
  cardGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  cardBackContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  matchedCard: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  cardContent: {
    fontSize: 40,
  },
  matchBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
});
