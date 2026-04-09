# Architecture

## Purpose
This document describes the app architecture, folder structure, routing conventions, state strategy, persistence, and an MVP plan with milestones and acceptance criteria.

## High level stack
- **Framework**: Expo (managed) with **expo-router**
- **Language**: TypeScript
- **UI**: React Native + Tailored design system
- **State**: React Context + Zustand for local state slices
- **Persistence**: AsyncStorage for offline progress; optional SQLite for larger content
- **Content**: Markdown lessons stored in `content/` with frontmatter
- **Animations**: Reanimated + Gesture Handler
- **Testing**: Jest + React Native Testing Library; Detox or Playwright for E2E
- **CI/CD**: GitHub Actions → Expo Application Services (EAS) for builds

## Folder layout
/
├─ app/                    # Expo Router screens and layout
│  ├─ _layout.tsx
│  ├─ index.tsx
│  ├─ lessons/[id].tsx
│  └─ (dev)/playground.tsx
├─ assets/
├─ components/             # Reusable components
├─ hooks/                  # Custom hooks
├─ services/               # API, persistence, mocks
├─ content/                # Markdown lessons and quizzes
├─ design/                 # Tokens, icons, exported assets
├─ docs/                   # Markdown docs (this file)
├─ tests/
├─ package.json
└─ tsconfig.json


## Routing and layout conventions
- Use **file-based routing** under `app/`.  
- Screens:
  - `/` — Home / Dashboard
  - `/lessons/[id]` — Lesson player (renders Markdown)
  - `/profile` — User profile, XP, achievements
  - `/store` — In-app cosmetic store (MVP: cosmetic only)
- Shared layout `_layout.tsx` provides header, bottom nav, and global providers.

## State strategy
- **Global context**: `AppContext` for auth, user profile, XP, streaks.  
- **Local slices**: Zustand for ephemeral UI state (modals, toasts).  
- **Hooks**: `useXP`, `useLessonProgress`, `useAuth`, `useTheme`.

## Data model (MVP)
- **User**
  - `id`, `displayName`, `avatar`, `level`, `xp`, `streak`, `achievements[]`
- **Lesson**
  - `lessonId`, `title`, `topicId`, `xp`, `estimatedMinutes`, `contentPath`, `locked`
- **Quiz**
  - `quizId`, `lessonId`, `questions[]`, `passingScore`, `xpReward`
- **Achievement**
  - `id`, `title`, `description`, `criteria`, `xpReward`

## Persistence and sync
- **Local**: AsyncStorage for user progress and cached lessons.  
- **Remote**: Minimal REST API (or Firebase) for user sync, leaderboards, and content updates.  
- **Sync strategy**: optimistic local-first writes, background sync when online.

## Security and secrets
- Keep API keys out of repo; use environment variables and EAS secrets. See `docs/SECURITY.md`.

## MVP plan and acceptance criteria
**MVP Scope**
1. Onboarding and account creation (local-only or email auth)
2. Lesson player rendering Markdown with images and code blocks
3. Short quizzes with scoring and XP reward
4. XP, level progression, and simple achievements
5. Offline persistence of progress

**Acceptance criteria**
- User completes a lesson and receives XP; XP persists across app restarts.
- Quiz scoring is accurate and awards XP when passing.
- Lessons render images and basic interactive elements (multiple choice).
- App runs on iOS and Android simulators.

## Roadmap next steps
- Phase 1: MVP features above (4 weeks)
- Phase 2: Leaderboards, social sharing, cosmetic store (6 weeks)
- Phase 3: AI-assisted lesson generation and adaptive learning (ongoing)

## Notes for engineers
- Keep components small and stateless where possible.
- Use design tokens from `design/` for consistent spacing and colors.
- Author lessons as Markdown files with frontmatter; use `content/LESSON_TEMPLATE.md`.
