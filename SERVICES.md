(save to services/SERVICES.md)
# Services

**Purpose**  
Describe API contracts, persistence layers, mock data, and service responsibilities.

## Service layers
- **ApiService**: REST client wrapper (fetch/axios) with retry and error handling.
- **AuthService**: signIn, signOut, refreshToken.
- **ContentService**: fetch lesson metadata, download lesson assets, cache content.
- **PersistenceService**: wrapper around AsyncStorage and optional SQLite.
- **AnalyticsService**: event tracking (exposed as no-op in dev).

## API contract examples
**GET /lessons**
Response:
```json
[
  { "lessonId":"lesson-001", "title":"Intro", "xp":50, "contentPath":"content/lesson-001.md" }
]


POST /user/progress
Payload:
json
{ "userId":"u1", "lessonId":"lesson-001", "progress":0.75, "xpEarned":25 }

Mock data
Place mock JSON under services/mocks/ for local dev.

Use MSW or a simple mock server for integration tests.

Sync strategy
Local-first writes to AsyncStorage.

Background sync to remote when online.

Conflict resolution: last-write-wins for simple fields; manual merge for complex content.

Secrets and environment
Use .env for API_URL and feature flags.

Do not commit .env files.


---

### `DEPENDENCIES.md` (save to `docs/DEPENDENCIES.md`)
```markdown
# Dependencies

**Purpose**  
List of key libraries, rationale, and minimal version constraints.

## Core
- **expo** — managed workflow for cross-platform builds
- **react-native** — UI framework
- **expo-router** — file-based routing
- **typescript** — static typing

## UI and animation
- **react-native-reanimated** — performant animations
- **react-native-gesture-handler** — gestures
- **react-native-svg** — vector icons and illustrations
- **react-native-markdown-display** — render lesson Markdown

## State and data
- **zustand** — lightweight state slices
- **@react-native-async-storage/async-storage** — persistence
- **axios** — HTTP client

## Testing and tooling
- **jest**, **@testing-library/react-native**
- **eslint**, **prettier**
- **storybook** — component catalog

## DevOps
- **eas-cli** — Expo Application Services builds
- **msw** — mock service worker for local API mocking

## Why these choices
- Expo for fast iteration and cross-platform parity.
- Reanimated for smooth gamification animations.
- Markdown renderer chosen for content-first authoring workflow.

## Version pinning
- Pin major versions in `package.json` and document upgrade steps here.
