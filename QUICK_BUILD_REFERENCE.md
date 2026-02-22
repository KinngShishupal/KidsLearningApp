# Quick Build Reference

## 🚀 Most Common Build Commands

### For Testing (APK)
```bash
npm run build:android:apk
```
**Use when:** Testing on Android devices, sharing with testers
**Output:** APK file you can install directly
**Time:** ~5-10 minutes

### For Google Play Store
```bash
npm run build:android:aab
```
**Use when:** Publishing to Play Store
**Output:** Android App Bundle (AAB)
**Time:** ~10-15 minutes

### For Apple App Store
```bash
npm run build:ios
```
**Use when:** Publishing to App Store
**Output:** IPA file
**Time:** ~10-20 minutes
**Requires:** Apple Developer account

## 📦 Build Types

| Command | Platform | Output | Use Case |
|---------|----------|--------|----------|
| `build:android:apk` | Android | APK | Testing, Beta |
| `build:android:aab` | Android | AAB | Play Store |
| `build:ios` | iOS | IPA | App Store |
| `build:ios:simulator` | iOS | App | Simulator Testing |
| `build:all` | Both | APK/IPA | Multi-platform |
| `build:dev` | Both | Dev Client | Development |

## 🎯 Quick Start (First Time)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Create your first build
npm run build:android:apk
```

## 📤 Submitting to Stores

### Android (Google Play)
```bash
# 1. Build AAB
npm run build:android:aab

# 2. Submit to Play Store
npm run submit:android
```

### iOS (App Store)
```bash
# 1. Build IPA
npm run build:ios

# 2. Submit to App Store
npm run submit:ios
```

## ⚡ Over-The-Air Updates

```bash
npm run update
```
**Use when:** Minor bug fixes, content updates
**Benefit:** No app store review needed
**Limitation:** JavaScript/assets only (not native code)

## 🏠 Local Builds (Free, Unlimited)

```bash
# Android (requires Android Studio)
npm run build:local:android

# iOS (requires Xcode on Mac)
npm run build:local:ios
```

## 💡 Pro Tips

1. **Always test with APK first** before building AAB for store
2. **Use preview builds** to test on real devices
3. **Update version** in app.json before production builds
4. **Test all features** before submitting to stores
5. **Keep builds organized** - download and save build files

## 🆘 Quick Troubleshoats

### Build Failed?
```bash
eas build --platform android --clear-cache
```

### Need to Update?
```bash
npm install -g eas-cli@latest
```

### Check Build Status
```bash
eas build:list
```

## 📱 Testing Your Build

### Android APK
1. Download APK from EAS dashboard
2. Transfer to Android device
3. Enable "Install from Unknown Sources"
4. Install and test

### iOS (TestFlight)
1. Build completes on EAS
2. Submit to TestFlight
3. Invite beta testers
4. They download via TestFlight app

## ⏱️ Typical Build Times

- **Android APK (Preview)**: 5-10 minutes
- **Android AAB (Production)**: 10-15 minutes
- **iOS (Production)**: 10-20 minutes
- **Local Builds**: 3-10 minutes (depends on machine)

## 📋 Pre-Build Checklist

- [ ] Update version in `app.json`
- [ ] Test all games and features
- [ ] Check for linter errors (`npm run lint`)
- [ ] Update screenshots if UI changed
- [ ] Review privacy policy if needed
- [ ] Test on multiple devices/screen sizes
- [ ] Verify all assets are included
- [ ] Check app icons and splash screen

## 🎉 Ready to Build!

Start with a test APK:
```bash
npm run build:android:apk
```

Check out [BUILD_GUIDE.md](./BUILD_GUIDE.md) for detailed instructions!
