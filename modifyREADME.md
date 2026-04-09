# Gamified Learning App

**One-line summary**
A mobile-first gamified learning app built with Expo, React Native, and TypeScript that delivers bite-sized lessons, quizzes, and progressive rewards.

## Quick start
1. Clone the repo  
   `git clone git@github.com:your-org/gamified-learning-app.git`
2. Install dependencies  
   `npm install` or `yarn`
3. Start Metro / Expo  
   `npm start` or `expo start`
4. Run on device / simulator  
   - iOS simulator: `i`  
   - Android emulator: `a`  
   - Physical device: scan the QR code from Expo DevTools

## What this repo contains
- **app/** — Expo Router file routes and screens  
- **components/** — Reusable UI components and stories  
- **hooks/** — Custom hooks (useXP, useLessonProgress, useTheme)  
- **services/** — API clients, persistence, mock data  
- **content/** — Markdown lessons and quizzes  
- **design/** — Design tokens and exported assets  
- **docs/** — Additional documentation (SETUP, DEPENDENCIES, TESTING)

## Goals and scope
- **MVP**: onboarding, lesson player (markdown), short quizzes, XP and level system, basic achievements, offline persistence.
- **Long term**: social leaderboards, adaptive learning, AI-generated lesson drafts, multi-language support.

## Where to start
1. Read `docs/ARCHITECTURE.md` for architecture and folder layout.  
2. Open `content/LESSON_TEMPLATE.md` to author lessons.  
3. Run the app locally and open `app/(dev)/playground` for component testing.

## Contributing
See `docs/CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.

## License
See `LICENSE.md`.
