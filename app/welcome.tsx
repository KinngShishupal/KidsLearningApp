import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const USER_NAME_KEY = '@learn_with_fun_username';

export default function WelcomeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const scale = useSharedValue(0);
  const float1 = useSharedValue(0);
  const float2 = useSharedValue(0);
  const float3 = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 12 }));
    
    float1.value = withRepeat(
      withSequence(
        withSpring(-15, { damping: 10 }),
        withSpring(0, { damping: 10 })
      ),
      -1,
      false
    );

    float2.value = withRepeat(
      withSequence(
        withSpring(-10, { damping: 8 }),
        withSpring(0, { damping: 8 })
      ),
      -1,
      false
    );

    float3.value = withRepeat(
      withSequence(
        withSpring(-20, { damping: 12 }),
        withSpring(0, { damping: 12 })
      ),
      -1,
      false
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const float1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: float1.value }],
  }));

  const float2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: float2.value }],
  }));

  const float3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: float3.value }],
  }));

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    
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
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving name:', error);
      setError('Failed to save name. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4', '#56C596']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.decorativeElements}>
          <Animated.View style={[styles.floatingCircle1, float1Style]} />
          <Animated.View style={[styles.floatingCircle2, float2Style]} />
          <Animated.View style={[styles.floatingCircle3, float3Style]} />
        </View>

        <Animated.View style={[styles.content, containerStyle]}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="school" size={64} color="#FF6B6B" />
          </View>

          <ThemedText style={styles.title}>Welcome to</ThemedText>
          <ThemedText style={styles.appName}>Learn With Fun!</ThemedText>
          <ThemedText style={styles.subtitle}>Let's get to know you!</ThemedText>

          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIconBox}>
                <MaterialCommunityIcons name="account" size={24} color="#FF6B6B" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError('');
                }}
                maxLength={20}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={18} color="#F44336" />
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.submitButton, name.trim().length === 0 && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={name.trim().length === 0}
            >
              <ThemedText style={styles.submitButtonText}>Start Learning!</ThemedText>
              <MaterialCommunityIcons name="arrow-right-circle" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.helperTextContainer}>
              <MaterialCommunityIcons name="information" size={16} color="#999" />
              <ThemedText style={styles.helperText}>
                We'll use this to personalize your experience
              </ThemedText>
            </View>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="puzzle" size={24} color="rgba(255, 255, 255, 0.9)" />
              <ThemedText style={styles.featureText}>22 Fun Games</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="trophy-award" size={24} color="rgba(255, 255, 255, 0.9)" />
              <ThemedText style={styles.featureText}>Earn Achievements</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="chart-line" size={24} color="rgba(255, 255, 255, 0.9)" />
              <ThemedText style={styles.featureText}>Track Progress</ThemedText>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: 100,
    right: -30,
  },
  floatingCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: 150,
    left: -20,
  },
  floatingCircle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: 300,
    left: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    zIndex: 1,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 32,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    marginBottom: 12,
    overflow: 'hidden',
  },
  inputIconBox: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: '#333',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FF6B6B',
    paddingVertical: 18,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginTop: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
    elevation: 2,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  helperTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    justifyContent: 'center',
  },
  helperText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 32,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
  },
});
