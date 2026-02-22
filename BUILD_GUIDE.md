# Build Guide - Learn With Fun

## Prerequisites

### Install EAS CLI
```bash
npm install -g eas-cli
```

### Login to Expo
```bash
eas login
```

### Configure Project
```bash
eas build:configure
```

## Build Commands

### 🤖 Android Builds

#### Development APK (for testing)
```bash
npm run build:android:apk
```
- Creates APK file
- Can be installed directly on devices
- Good for testing and sharing with testers
- Smaller file size

#### Production App Bundle (for Play Store)
```bash
npm run build:android:aab
```
- Creates Android App Bundle (AAB format)
- Required for Google Play Store
- Optimized for distribution
- Auto-increments version
- Note: EAS uses "app-bundle" buildType internally

#### Local Android Build
```bash
npm run build:local:android
```
- Builds on your machine
- Requires Android Studio
- No cloud build time
- Full control

### 🍎 iOS Builds

#### iOS Build (for App Store)
```bash
npm run build:ios
```
- Creates IPA file
- For App Store submission
- Requires Apple Developer account
- Cloud build

#### iOS Simulator Build
```bash
npm run build:ios:simulator
```
- Build for iOS Simulator
- Quick testing on Mac
- No device needed
- Preview build type

#### Local iOS Build
```bash
npm run build:local:ios
```
- Builds on your machine
- Requires Xcode (Mac only)
- No cloud build time
- Full control

### 🌍 All Platforms
```bash
npm run build:all
```
- Builds both Android and iOS
- Runs in parallel
- Saves time for multi-platform

### 🔧 Development Build
```bash
npm run build:dev
```
- Creates development client
- For testing with Expo Go features
- Hot reload support
- Debugging enabled

## Submission Commands

### Submit to Play Store
```bash
npm run submit:android
```
- Submits AAB to Google Play
- Requires Play Console setup
- Automated submission

### Submit to App Store
```bash
npm run submit:ios
```
- Submits IPA to App Store Connect
- Requires Apple Developer account
- Automated submission

## Over-The-Air Updates

### Publish Update
```bash
npm run update
```
- Push updates without new build
- Changes app code instantly
- No app store approval needed
- Only for JavaScript/assets changes

## Prebuild Commands

### Generate Native Projects
```bash
npm run prebuild
```
- Creates android/ and ios/ folders
- For custom native modules
- Advanced use case

### Clean Prebuild
```bash
npm run prebuild:clean
```
- Removes and regenerates native folders
- Clean slate for native code
- Use when troubleshooting

## Build Profiles (eas.json)

### Development Profile
- Development client enabled
- Internal distribution
- iOS simulator support
- For testing new features

### Preview Profile
- Internal distribution
- Android: APK format (easy install)
- iOS: Simulator build
- For beta testing

### Production Profile
- App store ready
- Auto version increment
- Android: AAB format (Play Store)
- iOS: IPA format (App Store)
- Optimized builds

## Step-by-Step Build Process

### First Time Setup
```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Login to your Expo account
eas login

# 3. Configure your project
eas build:configure
```

### Create Android APK (Testing)
```bash
# Build APK for testing
npm run build:android:apk

# Wait for build to complete (5-15 minutes)
# Download APK from link provided
# Install on Android device
```

### Create Production Build
```bash
# 1. Update version in app.json
# 2. Build for production
npm run build:android:aab  # For Android
npm run build:ios          # For iOS

# 3. Wait for builds to complete
# 4. Download build files
# 5. Submit to stores
npm run submit:android     # Google Play
npm run submit:ios         # App Store
```

## Build Times

- **Cloud Builds**: 5-20 minutes (depending on queue)
- **Local Builds**: 3-10 minutes (depending on machine)
- **Preview APK**: Usually faster (~5-10 min)
- **Production AAB/IPA**: Longer (~10-20 min)

## Build Outputs

### Android
- **APK**: ~50-100 MB (installable file)
- **AAB**: ~30-60 MB (Play Store bundle)

### iOS
- **IPA**: ~50-100 MB (App Store file)
- **Simulator Build**: ~100-150 MB

## Troubleshooting

### Build Fails
```bash
# Check EAS CLI version
eas --version

# Update EAS CLI
npm install -g eas-cli@latest

# Clear cache and retry
eas build --platform android --clear-cache
```

### Version Issues
- Update version in `app.json`
- Use semantic versioning (1.0.0, 1.0.1, etc.)
- Auto-increment enabled in production profile

### Certificate Issues (iOS)
```bash
# Generate new credentials
eas credentials

# Or let EAS manage automatically
# Choose "Yes" when asked during build
```

## Cost

### EAS Build Plans
- **Free**: 30 builds/month (Android & iOS combined)
- **Production**: Unlimited builds ($29/mo)
- **Enterprise**: Advanced features

### Alternative: Local Builds
- Free (unlimited)
- Requires local setup (Android Studio/Xcode)
- Uses your machine resources

## Best Practices

1. **Test with Preview builds first**
   - Build APK for Android testing
   - Build for iOS simulator
   - Verify all features work

2. **Use version control**
   - Commit before building
   - Tag releases in git
   - Track build numbers

3. **Increment versions**
   - Auto-increment enabled for production
   - Follow semantic versioning
   - Update in app.json

4. **Test thoroughly**
   - Test on real devices
   - Test all features
   - Check performance
   - Verify all games work

## Quick Reference

```bash
# Development Testing
npm run build:android:apk        # Android APK for testing
npm run build:ios:simulator      # iOS for simulator testing

# Production Release
npm run build:android:aab        # Google Play Store
npm run build:ios                # Apple App Store

# Submit to Stores
npm run submit:android           # After Android build
npm run submit:ios               # After iOS build

# Over-the-Air Updates
npm run update                   # Push updates without rebuild
```

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Play Store Guidelines](https://play.google.com/console/about/guides/releasewithnewapis/)

## Support

For build issues:
1. Check Expo status page
2. Review build logs in EAS dashboard
3. Check Expo forums
4. Review error messages carefully

Happy building! 🚀
