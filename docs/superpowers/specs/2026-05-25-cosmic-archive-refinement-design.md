# Cosmic Archive: Full Refinement Spec

**Date:** 2026-05-25
**Approach:** Surgical Refactor (Bottom-up: Bugs → Data Layer → UI)

---

## Phase 1: Bug Fixes & Stabilization

### 1a. Mutable Shared State in `mockData.ts`
**File:** `services/mockData.ts`
- `fetchTopics()` returns deep clones of `mockTopics` via `structuredClone()` or `JSON.parse(JSON.stringify())`
- `completeLesson()` and `completeTest()` operate on cloned data, return new objects without mutating module-level state
- Remove `mockUserProgress.streak++` from `completeLesson()` — streak is managed separately by `AppContext.updateStreak()`

### 1b. Stale Closure in `AppContext.tsx`
**File:** `contexts/AppContext.tsx`
- Refactor `loadStoredData()` to **return** parsed values instead of calling `setUserProgress`/`setUserProfile` directly
- `loadData()` uses returned values for merge logic:
  ```
  const stored = await loadStoredData();
  if (stored.progress) setUserProgress(stored.progress);
  else setUserProgress(serverProgress);
  ```
- Eliminates the stale closure where `!userProgress` always evaluates to `true` on first render

### 1c. Hardcoded Badge Count
**File:** `app/(tabs)/profile.tsx` line 178
- Replace hardcoded `2/12` with dynamic achievement stats from `evaluateAchievements()` or Zustand store
- Compute `unlockedCount` and `totalCount` from achievement evaluation

### 1d. Non-existent `/credentials` Route
**File:** `app/(tabs)/profile.tsx` line 46
- Remove "Archivist Credentials" menu item from the `actions` array (route doesn't exist)

### 1e. QuizEngine Ignores `passingScore`
**File:** `components/Quiz/QuizEngine.tsx` line 64
- Add `passingScore` prop to `QuizEngineProps` (default: `0.7`)
- Use prop instead of hardcoded `0.7` in results calculation
- Pass `quiz.passingScore` from `LessonContent.tsx` when rendering `<QuizEngine>`

### 1f. Duplicate `useFonts` Calls
**File:** `app/_layout.tsx` lines 31-46
- Merge two `useFonts` calls into one with all fonts combined

### 1g. Dead Code Removal
Remove the following unused components:
- `components/ButtonPrimary/` (index.tsx + styles.ts)
- `components/StatusCard/StatusCard.tsx`
- `components/StreakCard/StreakCard.tsx`
- `components/XPBar/` (index.tsx + styles.ts)
- `components/FloatingTabBarContainer/FloatingTabBarContainer.tsx`
- `components/EditScreenInfo.tsx`
- `tests/generated/ButtonPrimary.test.tsx`
- `tests/generated/XPBar.test.tsx`

Keep `components/Button/Button.tsx` as the canonical button component.

---

## Phase 2: Data Layer (SQLite + Zustand)

### 2a. SQLite Schema
**New file:** `services/database.ts`
**Dependency:** `expo-sqlite`

```sql
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  difficulty TEXT,
  is_locked INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  duration INTEGER,
  xp INTEGER,
  order_num INTEGER,
  quiz_json TEXT
);

CREATE TABLE IF NOT EXISTS user_progress (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total_xp INTEGER DEFAULT 0,
  topics_completed INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  quizzes_passed INTEGER DEFAULT 0,
  perfect_quizzes INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS completed_lessons (
  lesson_id TEXT PRIMARY KEY REFERENCES lessons(id),
  completed_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS streak_data (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date TEXT
);

CREATE TABLE IF NOT EXISTS unlocked_achievements (
  achievement_id TEXT PRIMARY KEY,
  unlocked_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT DEFAULT 'Explorer',
  email TEXT,
  avatar_uri TEXT,
  bio TEXT,
  theme TEXT DEFAULT 'system',
  notifications INTEGER DEFAULT 1,
  haptics_enabled INTEGER DEFAULT 1,
  sound_enabled INTEGER DEFAULT 0
);
```

### 2b. Database Service Functions
**File:** `services/database.ts`

- `initializeDatabase(db)` — creates tables, seeds topics/lessons from `mockData.ts` content constants on first launch
- `getTopicsWithProgress(db)` — returns topics with computed `completedLessons` via join with `completed_lessons`
- `getLesson(db, lessonId)` — returns lesson with content and quiz data
- `completeLessonInDb(db, lessonId, topicId)` — inserts into `completed_lessons`, updates `user_progress` counters
- `recordQuizResult(db, lessonId, score, totalQuestions, xp)` — updates `quizzes_passed`, `perfect_quizzes`, adds XP
- `getStreakDataFromDb(db)` / `updateStreakInDb(db)` — proper date-based streak logic
- `getProfileFromDb(db)` / `updateProfileInDb(db, updates)` — profile CRUD
- `getUnlockedAchievements(db)` / `unlockAchievement(db, id)` — achievement persistence
- `resetAllProgress(db)` — for "Clear Progress" action

`mockData.ts` remains as a **content source only** — the lesson markdown, quiz questions, and topic metadata. The database service reads from it during seeding.

### 2c. Zustand Store
**New file:** `stores/appStore.ts`
**Dependency:** `zustand`

```ts
interface AppState {
  // Data
  topics: Topic[];
  userProgress: UserProgress | null;
  userProfile: UserProfile | null;
  streakData: StreakData | null;
  achievements: Achievement[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  refreshData: () => Promise<void>;
  markLessonComplete: (topicId: string, lessonId: string) => Promise<void>;
  recordQuizResult: (topicId: string, lessonId: string, score: number, total: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  evaluateAchievements: () => Promise<void>;
  resetProgress: () => Promise<void>;
  clearError: () => void;
}
```

### 2d. Migration Strategy
- `AppContext.tsx` replaced by Zustand store provider
- `useApp()` hook replaced by `useAppStore()` across all screens (or kept as a thin wrapper for minimal diff)
- All screens switch from `fetchTopics()` / `fetchUserProgress()` to store selectors
- AsyncStorage keys (`@GamifiedLearning:*`) are no longer used — SQLite is the single source of truth
- `@react-native-async-storage/async-storage` removed from dependencies

---

## Phase 3: UI Refinements

### 3a. Consolidate Button Components
- Remove `ButtonPrimary/` (done in Phase 1g)
- Enhance `Button/Button.tsx` with a `variant="gradient"` option using `LinearGradient`
- Update screens to use `<Button>` instead of ad-hoc `TouchableOpacity` + `LinearGradient` patterns:
  - `LessonContent.tsx` — "Commit Knowledge" button
  - `QuizEngine.tsx` — "Next Evaluation", "Retry", "Close Transmission" buttons
  - `StreakRestoreModal.tsx` — "Continue Mission" button

### 3b. Design Token Alignment
- Replace all hardcoded `borderColor: 'rgba(255,255,255,0.03)'` and similar with `colors.outlineVariant`
  - `achievements.tsx`, `missions.tsx`, `leaderboard.tsx`, `profile.tsx`, `TopicCard.tsx`, `StreakRestoreModal.tsx`
- Replace legacy color names with canonical names:
  - `colors.text` → `colors.onSurface`
  - `colors.border` → `colors.outlineVariant`
  - `colors.card` → `colors.surfaceContainerLow`
  - `colors.accent` → `colors.tertiary`
- After all screens migrated, remove legacy aliases from `getThemeColors()`

### 3c. `+html.tsx` Dark Background Fix
- Change dark mode background from `#000` to `#040a2f`

### 3d. Error States
- Create reusable `ErrorState` component (icon + message + retry button)
- Add error state to: Home, Quizzes, Missions, Achievements, Topic Detail, Lesson Detail
- Wire from Zustand store's `error` field

### 3e. Pull-to-Refresh
- Add `RefreshControl` to: Quizzes, Missions, Leaderboard, Profile screens
- Wire to `useAppStore().refreshData()`

### 3f. Settings Toggles
- Wire "Haptic Feedback" and "Sound Effects" switches to Zustand store (persisted in SQLite `user_profile`)
- Wire "Notifications" toggle
- Add `onPress` to "Clear Progress" — confirmation alert → `resetProgress()`
- Add `onPress` to "Deactivate Session" — confirmation alert

### 3g. Memoize Leaderboard
- Wrap `generateLeaderboard()` in `useMemo` with `[userXP, userName, userStreak]` dependencies

### 3h. Micro-interactions
- Install `expo-haptics`
- Add haptic feedback to quiz option selection (`Haptics.selectionAsync()`)
- Add haptic feedback to "Commit Knowledge" button (`Haptics.notificationAsync()`)
- Add subtle scale animation on achievement unlock using `moti`

---

## Files Modified (Summary)

### New Files
- `services/database.ts` — SQLite schema, migrations, CRUD operations
- `stores/appStore.ts` — Zustand store with all slices
- `components/ErrorState/ErrorState.tsx` — Reusable error display

### Modified Files
- `services/mockData.ts` — Remove mutation, make content-only
- `contexts/AppContext.tsx` — Removed entirely; Zustand store replaces all its functionality. A `useApp()` wrapper hook is created in `stores/appStore.ts` for backwards compatibility during migration.
- `app/_layout.tsx` — Merge font loads, add DB initialization
- `app/(tabs)/index.tsx` — Use store, add error state
- `app/(tabs)/quizzes.tsx` — Use store, add error state, pull-to-refresh
- `app/(tabs)/missions.tsx` — Use store, pull-to-refresh
- `app/(tabs)/leaderboard.tsx` — Use store, memoize, pull-to-refresh
- `app/(tabs)/profile.tsx` — Use store, fix badge count, remove dead route, pull-to-refresh
- `app/[topicId]/page.tsx` — Use store, add error state
- `app/[topicId]/[lessonId]/page.tsx` — Use store, add error state
- `app/achievements.tsx` — Use store, add error state
- `app/settings.tsx` — Wire toggles to store, add handlers
- `app/+html.tsx` — Fix dark background
- `components/Quiz/QuizEngine.tsx` — Add passingScore prop, haptics
- `components/LessonContent/LessonContent.tsx` — Pass passingScore, use Button
- `components/TopicCard/TopicCard.tsx` — Design token borders
- `components/StreakRestoreModal/StreakRestoreModal.tsx` — Design token borders, use Button
- `components/Button/Button.tsx` — Add gradient variant
- `contexts/ThemeContext.tsx` — Remove legacy aliases (Phase 3b, last step)

### Removed Files
- `components/ButtonPrimary/` (index.tsx + styles.ts)
- `components/StatusCard/StatusCard.tsx`
- `components/StreakCard/StreakCard.tsx`
- `components/XPBar/` (index.tsx + styles.ts)
- `components/FloatingTabBarContainer/FloatingTabBarContainer.tsx`
- `components/EditScreenInfo.tsx`
- `tests/generated/ButtonPrimary.test.tsx`
- `tests/generated/XPBar.test.tsx`

### New Dependencies
- `expo-sqlite`
- `zustand`
- `expo-haptics`

### Removed Dependencies
- `@react-native-async-storage/async-storage`

---

## Acceptance Criteria

1. App launches without errors after fresh install
2. Lesson completion persists across app restarts (SQLite)
3. Quiz scores and XP persist across app restarts
4. Streak data persists and updates correctly per day
5. Profile edits (name, avatar) persist
6. Achievement unlocks persist
7. Badge count on profile screen is dynamic and accurate
8. Settings toggles function and persist
9. "Clear Progress" resets all data
10. All screens show error states on data fetch failure
11. All data screens support pull-to-refresh
12. No hardcoded border colors — all use design tokens
13. No legacy color aliases in active use
14. No dead code components remain
15. QuizEngine respects `passingScore` from data
16. TypeScript compiles with zero errors
