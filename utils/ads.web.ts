/**
 * Web build: AdMob is native-only, so ads are disabled here.
 * Mirrors the API of ads.ts.
 */
type AdsModule = typeof import('react-native-google-mobile-ads');

export const adRequestOptions = {
  requestNonPersonalizedAdsOnly: true,
};

export function getAdsModule(): AdsModule | null {
  return null;
}

export function getBannerUnitId(): string | null {
  return null;
}

export async function initAds() {}

export function recordGameCompleted() {}

export function showInterstitialIfDue() {}

export type HintAdResult = 'granted' | 'dismissed';

export async function showRewardedAdForHint(): Promise<HintAdResult> {
  return 'granted';
}
