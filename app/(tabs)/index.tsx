import { AdBanner } from '@/components/ad-banner';
import { LearningBuddy } from '@/components/learning-buddy';
import { ThemedText } from '@/components/themed-text';
import { soundManager } from '@/utils/sound-manager';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router/react-navigation';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const USER_NAME_KEY = '@learn_with_fun_username';

function AnimatedCard({ subject, index }: { subject: any; index: number }) {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.96);

  useEffect(() => {
    const easeOut = Easing.out(Easing.cubic);
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 400, easing: easeOut }));
    scale.value = withDelay(index * 100, withTiming(1, { duration: 400, easing: easeOut }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={() => {
          soundManager.playSound('click');
          router.push(subject.route);
        }}
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
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name={subject.icon} 
                size={64} 
                color="rgba(255, 255, 255, 0.9)"
              />
            </View>
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
  const router = useRouter();
  const headerOpacity = useSharedValue(0);
  const [userName, setUserName] = useState('');

  const loadUserName = async () => {
    try {
      const savedName = await AsyncStorage.getItem(USER_NAME_KEY);
      if (savedName) {
        setUserName(savedName);
      }
    } catch (error) {
      console.error('Error loading username:', error);
    }
  };

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    loadUserName();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserName();
    }, [])
  );

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
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
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        <Animated.View style={headerAnimatedStyle}>
          <LinearGradient
            colors={['#FF6B6B', '#4ECDC4', '#56C596']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerIconCircle}>
                <Image
                  source={require('@/assets/images/icon.png')}
                  style={styles.headerLogo}
                  contentFit="cover"
                />
              </View>
              <ThemedText style={styles.headerTitle}>
                {userName ? `Hi, ${userName}!` : 'Learn With Fun!'}
              </ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                {userName ? 'Ready to learn today?' : 'Choose a subject to start'}
              </ThemedText>
              <TouchableOpacity
                style={styles.changeNameButton}
                onPress={() => {
                  soundManager.playSound('click');
                  router.push({ pathname: '/welcome', params: { edit: '1' } });
                }}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="pencil" size={16} color="#FFFFFF" />
                <ThemedText style={styles.changeNameText}>{userName ? 'Change name' : 'Add your name'}</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.headerDecoration}>
              <View style={styles.decorativeCircleSmall} />
              <View style={styles.decorativeCircleLarge} />
            </View>
          </LinearGradient>
        </Animated.View>
  
        <LearningBuddy 
          message={userName 
            ? `Great to see you, ${userName}! Ready for some fun games?` 
            : "Hi! I'm your learning buddy! Pick a subject to start playing!"
          }
          buddy="robot"
        />
  
        <View style={styles.cardsContainer}>
          {subjects.map((subject, index) => (
            <AnimatedCard key={subject.id} subject={subject} index={index} />
          ))}
        </View>
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
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 36,
    paddingHorizontal: 20,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
    paddingVertical: 8,
  },
  headerLogo: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },
  headerIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'visible',
  },
  changeNameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  changeNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    paddingVertical: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 44,
    includeFontPadding: false,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    lineHeight: 24,
    includeFontPadding: false,
    textAlign: 'center',
    paddingVertical: 2,
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  decorativeCircleSmall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    position: 'absolute',
    top: 30,
    right: 10,
  },
  decorativeCircleLarge: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    position: 'absolute',
    top: -30,
    right: -40,
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
    minHeight: 280,
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
    paddingBottom: 16,
    paddingTop: 24,
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
    overflow: 'visible',
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.5,
    lineHeight: 42,
    includeFontPadding: false,
  },
  cardSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 22,
    includeFontPadding: false,
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
    lineHeight: 20,
    includeFontPadding: false,
  },
  cardFooter: {
    padding: 20,
    paddingBottom: 24,
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
    lineHeight: 24,
    includeFontPadding: false,
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
