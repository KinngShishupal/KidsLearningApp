/**
 * AdMob setup for a child-directed app.
 *
 * - Ads only run in development/production builds. Expo Go doesn't include the
 *   native AdMob module, so every helper here quietly does nothing there.
 * - Requests are tagged child-directed, under age of consent, rated G and
 *   non-personalized (Google Play Families / COPPA).
 * - Google Play's Families ad format rules ban more than one ad on a page and
 *   full-screen or rewarded ads that can't be closed after 5 seconds. So:
 *   - one banner per screen (never inside a modal over a screen with a banner);
 *   - interstitials only at natural breaks (leaving a results screen), capped,
 *     and the AdMob interstitial unit is set to image ads only (no video);
 *   - no rewarded ads.
 */
import { Platform } from 'react-native';

type AdsModule = typeof import('react-native-google-mobile-ads');

let ads: AdsModule | null = null;
try {
  // Throws in Expo Go because the native module isn't there.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ads = require('react-native-google-mobile-ads') as AdsModule;
} catch {
  ads = null;
}

/**
 * Your real AdMob ad unit IDs. Leave empty until you have them: debug builds
 * use Google's test ads, and release builds show no ads while these are empty.
 * Also replace the test App IDs in app.json (react-native-google-mobile-ads plugin).
 */
const PRODUCTION_AD_UNITS = {
  banner: Platform.select({ android: 'ca-app-pub-8284285672679424/3665514815', ios: '', default: '' }),
  interstitial: Platform.select({ android: 'ca-app-pub-8284285672679424/8482727226', ios: '', default: '' }),
};

/** Minimum completed games between two interstitials. */
const GAMES_BETWEEN_INTERSTITIALS = 3;
/** Minimum time between two interstitials. */
const MIN_INTERSTITIAL_GAP_MS = 4 * 60 * 1000;

export const adRequestOptions = {
  requestNonPersonalizedAdsOnly: true,
};

export function getAdsModule(): AdsModule | null {
  return ads;
}

function unitId(kind: 'banner' | 'interstitial'): string | null {
  if (!ads) return null;
  if (__DEV__) {
    // Google's test interstitial can be a video; release builds use the image-only unit.
    return kind === 'banner' ? ads.TestIds.ADAPTIVE_BANNER : ads.TestIds.INTERSTITIAL;
  }
  return PRODUCTION_AD_UNITS[kind] || null;
}

export function getBannerUnitId(): string | null {
  return unitId('banner');
}

let initialized = false;

export async function initAds() {
  if (!ads || initialized) return;
  initialized = true;
  try {
    await ads.default().setRequestConfiguration({
      maxAdContentRating: ads.MaxAdContentRating.G,
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
    });
    await ads.default().initialize();
    preloadInterstitial();
  } catch (error) {
    console.log('Ads init failed:', error);
  }
}

type Interstitial = ReturnType<AdsModule['InterstitialAd']['createForAdRequest']>;

let interstitial: Interstitial | null = null;
let interstitialLoaded = false;
let gamesSinceInterstitial = 0;
let lastInterstitialAt = 0;

function preloadInterstitial() {
  const id = unitId('interstitial');
  if (!ads || !id || interstitial) return;

  interstitial = ads.InterstitialAd.createForAdRequest(id, adRequestOptions);
  interstitial.addAdEventListener(ads.AdEventType.LOADED, () => {
    interstitialLoaded = true;
  });
  interstitial.addAdEventListener(ads.AdEventType.CLOSED, () => {
    interstitialLoaded = false;
    interstitial?.load();
  });
  interstitial.addAdEventListener(ads.AdEventType.ERROR, () => {
    interstitialLoaded = false;
    // Try again later instead of hammering the network.
    setTimeout(() => interstitial?.load(), 60 * 1000);
  });
  interstitial.load();
}

/** Call once each time a game round finishes. */
export function recordGameCompleted() {
  gamesSinceInterstitial += 1;
}

/** True when an interstitial is ready and the frequency cap allows one now. */
export function isInterstitialDue(): boolean {
  if (!interstitial || !interstitialLoaded) return false;
  if (gamesSinceInterstitial < GAMES_BETWEEN_INTERSTITIALS) return false;
  return Date.now() - lastInterstitialAt >= MIN_INTERSTITIAL_GAP_MS;
}

/**
 * Shows an interstitial if one is ready and the frequency cap allows it.
 * Only call this when the child is leaving a results screen, after the
 * "Ad break" notice so the ad is clearly announced as an ad.
 */
export function showInterstitialIfDue() {
  if (!interstitial || !isInterstitialDue()) return;

  gamesSinceInterstitial = 0;
  lastInterstitialAt = Date.now();
  interstitialLoaded = false;
  interstitial.show().catch(() => {});
}
