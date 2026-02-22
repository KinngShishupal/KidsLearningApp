# Header Design System - Learn With Fun

## Unified Header Design Across All Screens

All headers now follow a consistent, modern design pattern with beautiful gradients, icons, and decorative elements.

## Header Types

### 1. Home Screen Header
**Gradient:** Red → Teal → Green (multi-color)
**Icon:** School (🏫) in white circle
**Title:** "Learn With Fun!" (38px)
**Subtitle:** "Choose a subject to start"

### 2. Math Section Header
**Gradient:** Red → Orange (#FF6B6B → #FF8E53)
**Icon:** Calculator in white circle
**Title:** "Math Games" (32px)
**Subtitle:** "Choose a game to play"

### 3. Science Section Header
**Gradient:** Teal → Green (#4ECDC4 → #44A08D)
**Icon:** Flask in white circle
**Title:** "Science Adventures" (32px)
**Subtitle:** "Explore and discover"

### 4. English Section Header
**Gradient:** Green gradient (#56C596 → #3AA76D)
**Icon:** Book-Alphabet in white circle
**Title:** "English Fun" (32px)
**Subtitle:** "Learn words and letters"

### 5. Progress Screen Header
**Gradient:** Gold/Yellow (#FFD93D → #FFC107)
**Icon:** Trophy-Award in white circle (90px)
**Title:** "Your Progress" (36px)
**Subtitle:** "Keep up the great work!"

### 6. Game Playing Header (Top Bar)
**Gradient:** Matches subject color
**Left:** Back arrow button with icon
**Center:** Current game title
**Right:** Trophy icon + score

## Design Elements

### 🎯 Icon Circle
- **Size:** 80-90px diameter
- **Background:** White with elevation
- **Icon:** Subject-specific, colored to match theme
- **Shadow:** Elevation 6-8 for floating effect
- **Position:** Centered at top

### 📝 Typography
- **Main Title:** 32-38px, bold, white with text shadow
- **Subtitle:** 16-17px, semi-transparent white
- **Text Shadow:** Subtle shadow for depth (0, 2px, 4px blur)

### 🎨 Decorative Elements
- **Two circles:** Small (60-80px) and large (100-130px)
- **Semi-transparent white:** 8-12% opacity
- **Positioned:** Top-right corner
- **Overflow hidden:** Partial visibility for effect

### 🔘 Back Button
- **Icon + Text:** Home or Arrow icon with label
- **Background:** Semi-transparent white (20% opacity)
- **Rounded:** 16px border radius
- **Padding:** 8px vertical, 12px horizontal
- **Gap:** 6px between icon and text

### 🏆 Score Display
- **Icon + Number:** Trophy icon with score
- **Background:** Semi-transparent white (25% opacity)
- **Border:** 2px white with 30% opacity
- **Rounded:** 16px border radius
- **Gap:** 6px between icon and number

## Visual Hierarchy

### Game Selection Header (Full Height)
1. Decorative circles (background)
2. White circular icon (focal point)
3. Title text (main message)
4. Subtitle text (context)
5. Back button (top-left, small)

### Game Playing Header (Compact)
1. Left: Back button
2. Center: Game name
3. Right: Score with trophy

## Consistent Styling

### All Headers Include:
✅ Gradient backgrounds matching subject colors
✅ White circular icons with subject-specific symbols
✅ Bold white titles with text shadows
✅ Subtitles for context
✅ Decorative background circles
✅ Professional elevation and shadows
✅ Responsive padding (60px top for status bar)

### Color Themes:
- **Math:** Red to Orange (warm)
- **Science:** Teal to Green (cool/natural)
- **English:** Green gradient (growth)
- **Progress:** Gold/Yellow (achievement)
- **Home:** Multi-color gradient (welcoming)

## Benefits

### User Experience:
- Clear navigation with home buttons
- Always know where you are (game name in header)
- See your score at a glance
- Beautiful, professional appearance
- Consistent across all screens

### Visual Design:
- Modern gradient backgrounds
- Depth through elevation and shadows
- Decorative elements add polish
- Icon system provides visual anchors
- Text shadows improve readability

### Kid-Friendly:
- Large, clear text
- Colorful and engaging
- Icons help with recognition
- Consistent patterns easy to learn
- Trophy makes score exciting

## Technical Implementation

- Uses `LinearGradient` from expo-linear-gradient
- Material Community Icons for all symbols
- Consistent spacing and padding
- Elevation for iOS/Android compatibility
- Text shadows for depth
- Responsive to screen sizes

All headers are now beautifully designed, consistent, and professional!
