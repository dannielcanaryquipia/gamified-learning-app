# Local Setup

## Prerequisites
- Node 18.x or LTS
- npm 9.x or yarn 1/berry
- Expo CLI (optional) `npm install -g expo-cli`
- Android Studio or Xcode for simulators

## Recommended versions
- Node: 18.x
- Expo SDK: 48+ (pin in package.json)

## Steps
1. Clone repository  
   `git clone git@github.com:your-org/gamified-learning-app.git`
2. Install dependencies  
   `npm install`
3. Start dev server  
   `npm start`
4. Run on simulator  
   - iOS: `npm run ios`
   - Android: `npm run android`

## Environment variables
Create `.env.local` (do not commit) with:


API_URL=https://api.example.com
EXPO_PUBLIC_ANALYTICS=false


## Common scripts
- `npm start` — start Expo dev server
- `npm run ios` — open iOS simulator
- `npm run android` — open Android emulator
- `npm run test` — run unit tests
- `npm run lint` — run linter

## Troubleshooting
- Clear Metro cache: `expo start -c`
- Reinstall node_modules: `rm -rf node_modules && npm install`
