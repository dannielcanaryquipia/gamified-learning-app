### Hooks
**Purpose**
Document custom hooks, their contracts, side effects, and usage patterns.

#### Conventions
* Hook files: hooks/useSomething.ts
* Keep hooks focused and composable
* Document return shape and side effects

#### Core hooks
##### useAuth
**Purpose**: Manage auth state and token refresh.
**API**:
* user: User | null
* signIn(credentials): Promise<void>
* signOut(): Promise<void>

##### useXP
**Purpose**: Read and mutate XP, compute level thresholds.
**API**:
* xp: number
* level: number
* addXP(amount: number, reason?: string): Promise<void>
* onLevelUp: (callback) => unsubscribe

##### useLessonProgress
**Purpose**: Track progress per lesson and persist locally.
**API**:
* progress: { lessonId: string; percent: number }
* markComplete(lessonId)
* saveCheckpoint(lessonId, cursor)

##### useTheme
**Purpose**: Provide theme tokens and reduced-motion preference.
**API**:
* theme
* toggleTheme()
* reducedMotion: boolean

#### Testing hooks
* Use renderHook from React Testing Library for unit tests.
* Mock AsyncStorage and network calls for persistence hooks.
