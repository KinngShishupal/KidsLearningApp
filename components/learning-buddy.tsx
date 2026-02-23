import { ThemedText } from '@/components/themed-text';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface LearningBuddyProps {
  message?: string;
  buddy?: 'robot' | 'cat' | 'star' | 'owl' | 'unicorn' | 'rocket' | 'brain' | 
          'dragon' | 'alien' | 'panda' | 'lion' | 'fox' | 'penguin' | 'koala' |
          'tiger' | 'monkey' | 'bear' | 'wizard' | 'ninja' | 'superhero' | 'pirate';
  mood?: 'idle' | 'excited' | 'thinking' | 'celebrating';
  interactive?: boolean;
}

export function LearningBuddy({ 
  message = 'Let\'s learn!', 
  buddy = 'robot',
  mood = 'idle',
  interactive = true
}: LearningBuddyProps) {
  const [currentMood, setCurrentMood] = useState(mood);
  const [tapCount, setTapCount] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  const bounce = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const speechBubbleScale = useSharedValue(0);
  const speechBubbleOpacity = useSharedValue(0);
  const pulse = useSharedValue(1);
  const wiggle = useSharedValue(0);

  const buddyEmojis = {
    robot: '🤖',
    cat: '😺',
    star: '⭐',
    owl: '🦉',
    unicorn: '🦄',
    rocket: '🚀',
    brain: '🧠',
    dragon: '🐉',
    alien: '👽',
    panda: '🐼',
    lion: '🦁',
    fox: '🦊',
    penguin: '🐧',
    koala: '🐨',
    tiger: '🐯',
    monkey: '🐵',
    bear: '🐻',
    wizard: '🧙',
    ninja: '🥷',
    superhero: '🦸',
    pirate: '🏴‍☠️',
  };

  const celebrationEmojis = ['✨', '🎉', '🌟', '💫', '🎊'];

  useEffect(() => {
    let isMounted = true;
    
    const loadSound = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
        
        const { sound: loadedSound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/no.mp3')
        );
        
        if (isMounted) {
          setSound(loadedSound);
        }
      } catch (error) {
        console.log('Error loading sound:', error);
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    speechBubbleScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    speechBubbleOpacity.value = withTiming(1, { duration: 400 });
  }, [message]);

  useEffect(() => {
    setCurrentMood(mood);
  }, [mood]);

  useEffect(() => {
    if (currentMood === 'idle') {
      bounce.value = withRepeat(
        withSequence(
          withSpring(-8, { damping: 10 }),
          withSpring(0, { damping: 10 })
        ),
        -1,
        false
      );

      rotate.value = withRepeat(
        withSequence(
          withTiming(3, { duration: 800 }),
          withTiming(-3, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        false
      );

      pulse.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        false
      );
    } else if (currentMood === 'excited') {
      bounce.value = withRepeat(
        withSequence(
          withSpring(-20, { damping: 8 }),
          withSpring(0, { damping: 8 })
        ),
        -1,
        false
      );

      rotate.value = withRepeat(
        withSequence(
          withTiming(15, { duration: 300 }),
          withTiming(-15, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      );

      scale.value = withRepeat(
        withSequence(
          withSpring(1.2, { damping: 8 }),
          withSpring(1, { damping: 8 })
        ),
        -1,
        false
      );
    } else if (currentMood === 'thinking') {
      rotate.value = withRepeat(
        withSequence(
          withTiming(10, { duration: 600 }),
          withTiming(-10, { duration: 600 })
        ),
        -1,
        true
      );

      bounce.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 800 }),
          withTiming(5, { duration: 800 })
        ),
        -1,
        true
      );

      pulse.value = withRepeat(
        withSequence(
          withTiming(0.95, { duration: 700 }),
          withTiming(1.05, { duration: 700 })
        ),
        -1,
        true
      );
    } else if (currentMood === 'celebrating') {
      bounce.value = withRepeat(
        withSequence(
          withSpring(-30, { damping: 5 }),
          withSpring(0, { damping: 5 })
        ),
        4,
        false
      );

      rotate.value = withRepeat(
        withSequence(
          withTiming(360, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withTiming(0, { duration: 0 })
        ),
        2,
        false
      );

      scale.value = withSequence(
        withSpring(1.5, { damping: 8 }),
        withSpring(1, { damping: 10 })
      );

      wiggle.value = withRepeat(
        withSequence(
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        ),
        3,
        false
      );
    }
  }, [currentMood]);

  const playSound = async () => {
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    }
  };

  const handlePress = () => {
    if (!interactive) return;
    
    playSound();
    setTapCount(prev => prev + 1);
    
    scale.value = withSequence(
      withSpring(1.3, { damping: 10 }),
      withSpring(1, { damping: 8 })
    );
    
    wiggle.value = withSequence(
      withTiming(15, { duration: 100 }),
      withTiming(-15, { duration: 100 }),
      withTiming(15, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    bounce.value = withSequence(
      withSpring(-25, { damping: 8 }),
      withSpring(0, { damping: 10 })
    );

    const moods: Array<'idle' | 'excited' | 'thinking' | 'celebrating'> = ['excited', 'thinking', 'celebrating', 'idle'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    setTimeout(() => {
      setCurrentMood(randomMood);
      setTimeout(() => setCurrentMood('idle'), 3000);
    }, 300);
  };

  const animatedBuddyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounce.value },
      { rotate: `${rotate.value + wiggle.value}deg` },
      { scale: scale.value * pulse.value },
    ],
  }));

  const animatedSpeechBubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: speechBubbleScale.value }],
    opacity: speechBubbleOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => {
    const glowIntensity = interpolate(
      pulse.value,
      [0.95, 1.05],
      [0.3, 0.7]
    );
    return {
      opacity: currentMood === 'celebrating' || currentMood === 'excited' ? glowIntensity : 0,
    };
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} disabled={!interactive}>
        <View style={styles.buddyWrapper}>
          <Animated.View style={[styles.glow, glowStyle]} />
          <Animated.View style={[styles.buddyContainer, animatedBuddyStyle]}>
            <ThemedText style={styles.buddyEmoji}>{buddyEmojis[buddy]}</ThemedText>
          </Animated.View>
          {tapCount > 0 && tapCount % 5 === 0 && (
            <View style={styles.celebrationContainer}>
              {celebrationEmojis.map((emoji, index) => (
                <ThemedText key={index} style={[styles.celebrationEmoji, { 
                  transform: [
                    { translateX: Math.cos(index * 72 * Math.PI / 180) * 40 },
                    { translateY: Math.sin(index * 72 * Math.PI / 180) * 40 }
                  ]
                }]}>
                  {emoji}
                </ThemedText>
              ))}
            </View>
          )}
        </View>
      </Pressable>
      <Animated.View style={[styles.speechBubble, animatedSpeechBubbleStyle]}>
        <View style={styles.speechBubbleTriangle} />
        <ThemedText style={styles.buddyMessage}>{message}</ThemedText>
        {currentMood === 'thinking' && (
          <ThemedText style={styles.thinkingDots}>🤔</ThemedText>
        )}
        {currentMood === 'celebrating' && (
          <ThemedText style={styles.celebratingEmoji}>🎉</ThemedText>
        )}
        {currentMood === 'excited' && (
          <ThemedText style={styles.excitedEmoji}>✨</ThemedText>
        )}
      </Animated.View>
      {interactive && (
        <ThemedText style={styles.tapHint}>Tap me!</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  buddyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  buddyContainer: {
    marginBottom: 12,
  },
  buddyEmoji: {
    fontSize: 80,
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  celebrationContainer: {
    position: 'absolute',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationEmoji: {
    position: 'absolute',
    fontSize: 24,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxWidth: '85%',
    minWidth: '60%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    position: 'relative',
  },
  speechBubbleTriangle: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  buddyMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  thinkingDots: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  celebratingEmoji: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  excitedEmoji: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  tapHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
