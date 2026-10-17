/**
 * AdMob setup for a child-directed app.
 *
 * - Ads only run in development/production builds. Expo Go doesn't include the
 *   native AdMob module, so every helper here quietly does nothing there.
 * - Requests are tagged child-directed, under age of consent, rated G and
 *   non-personalized (Google Play Families / COPPA).
 * - Interstitials are only offered at natural breaks (after a results screen)
 *   and are capped so kids aren't interrupted often.
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
  rewarded: Platform.select({ android: 'ca-app-pub-8284285672679424/9604237201', ios: '', default: '' }),
};

/** How long to wait for a hint video to load before giving the hint anyway. */
const REWARDED_LOAD_TIMEOUT_MS = 6000;

/** Minimum completed games between two interstitials. */
const GAMES_BETWEEN_INTERSTITIALS = 3;
/** Minimum time between two interstitials. */
const MIN_INTERSTITIAL_GAP_MS = 4 * 60 * 1000;

export const adRequestOptions = {
  requestNonPersonalizedAdsOnly: true,
};

function unitId(kind: 'banner' | 'interstitial' | 'rewarded'): string | null {
  if (!ads) return null;
  if (__DEV__) {
    if (kind === 'banner') return ads.TestIds.ADAPTIVE_BANNER;
    if (kind === 'rewarded') return ads.TestIds.REWARDED;
    return ads.TestIds.INTERSTITIAL;
  }
  return PRODUCTION_AD_UNITS[kind] || null;
}

export function getAdsModule(): AdsModule | null {
  return ads;
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
    preloadRewarded();
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

/**
 * Shows an interstitial if one is ready and the frequency cap allows it.
 * Only call this when the child is leaving a results screen.
 */
export function showInterstitialIfDue() {
  if (!interstitial || !interstitialLoaded) return;
  if (gamesSinceInterstitial < GAMES_BETWEEN_INTERSTITIALS) return;
  if (Date.now() - lastInterstitialAt < MIN_INTERSTITIAL_GAP_MS) return;

  gamesSinceInterstitial = 0;
  lastInterstitialAt = Date.now();
  interstitialLoaded = false;
  interstitial.show().catch(() => {});
}

type Rewarded = ReturnType<AdsModule['RewardedAd']['createForAdRequest']>;

let rewarded: Rewarded | null = null;
let rewardedLoaded = false;
let rewardedLoadWaiters: ((loaded: boolean) => void)[] = [];

function settleRewardedWaiters(loaded: boolean) {
  const waiters = rewardedLoadWaiters;
  rewardedLoadWaiters = [];
  waiters.forEach((resolve) => resolve(loaded));
}

function preloadRewarded() {
  const id = unitId('rewarded');
  if (!ads || !id) return;
  if (!rewarded) {
    rewarded = ads.RewardedAd.createForAdRequest(id, adRequestOptions);
    rewarded.addAdEventListener(ads.RewardedAdEventType.LOADED, () => {
      rewardedLoaded = true;
      settleRewardedWaiters(true);
    });
    rewarded.addAdEventListener(ads.AdEventType.ERROR, () => {
      rewardedLoaded = false;
      settleRewardedWaiters(false);
    });
  }
  if (!rewardedLoaded) rewarded.load();
}

function waitForRewarded(): Promise<boolean> {
  if (rewardedLoaded) return Promise.resolve(true);
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), REWARDED_LOAD_TIMEOUT_MS);
    rewardedLoadWaiters.push((loaded) => {
      clearTimeout(timer);
      resolve(loaded);
    });
    preloadRewarded();
  });
}

export type HintAdResult = 'granted' | 'dismissed';

/**
 * Plays one opt-in rewarded video for a hint.
 * Resolves 'granted' once the video is watched. If ads aren't available
 * (Expo Go, web, no ad unit, or no ad to show) the hint is granted for free;
 * 'dismissed' means the child closed the video early.
 */
export async function showRewardedAdForHint(): Promise<HintAdResult> {
  if (!ads || !unitId('rewarded')) return 'granted';

  const loaded = await waitForRewarded();
  if (!loaded || !rewarded) return 'granted';

  const ad = rewarded;
  const adsModule = ads;
  return new Promise<HintAdResult>((resolve) => {
    let earned = false;
    const unsubscribeEarned = ad.addAdEventListener(adsModule.RewardedAdEventType.EARNED_REWARD, () => {
      earned = true;
    });
    const unsubscribeClosed = ad.addAdEventListener(adsModule.AdEventType.CLOSED, () => {
      unsubscribeEarned();
      unsubscribeClosed();
      rewardedLoaded = false;
      preloadRewarded();
      resolve(earned ? 'granted' : 'dismissed');
    });

    rewardedLoaded = false;
    ad.show().catch(() => {
      unsubscribeEarned();
      unsubscribeClosed();
      preloadRewarded();
      resolve('granted');
    });
  });
}
