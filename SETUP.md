# Setup Guide for Learn With Fun

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- For iOS: Mac with Xcode
- For Android: Android Studio

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This will install:
- React Native and Expo
- Navigation libraries
- Animation libraries (Reanimated)
- Haptics for touch feedback
- SVG library for drawing
- All other required dependencies

### 2. Start the Development Server
```bash
npm start
```

This will open the Expo Dev Tools in your browser.

### 3. Run on Device/Emulator

#### iOS (Mac only)
```bash
npm run ios
```
Or scan the QR code with the Expo Go app on your iPhone.

#### Android
```bash
npm run android
```
Or scan the QR code with the Expo Go app on your Android device.

#### Web
```bash
npm run web
```

## Troubleshooting

### Issue: Dependencies not installing
**Solution**: Try clearing the npm cache:
```bash
npm cache clean --force
npm install
```

### Issue: Metro bundler errors
**Solution**: Reset the Metro cache:
```bash
npm start -- --reset-cache
```

### Issue: Native modules not found
**Solution**: For SVG or other native modules:
```bash
npx expo install react-native-svg
```

### Issue: iOS build fails
**Solution**: Navigate to iOS folder and install pods:
```bash
cd ios
pod install
cd ..
npm run ios
```

## Development Tips

### Hot Reload
- Shake your device to open the developer menu
- Enable "Fast Refresh" for instant updates

### Testing
- Test on both phones and tablets
- Check landscape and portrait orientations
- Test with different font sizes (accessibility)

### Customization
- Colors are defined in each screen's StyleSheet
- Game content can be easily modified in the game arrays
- Add new games by following the existing game patterns

## Building for Production

### Android APK
```bash
eas build --platform android
```

### iOS IPA
```bash
eas build --platform ios
```

Note: You'll need an Expo account and EAS CLI configured.

## Support
For issues or questions:
1. Check the Expo documentation: https://docs.expo.dev
2. Visit React Native docs: https://reactnative.dev
3. Check the project README.md

Happy Learning!
