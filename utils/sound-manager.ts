import { Audio } from 'expo-av';

class SoundManager {
  private sounds: { [key: string]: Audio.Sound | null } = {};
  private isEnabled: boolean = true;

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  async playSound(soundType: 'click' | 'correct' | 'wrong' | 'achievement' | 'celebration' | 'coin' | 'whoosh') {
    if (!this.isEnabled) {
      console.log('Sound disabled');
      return;
    }

    try {
      console.log('Attempting to play sound:', soundType);
      const source = this.getSoundSource(soundType);
      if (!source) {
        console.log('Sound source not found for:', soundType);
        return;
      }

      console.log('Creating sound from source:', soundType);
      const { sound } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: true, volume: 0.8 },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            console.log('Sound finished playing:', soundType);
            sound.unloadAsync();
          }
        }
      );
      console.log('Sound created and should be playing:', soundType);
    } catch (error) {
      console.error('Error playing sound:', soundType, error);
    }
  }

  private getSoundSource(soundType: string) {
    try {
      switch (soundType) {
        case 'click':
          return require('../assets/sounds/click.mp3');
        case 'correct':
          return require('../assets/sounds/correct.mp3');
        case 'wrong':
          return require('../assets/sounds/wrong.mp3');
        case 'achievement':
          return require('../assets/sounds/achievement.mp3');
        case 'celebration':
          return require('../assets/sounds/celebration.mp3');
        case 'coin':
          return require('../assets/sounds/coin.mp3');
        case 'whoosh':
          return require('../assets/sounds/whoosh.mp3');
        default:
          return require('../assets/sounds/click.mp3');
      }
    } catch (error) {
      console.error('Error loading sound source:', error);
      return null;
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  async cleanup() {
    try {
      for (const key in this.sounds) {
        if (this.sounds[key]) {
          await this.sounds[key]?.unloadAsync();
          this.sounds[key] = null;
        }
      }
    } catch (error) {
      console.error('Error cleaning up sounds:', error);
    }
  }
}

export const soundManager = new SoundManager();

// Simple sound player that can be used without files
export const playSimpleSound = async (type: 'click' | 'success' | 'error') => {
  try {
    // This is a simplified version that doesn't require sound files
    // The actual haptic feedback is already implemented, so this is optional
    console.log(`Would play ${type} sound here`);
  } catch (error) {
    console.log('Sound playback skipped:', error);
  }
};

// Export for easy use
export const playClick = () => playSimpleSound('click');
export const playSuccess = () => playSimpleSound('success');
export const playError = () => playSimpleSound('error');
