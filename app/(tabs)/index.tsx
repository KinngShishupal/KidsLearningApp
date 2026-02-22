import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  const floatY = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: floatY.value },
    ],
  }));

  const iconRotate = useSharedValue(0);

  useEffect(() => {
    iconRotate.value = withRepeat(
      withSequence(
        withSpring(15, { damping: 8 }),
        withSpring(-15, { damping: 8 }),
        withSpring(0, { damping: 8 })
      ),
      -1,
      false
    );
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotate.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={() => router.push(subject.route)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={subject.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <View style={styles.badgeContainer}>
              <ThemedText style={styles.badgeText}>{subject.gameCount} Games</ThemedText>
            </View>
            <Animated.View style={[styles.iconContainer, iconStyle]}>
              <MaterialCommunityIcons 
                name={subject.icon} 
                size={64} 
                color="rgba(255, 255, 255, 0.9)" 
              />
            </Animated.View>
          </View>

          <View style={styles.cardBody}>
            <ThemedText style={styles.cardTitle}>{subject.title}</ThemedText>
            <ThemedText style={styles.cardSubtitle}>{subject.subtitle}</ThemedText>
            
            <View style={styles.featuresContainer}>
              {subject.features.map((feature: string, idx: number) => (
                <View key={idx} style={styles.featureRow}>
                  <ThemedText style={styles.featureBullet}>•</ThemedText>
                  <ThemedText style={styles.featureText}>{feature}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.playButton}>
              <MaterialCommunityIcons name="play-circle" size={24} color="#FFFFFF" />
              <ThemedText style={styles.playText}>Start Learning!</ThemedText>
            </View>
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />
          </View>
        </LinearGradient>
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
      title: 'Math',
      subtitle: 'Numbers & Problem Solving',
      colors: ['#FF6B6B', '#FF8E53'],
      route: '/math',
      icon: 'calculator-variant',
      gameCount: 8,
      features: ['Counting', 'Addition', 'Memory'],
    },
    {
      id: 'science',
      title: 'Science',
      subtitle: 'Discover Nature & Animals',
      colors: ['#4ECDC4', '#44A08D'],
      route: '/science',
      icon: 'flask',
      gameCount: 7,
      features: ['Animals', 'Planets', 'Memory'],
    },
    {
      id: 'english',
      title: 'English',
      subtitle: 'Reading & Vocabulary',
      colors: ['#56C596', '#3AA76D'],
      route: '/english',
      icon: 'book-alphabet',
      gameCount: 7,
      features: ['Alphabet', 'Spelling', 'Memory'],
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
    marginBottom: 24,
  },
  card: {
    borderRadius: 28,
    padding: 0,
    minHeight: 240,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  badgeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  cardTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureBullet: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
  },
  cardFooter: {
    padding: 20,
    paddingTop: 16,
    position: 'relative',
  },
  playButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  playText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -30,
    right: -20,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -10,
    left: 20,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: 30,
    left: -10,
  },
});
