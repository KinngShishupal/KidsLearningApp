import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';

const USER_NAME_KEY = '@learn_with_fun_username';

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserName();
  }, []);

  const checkUserName = async () => {
    try {
      const savedName = await AsyncStorage.getItem(USER_NAME_KEY);
      
      setTimeout(() => {
        if (savedName) {
          router.replace('/(tabs)');
        } else {
          router.replace('/welcome');
        }
      }, 500);
    } catch (error) {
      console.error('Error checking username:', error);
      router.replace('/welcome');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.loadingText}>Learn With Fun</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
});
