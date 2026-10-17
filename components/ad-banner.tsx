import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { adRequestOptions, getAdsModule, getBannerUnitId } from '@/utils/ads';

interface AdBannerProps {
  /** 'anchored' fills the width (screen bottoms); 'compact' is a fixed 320x50 (inside cards). */
  variant?: 'anchored' | 'compact';
  style?: StyleProp<ViewStyle>;
}

/**
 * A banner ad that takes no space when ads aren't available (Expo Go, no ad
 * unit configured, or no ad to show).
 */
export function AdBanner({ variant = 'anchored', style }: AdBannerProps) {
  const [failed, setFailed] = useState(false);
  const ads = getAdsModule();
  const unitId = getBannerUnitId();

  if (!ads || !unitId || failed) return null;

  const { BannerAd, BannerAdSize } = ads;

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={unitId}
        size={variant === 'compact' ? BannerAdSize.BANNER : BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
        requestOptions={adRequestOptions}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
