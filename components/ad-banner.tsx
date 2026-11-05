import { useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { adRequestOptions, getAdsModule, getBannerUnitId } from '@/utils/ads';

interface AdBannerProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * A full-width banner ad pinned under a screen's content. It takes no space
 * when ads aren't available (Expo Go, no ad unit configured, or no ad to show).
 *
 * Google Play's Families policy requires ads to be clearly different from the
 * app, so the banner sits in its own plain grey strip with a divider and an
 * "Advertisement" label, styled nothing like the game cards above it.
 */
export function AdBanner({ style }: AdBannerProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const ads = getAdsModule();
  const unitId = getBannerUnitId();

  if (!ads || !unitId || failed) return null;

  const { BannerAd, BannerAdSize } = ads;

  return (
    <View style={[styles.container, !loaded && styles.hidden, style]}>
      <Text style={styles.label} accessibilityRole="text">
        Advertisement
      </Text>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
        requestOptions={adRequestOptions}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#EDEDF0',
    borderTopWidth: 1,
    borderTopColor: '#C9C9D1',
    paddingTop: 4,
    paddingBottom: 6,
  },
  // Kept mounted (so the ad can load) but invisible until there is an ad to label.
  hidden: {
    position: 'absolute',
    opacity: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#5F5F6B',
    marginBottom: 4,
  },
});
