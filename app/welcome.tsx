import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const USER_NAME_KEY = '@learn_with_fun_username';

const TITLE_COLORS = ['#FF6B6B', '#FF9F43', '#FECA57', '#1DD1A1', '#48DBFB', '#A29BFE'];

const SUBJECTS = [
  { label: 'Math', icon: 'calculator-variant', colors: ['#FF6B6B', '#FF8E53'] },
  { label: 'Science', icon: 'flask', colors: ['#4ECDC4', '#44A08D'] },
  { label: 'English', icon: 'book-alphabet', colors: ['#56C596', '#3AA76D'] },
] as const;

/** Static background doodles: icon, size, color and position. */
const DOODLES = [
  { icon: 'star', size: 34, color: '#FFE066', top: '8%', left: '8%' },
  { icon: 'cloud', size: 56, color: 'rgba(255, 255, 255, 0.55)', top: '5%', right: '10%' },
  { icon: 'pencil', size: 28, color: 'rgba(255, 255, 255, 0.6)', top: '22%', right: '6%' },
  { icon: 'music-note', size: 26, color: 'rgba(255, 255, 255, 0.55)', top: '17%', left: '14%' },
  { icon: 'star-four-points', size: 22, color: '#FFFFFF', top: '15%', left: '40%' },
  { icon: 'balloon', size: 36, color: 'rgba(255, 159, 67, 0.75)', bottom: '18%', right: '6%' },
  { icon: 'star', size: 24, color: '#FFE066', bottom: '10%', left: '10%' },
  { icon: 'numeric-1-circle', size: 28, color: 'rgba(255, 255, 255, 0.5)', bottom: '28%', left: '4%' },
] as const;

const easeOut = Easing.out(Easing.cubic);

export default function WelcomeScreen() {
  const router = useRouter();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const isEditing = edit === '1';
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const headerOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.96);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400, easing: easeOut });
    cardOpacity.value = withDelay(150, withTiming(1, { duration: 400, easing: easeOut }));
    cardScale.value = withDelay(150, withTiming(1, { duration: 400, easing: easeOut }));
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    AsyncStorage.getItem(USER_NAME_KEY)
      .then((savedName) => {
        if (savedName) setName(savedName);
      })
      .catch((loadError) => console.error('Error loading name:', loadError));
  }, [isEditing]);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0;

  const handleSubmit = async () => {
    if (trimmedName.length === 0) {
      setError('Please enter your name');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (trimmedName.length < 2) {
      setError('Name should be at least 2 characters');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (trimmedName.length > 20) {
      setError('Name is too long (max 20 characters)');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      await AsyncStorage.setItem(USER_NAME_KEY, trimmedName);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (isEditing && router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } catch (saveError) {
      console.error('Error saving name:', saveError);
      setError('Failed to save name. Please try again.');
    }
  };

  const titleText = isEditing ? 'Your Name' : 'Learn With Fun';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#6DD5FA', '#8EC5FC', '#C3B1FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {DOODLES.map((doodle, index) => {
          const { icon, size, color, ...position } = doodle;
          return (
            <MaterialCommunityIcons
              key={index}
              name={icon}
              size={size}
              color={color}
              style={[styles.doodle, position]}
            />
          );
        })}
        <View style={styles.hillBack} />
        <View style={styles.hillFront} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.logoFrame}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
              contentFit="cover"
            />
          </View>

          <ThemedText style={styles.greeting}>
            {isEditing ? 'Change' : 'Welcome to'}
          </ThemedText>
          <ThemedText style={styles.appName}>
            {titleText.split('').map((char, index) => (
              <ThemedText
                key={index}
                style={[styles.appName, { color: TITLE_COLORS[index % TITLE_COLORS.length] }]}
              >
                {char}
              </ThemedText>
            ))}
          </ThemedText>
        </Animated.View>

        <Animated.View style={[styles.card, cardStyle]}>
          <View style={styles.cardHeader}>
            <View style={styles.waveBadge}>
              <ThemedText style={styles.waveEmoji}>👋</ThemedText>
            </View>
            <View style={styles.cardHeaderText}>
              <ThemedText style={styles.cardTitle}>What&apos;s your name?</ThemedText>
              <ThemedText style={styles.cardSubtitle}>
                {isEditing ? 'Type a new name below' : 'So your buddy knows what to call you'}
              </ThemedText>
            </View>
          </View>

          <View
            style={[
              styles.inputContainer,
              isFocused && styles.inputContainerFocused,
              error ? styles.inputContainerError : null,
            ]}
          >
            <MaterialCommunityIcons
              name="account-circle"
              size={28}
              color={error ? '#F44336' : isFocused ? '#7C6CF2' : '#B0B0C3'}
            />
            <TextInput
              style={styles.input}
              placeholder="Type your name"
              placeholderTextColor="#A9A9BC"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={20}
              autoFocus={isEditing}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            <ThemedText style={styles.counter}>{name.length}/20</ThemedText>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={18} color="#F44336" />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          ) : canSubmit ? (
            <View style={styles.previewChip}>
              <ThemedText style={styles.previewText} numberOfLines={1}>
                Hi, {trimmedName}! 🎉
              </ThemedText>
            </View>
          ) : (
            <View style={styles.previewSpacer} />
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}
            style={styles.submitTouch}
          >
            <LinearGradient
              colors={canSubmit ? ['#FF8A65', '#FF6B6B', '#F25287'] : ['#D5D5E0', '#C4C4D2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButton}
            >
              <ThemedText style={styles.submitButtonText}>
                {isEditing ? 'Save Name' : "Let's Play!"}
              </ThemedText>
              <MaterialCommunityIcons
                name={isEditing ? 'check-circle' : 'rocket-launch'}
                size={24}
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>

          {isEditing && router.canGoBack() ? (
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </TouchableOpacity>
          ) : (
            <View style={styles.helperTextContainer}>
              <MaterialCommunityIcons name="shield-check" size={16} color="#9A9AB0" />
              <ThemedText style={styles.helperText}>Your name stays on this device</ThemedText>
            </View>
          )}
        </Animated.View>

        {!isEditing && (
          <Animated.View style={[styles.subjectsRow, cardStyle]}>
            {SUBJECTS.map((subject) => (
              <LinearGradient
                key={subject.label}
                colors={subject.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.subjectChip}
              >
                <MaterialCommunityIcons name={subject.icon} size={18} color="#FFFFFF" />
                <ThemedText style={styles.subjectText}>{subject.label}</ThemedText>
              </LinearGradient>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8EC5FC',
  },
  doodle: {
    position: 'absolute',
  },
  hillBack: {
    position: 'absolute',
    bottom: -140,
    left: -80,
    width: 420,
    height: 260,
    borderRadius: 210,
    backgroundColor: 'rgba(130, 220, 160, 0.45)',
  },
  hillFront: {
    position: 'absolute',
    bottom: -170,
    right: -100,
    width: 460,
    height: 280,
    borderRadius: 230,
    backgroundColor: 'rgba(86, 197, 150, 0.5)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoFrame: {
    padding: 6,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    elevation: 12,
    shadowColor: '#4B3BC4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    transform: [{ rotate: '-4deg' }],
  },
  logo: {
    width: 104,
    height: 104,
    borderRadius: 28,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(60, 40, 140, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appName: {
    fontSize: 40,
    lineHeight: 50,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.95)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    elevation: 14,
    shadowColor: '#4B3BC4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  waveBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF4D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveEmoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3D3A5C',
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B8AA3',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F5F4FF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E6E3FA',
    paddingHorizontal: 14,
  },
  inputContainerFocused: {
    borderColor: '#7C6CF2',
    backgroundColor: '#FFFFFF',
  },
  inputContainerError: {
    borderColor: '#F44336',
    backgroundColor: '#FFF6F5',
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 20,
    fontWeight: '700',
    color: '#3D3A5C',
    paddingVertical: 16,
  },
  counter: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B0B0C3',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#F44336',
    fontWeight: '600',
  },
  previewChip: {
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#EEF9F1',
    maxWidth: '100%',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2E9E62',
  },
  previewSpacer: {
    height: 12,
  },
  submitTouch: {
    marginTop: 16,
    borderRadius: 22,
    elevation: 6,
    shadowColor: '#F25287',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 22,
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  helperTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  helperText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9A9AB0',
  },
  cancelButton: {
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B8AA3',
  },
  subjectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
