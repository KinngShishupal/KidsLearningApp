import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withRepeat, 
  withSequence,
  withTiming 
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { LearningBuddy } from '@/components/learning-buddy';

const { width } = Dimensions.get('window');

function AnimatedCard({ subject, index }: { subject: any; index: number }) {
  const router = useRouter();
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    rotate.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 1000 }),
        withTiming(-2, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={() => router.push(subject.route)}
        activeOpacity={0.8}
      >
        <View style={[styles.card, { backgroundColor: subject.colors[0] }]}>
          <View style={styles.cardContent}>
            <ThemedText style={styles.cardTitle}>{subject.title}</ThemedText>
            <ThemedText style={styles.cardSubtitle}>{subject.subtitle}</ThemedText>
            <View style={styles.playButton}>
              <ThemedText style={styles.playText}>Play Now!</ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const headerScale = useSharedValue(0);

  useEffect(() => {
    headerScale.value = withSpring(1, { damping: 8, stiffness: 80 });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const subjects = [
    {
      id: 'math',
      title: '🔢 Math',
      subtitle: 'Numbers & Counting',
      colors: ['#FF6B6B', '#FF8E53'],
      route: '/math',
    },
    {
      id: 'science',
      title: '🔬 Science',
      subtitle: 'Explore the World',
      colors: ['#4ECDC4', '#44A08D'],
      route: '/science',
    },
    {
      id: 'english',
      title: '📚 English',
      subtitle: 'Letters & Words',
      colors: ['#A8E6CF', '#56C596'],
      route: '/english',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <ThemedText style={styles.headerTitle}>Learn With Fun!</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Choose a subject to start learning</ThemedText>
      </Animated.View>

      <LearningBuddy 
        message="Hi! I'm your learning buddy! Pick a subject to start playing!" 
        buddy="robot"
      />

      <View style={styles.cardsContainer}>
        {subjects.map((subject, index) => (
          <AnimatedCard key={subject.id} subject={subject} index={index} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#666',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    minHeight: 160,
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  playText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
