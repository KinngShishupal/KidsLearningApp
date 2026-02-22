import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
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
}

export function MemoryGame({ cards, onComplete, cardBackColor = '#FFE5E5' }: MemoryGameProps) {
  const [gameCards, setGameCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
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
  }, [cards]);

  const handleCardPress = (index: number) => {
    if (flippedIndices.length === 2) return;
    if (gameCards[index].flipped || gameCards[index].matched) return;

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
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => {
          const updatedCards = [...gameCards];
          updatedCards[first].matched = true;
          updatedCards[second].matched = true;
          setGameCards(updatedCards);
          setFlippedIndices([]);

          if (updatedCards.every(card => card.matched)) {
            onComplete();
          }
        }, 500);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setTimeout(() => {
          const updatedCards = [...gameCards];
          updatedCards[first].flipped = false;
          updatedCards[second].flipped = false;
          setGameCards(updatedCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.movesText}>Moves: {moves}</ThemedText>
      <View style={styles.grid}>
        {gameCards.map((card, index) => (
          <MemoryCard
            key={card.id}
            content={card.content}
            flipped={card.flipped || card.matched}
            matched={card.matched}
            onPress={() => handleCardPress(index)}
            backColor={cardBackColor}
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
  backColor 
}: { 
  content: string; 
  flipped: boolean; 
  matched: boolean; 
  onPress: () => void;
  backColor: string;
}) {
  const rotateValue = useSharedValue(0);

  useEffect(() => {
    rotateValue.value = withTiming(flipped ? 180 : 0, { duration: 300 });
  }, [flipped]);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateValue.value}deg` }],
    opacity: rotateValue.value > 90 ? 0 : 1,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateValue.value - 180}deg` }],
    opacity: rotateValue.value > 90 ? 1 : 0,
  }));

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={onPress}
      disabled={matched}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.card, styles.cardFront, { backgroundColor: backColor }, frontAnimatedStyle]}>
        <ThemedText style={styles.cardQuestion}>?</ThemedText>
      </Animated.View>
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <ThemedText style={styles.cardContent}>{content}</ThemedText>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  movesText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    maxWidth: 400,
  },
  cardContainer: {
    width: 80,
    height: 80,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardFront: {
    position: 'absolute',
  },
  cardBack: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  cardQuestion: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#666',
  },
  cardContent: {
    fontSize: 36,
  },
});
