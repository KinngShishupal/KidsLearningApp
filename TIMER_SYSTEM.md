# Timer System - Learn With Fun

## Comprehensive Timer Implementation

Every question in the app now has a countdown timer based on difficulty level, making the learning experience more exciting and challenging!

## Timer Configuration by Difficulty

### ⏱️ Time Limits

**Easy Games (15 seconds)**
- Math: Counting Stars
- Math: Addition Fun
- Science: Animal Sounds

**Medium Games (12 seconds)**
- Math: Number Matching
- Science: Solar System (Planets)

**Hard/Challenge Games (10 seconds)**
- Math: Speed Math
- Science: Nature Quiz (multi-select)
- Science: Science Challenge
- English: Vocabulary Quiz

## Timer Features

### 🎯 Visual Components

**Timer Badge**
- Clock icon with seconds remaining
- White badge with elevation
- Position: Top-right of screen
- Shows: "Xs" (e.g., "15s", "10s", "3s")

**Progress Bar**
- 10px animated bar below timer
- Smoothly decreases as time runs out
- Full width of screen
- Color matches subject theme

**Color Changes (Warning System)**
- **Normal Time**: Subject color (Red/Teal/Green)
  - Clock-outline icon
  - Calm appearance
- **Low Time (≤3 seconds)**: Red (#F44336)
  - Clock-alert icon
  - Urgent appearance
  - Creates sense of urgency

### ⚡ Timer Behavior

**Countdown**
- Starts immediately when question appears
- Decrements every second
- Shows real-time progress

**Timer Stops When:**
- Player answers (correct or incorrect)
- Time runs out (game ends)
- Question completes
- Player leaves game

**Timer Resets When:**
- Moving to next question
- Starting new game
- Clicking "Play Again"

**Timeout Behavior:**
- Game ends immediately
- Shows results modal
- Counts as incomplete

### 🎮 Game-Specific Implementation

**Math - Counting (Easy - 15s)**
- Count objects on screen
- Select from 4 options
- Timer pauses after answer

**Math - Addition (Easy - 15s)**
- Solve addition problem
- 4 number options
- Fresh 15s per question

**Math - Matching (Medium - 12s)**
- Match number to word
- 4 word options
- 12s per question

**Science - Animals (Easy - 15s)**
- 4 animal sound questions
- Multiple choice answers
- 15s to think and answer

**Science - Planets (Medium - 12s)**
- 3 planet questions
- Visual planet selection
- 12s per question

**Science - Nature (Hard - 10s)**
- Multi-select questions (2-3 correct answers)
- Must select ALL before time runs out
- 10s per question
- Most challenging!

**Speed Quizzes (10s)**
- Already have built-in timers
- 5 questions each
- Beat the clock format

## Visual Design

### QuestionTimer Component
```
┌─────────────────────────┐
│   [Clock] 15s    Badge  │  ← Timer Badge
├─────────────────────────┤
│ ████████████░░░░        │  ← Progress Bar
└─────────────────────────┘
```

**Styling:**
- Clean, minimal design
- Doesn't distract from question
- Clear at a glance
- Responsive animations

**Placement:**
- Below question header
- Above question card
- Consistent across all games

## Educational Benefits

### Cognitive Development
- **Decision-making** under time pressure
- **Quick recall** of learned information
- **Focus and concentration**
- **Time management** skills

### Game Balance
- Easy games (15s): More time to think and count
- Medium games (12s): Moderate challenge
- Hard games (10s): Quick thinking required
- Progressive difficulty

### Motivation
- Urgency creates excitement
- Red warning adds drama
- Completing before timeout feels rewarding
- Timer removal after answer reduces pressure

## Technical Implementation

### State Management
- Individual timer state per game type
- `timerActive` flag controls countdown
- Separate timers don't interfere
- Clean reset on game restart

### Performance
- Smooth 1-second intervals
- Animated progress bar (1000ms)
- No performance impact
- Efficient re-renders

### Edge Cases Handled
- ✅ Timer stops on answer
- ✅ Timer resets on new question
- ✅ Timer clears on game exit
- ✅ Timeout shows results modal
- ✅ Multiple timers don't conflict

## User Experience

### Clear Feedback
- Always know how much time is left
- Visual progress bar shows depletion
- Warning at 3 seconds
- No surprises - timer is always visible

### Fair Challenge
- Time limits are generous for age group
- Easy questions get more time
- Hard questions require quick thinking
- Can still complete without rushing

### Stress Management
- Timer pauses after answering
- No time pressure during feedback
- Kids can celebrate or learn from mistakes
- Results screen has no timer

## Summary

The timer system adds excitement and challenge to every question while remaining age-appropriate and educational. Different time limits based on difficulty ensure fair gameplay, and the visual warning system helps kids manage their time effectively!

**Total Timed Games:** 8+ games with timers
**Timer Range:** 10-15 seconds based on difficulty
**Visual Feedback:** Progress bar + clock badge + color warnings
