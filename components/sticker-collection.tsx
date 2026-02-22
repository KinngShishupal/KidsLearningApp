import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface Sticker {
  id: string;
  emoji: string;
  name: string;
  earned: boolean;
}

interface StickerCollectionProps {
  stickers: Sticker[];
}

function AnimatedSticker({ sticker, index }: { sticker: Sticker; index: number }) {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (sticker.earned) {
      scale.value = withSpring(1, { damping: 10, delay: index * 100 });
      rotate.value = withRepeat(
        withSequence(
          withSpring(5, { damping: 8 }),
          withSpring(-5, { damping: 8 }),
          withSpring(0, { damping: 8 })
        ),
        -1,
        false
      );
    }
  }, [sticker.earned]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.stickerCard,
        !sticker.earned && styles.stickerLocked,
        sticker.earned && animatedStyle,
      ]}
    >
      <ThemedText style={[styles.stickerEmoji, !sticker.earned && styles.stickerEmojiLocked]}>
        {sticker.emoji}
      </ThemedText>
      <ThemedText style={[styles.stickerName, !sticker.earned && styles.stickerNameLocked]}>
        {sticker.name}
      </ThemedText>
      {!sticker.earned && (
        <View style={styles.lockIcon}>
          <ThemedText style={styles.lockEmoji}>🔒</ThemedText>
        </View>
      )}
    </Animated.View>
  );
}

export function StickerCollection({ stickers }: StickerCollectionProps) {
  const earnedCount = stickers.filter(s => s.earned).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Sticker Collection</ThemedText>
        <ThemedText style={styles.progress}>
          {earnedCount} of {stickers.length} collected
        </ThemedText>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.stickersContainer}>
          {stickers.map((sticker, index) => (
            <AnimatedSticker key={sticker.id} sticker={sticker} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  progress: {
    fontSize: 16,
    color: '#666',
  },
  stickersContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  stickerCard: {
    width: 100,
    height: 120,
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFD93D',
  },
  stickerLocked: {
    backgroundColor: '#F0F0F0',
    borderColor: '#CCC',
    opacity: 0.5,
  },
  stickerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  stickerEmojiLocked: {
    opacity: 0.3,
  },
  stickerName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  stickerNameLocked: {
    color: '#999',
  },
  lockIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  lockEmoji: {
    fontSize: 20,
  },
});
