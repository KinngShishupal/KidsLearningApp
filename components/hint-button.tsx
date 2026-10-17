import { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { showRewardedAdForHint } from '@/utils/ads';
import { soundManager } from '@/utils/sound-manager';

interface HintButtonProps {
  /** The hint for the current question was already given. */
  used: boolean;
  /** Turn the button off, e.g. once the question is answered. */
  disabled?: boolean;
  /** What the hint will do, shown in the "watch a video?" prompt. */
  description?: string;
  /** Stop the question timer while the prompt or video is on screen. */
  onPause?: () => void;
  /** Restart the question timer afterwards. */
  onResume?: () => void;
  /** Apply the hint (called after the video was watched). */
  onReveal: () => void;
}

type Step = 'closed' | 'confirm' | 'loading' | 'dismissed';

/**
 * "💡 Hint" pill shown above a question. Tapping it asks the child whether to
 * watch one short video; the hint is only applied after the video is watched.
 */
export function HintButton({
  used,
  disabled = false,
  description = 'Two wrong answers will disappear!',
  onPause,
  onResume,
  onReveal,
}: HintButtonProps) {
  const [step, setStep] = useState<Step>('closed');
  const isOff = used || disabled;

  const openPrompt = () => {
    if (isOff) return;
    soundManager.playSound('click');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPause?.();
    setStep('confirm');
  };

  const close = () => {
    setStep('closed');
    onResume?.();
  };

  const watchVideo = async () => {
    setStep('loading');
    const result = await showRewardedAdForHint();
    if (result === 'granted') {
      setStep('closed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onReveal();
      onResume?.();
    } else {
      setStep('dismissed');
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={openPrompt} disabled={isOff} activeOpacity={0.85}>
        <LinearGradient
          colors={isOff ? ['#E4E4EC', '#D6D6E2'] : ['#FFE27A', '#FFC93C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pill}
        >
          <MaterialCommunityIcons
            name={used ? 'check-circle' : 'lightbulb-on'}
            size={20}
            color={isOff ? '#9A9AB0' : '#8A5A00'}
          />
          <ThemedText style={[styles.pillText, isOff && styles.pillTextOff]}>
            {used ? 'Hint used' : 'Hint'}
          </ThemedText>
          {!isOff && (
            <View style={styles.videoBadge}>
              <MaterialCommunityIcons name="play" size={12} color="#FFFFFF" />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={step !== 'closed'} transparent animationType="fade" onRequestClose={close}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.bulbCircle}>
              <MaterialCommunityIcons name="lightbulb-on" size={40} color="#F5B700" />
            </View>

            {step === 'loading' ? (
              <>
                <ThemedText style={styles.title}>Getting your hint…</ThemedText>
                <ActivityIndicator size="large" color="#7C6CF2" style={styles.spinner} />
              </>
            ) : (
              <>
                <ThemedText style={styles.title}>
                  {step === 'dismissed' ? 'Almost there!' : 'Need a little help?'}
                </ThemedText>
                <ThemedText style={styles.body}>
                  {step === 'dismissed'
                    ? 'Watch the whole video to get your hint.'
                    : `Watch a short video to get a hint. ${description}`}
                </ThemedText>

                <TouchableOpacity onPress={watchVideo} activeOpacity={0.85} style={styles.primaryTouch}>
                  <LinearGradient
                    colors={['#8E7CFF', '#6C5CE7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryButton}
                  >
                    <MaterialCommunityIcons name="play-circle" size={22} color="#FFFFFF" />
                    <ThemedText style={styles.primaryText}>
                      {step === 'dismissed' ? 'Try again' : 'Watch video'}
                    </ThemedText>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={close} style={styles.secondaryButton}>
                  <ThemedText style={styles.secondaryText}>No thanks</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  pillText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8A5A00',
  },
  pillTextOff: {
    color: '#9A9AB0',
  },
  videoBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E8890C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 12, 50, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  bulbCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF4D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    color: '#3D3A5C',
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6F6D8A',
    textAlign: 'center',
    marginTop: 8,
  },
  spinner: {
    marginVertical: 20,
  },
  primaryTouch: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
  },
  primaryText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B8AA3',
  },
});
