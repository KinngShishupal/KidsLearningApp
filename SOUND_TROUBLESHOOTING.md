# Sound Troubleshooting Guide

## Issue: Sounds Not Playing

### Quick Checks:

**1. Sound Files Location**
```
✓ Files must be in: assets/sounds/
✓ Exact file names:
  - click.mp3
  - correct.mp3
  - wrong.mp3
  - achievement.mp3
  - celebration.mp3
  - coin.mp3
  - whoosh.mp3
```

**2. File Format**
```
✓ Must be MP3 format
✓ Valid audio files (not corrupted)
✓ Reasonable file size (< 1 MB each)
```

**3. Metro Bundler**
```
After adding files:
npm start -- --reset-cache
```

**4. Device Settings**
```
✓ Volume turned up
✓ NOT on silent/vibrate mode
✓ Media volume (not ringer)
```

## Check Console Logs

The app now logs sound attempts. Look for:

```
"Attempting to play sound: wrong"
"Creating sound from source: wrong"
"Sound created and should be playing: wrong"
"Sound finished playing: wrong"
```

Or errors:
```
"Error playing sound: wrong [error details]"
"Sound source not found for: wrong"
```

## If Files Are Missing:

The app will work without sounds:
- Console will show errors
- Haptic feedback still works
- Games still playable
- No crashes

## Adding Real Sound Files:

### Option 1: Download Free Sounds

**Freesound.org:**
1. Search for "button click"
2. Filter by "CC0" license
3. Download MP3
4. Rename to match our file names

**Recommended Searches:**
- "button click" → click.mp3
- "success chime" → correct.mp3
- "error buzz" → wrong.mp3
- "achievement fanfare" → achievement.mp3
- "celebration" → celebration.mp3
- "coin pickup" → coin.mp3
- "whoosh" → whoosh.mp3

### Option 2: Use Text-to-Speech (Alternative)

Edit `sound-manager.ts` to use device TTS:
```typescript
import * as Speech from 'expo-speech';

// Play voice feedback instead
Speech.speak("Correct!");
Speech.speak("Try again");
```

### Option 3: Disable Sounds

If you want to skip sounds entirely:
```typescript
// In sound-manager.ts
soundManager.setEnabled(false);
```

## Test Individual Sounds

Add this test button temporarily:
```typescript
<TouchableOpacity onPress={() => soundManager.playSound('wrong')}>
  <Text>Test Wrong Sound</Text>
</TouchableOpacity>
```

## Current Implementation

✅ **Sound system integrated**
✅ **Called on correct answers**
✅ **Called on wrong answers**  
✅ **Called on button clicks**
✅ **Volume set to 80%**
✅ **Debug logging enabled**

⏳ **Waiting for actual MP3 files in assets/sounds/**

## Verified Sound Calls

The app calls `soundManager.playSound('wrong')` in:
- Math: Counting Stars (wrong answer)
- Math: Addition Fun (wrong answer)
- Math: Number Matching (wrong answer)
- Science: Animal Sounds (wrong answer)
- Science: Solar System (wrong answer)
- Science: Nature Quiz (wrong answer)
- English: Alphabet Quiz (wrong answer)
- English: Spelling Bee (wrong spelling)
- English: Rhyme Time (wrong rhyme)

## Next Steps

1. **Check dev console** for sound error messages
2. **Add MP3 files** to `assets/sounds/` folder
3. **Restart Metro** with `--reset-cache`
4. **Test on device** (not simulator)
5. **Check device volume** is up

If you see the console logs, the sound system is working - it just needs the actual MP3 files to play!
