# Gamified Learning App

A modern, interactive learning platform that makes education engaging through gamification elements. This mobile application is built with React Native and Expo, offering a seamless cross-platform learning experience.

## 🚀 Features

- **Interactive Learning Modules**: Topic-based lessons with progress tracking
- **Gamification Elements**:
  - Experience points (XP) system
  - Daily streaks to encourage consistent learning
  - Achievement badges
- **Personalized Experience**:
  - User profiles with learning statistics
  - Progress visualization
  - Dark/Light theme support
- **Rich Content**:
  - Markdown support for lesson content
  - Interactive exercises
  - Visual progress indicators

## 🛠 Tech Stack

- **Frontend**: React Native with TypeScript
- **Navigation**: Expo Router & React Navigation
- **State Management**: React Context API
- **Styling**: React Native StyleSheet with responsive design
- **Storage**: AsyncStorage for local data persistence
- **UI Components**: Custom components with animations using Reanimated
- **Icons**: Expo Vector Icons
- **Markdown**: react-native-markdown-display

## 📱 Screens

1. **Home Screen**
   - Progress overview
   - Continue learning section
   - Recommended topics
   - Daily streak counter

2. **Profile Screen**
   - User statistics
   - Achievements
   - Learning history
   - Settings

3. **Topic Screen**
   - List of lessons in a topic
   - Progress indicators
   - Lock/unlock status

4. **Lesson Screen**
   - Interactive lesson content
   - Markdown support
   - Completion tracking
   - Navigation controls

## 🗂 Project Structure

```
gamified-learning-app/
├── app/                           # Main app directory (Expo Router)
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx             # Home screen
│   │   ├── profile.tsx           # Profile screen
│   │   └── _layout.tsx           # Tab layout configuration
│   ├── [topicId]/                # Dynamic topic routes
│   │   └── [lessonId]/           # Dynamic lesson routes
│   │       └── page.tsx          # Lesson screen
│   ├── about.tsx                 # About page
│   ├── settings.tsx              # App settings
│   └── help-support.tsx          # Help & support page
├── assets/                       # Static assets
│   ├── fonts/                    # Custom fonts
│   └── images/                   # App images and icons
├── components/                   # Reusable components
│   ├── Button/                   # Custom button component
│   ├── Card/                     # Card component
│   ├── ProgressBar/              # Progress indicator
│   └── StatusCard/               # Status display card
├── constants/                    # App constants
│   ├── Colors.ts                 # Color scheme
│   ├── layout.ts                 # Layout constants
│   ├── responsive.ts             # Responsive design utils
│   └── strings.ts                # String constants
├── contexts/                     # React contexts
│   ├── AppContext.tsx            # Global app state
│   └── ThemeContext.tsx          # Theme management
├── services/                     # Data services
│   └── mockData.ts               # Mock data and API simulation
└── types/                        # TypeScript type definitions
    └── index.ts                  # App-wide type definitions
```

## 🎨 Theming

The app supports both light and dark themes with a custom theming system using React Context. Theme colors and styles are centralized in `constants/Colors.ts` and managed through the `ThemeContext`.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator or physical device

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/gamified-learning-app.git
   cd gamified-learning-app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

4. Run on iOS/Android
   ```bash
   # For iOS
   npm run ios
   # or
   yarn ios

   # For Android
   npm run android
   # or
   yarn android
   ```

## 📱 Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Navigation](https://reactnavigation.org/) for navigation
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for smooth animations
- All the open-source libraries that made this project possible
