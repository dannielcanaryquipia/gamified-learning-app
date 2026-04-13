# Cosmic Archive: Refinement Analysis & Roadmap

This document identifies the remaining gaps between the current implementation and the "real" project vision defined in your Stitch designs and internal documentation (`ARCHITECURE.md`, `LESSON_TEMPLATE.md`).

## 1. Core Architectural Refinements 🏗️
Currently, the app uses static mock data for speed. For a production-ready "Content-First" experience, we need to implement:

- [ add this ] **Dynamic Content Loader**: Create a service that parses the lessons in `content/` (`dns-basics.md`, `networking-intro.md`, etc.).
  - *Requirement*: Use a frontmatter parser to extract metadata like `xp`, `estimatedMinutes`, and `quiz` data directly from the Markdown files.
- [help me how to setup the sqlite, then how to use it and how to setup/config the data since i am in mockdata.ts only. i am thinking for future reference the architecture of services and data fetching of the topics/lessons/quizzes and rendering it to a reusable components etc. ] **Persistence Layer**: Transition from in-memory state to `AsyncStorage` or `SQLite`.
  - *Risk*: Current user progress (XP, streaks, lesson completion) clears on app refresh. 
- [add this state management ] **Zustand Store Migration**: Offload ephemeral UI state (modals, store selections) from `AppContext` to dedicated Zustand slices as per the `ARCHITECURE.md`.

## 2. Unimplemented "Premium" Features 💎
Based on the roadmap, the following core features are currently placeholders or routes without content:

- [using this modern style will add a gamified vibe to the app ] **In-App Cosmic Store (`/store`)**:
  - *Visuals*: Immersive 3D grid or glassmorphic cards for "Aura Rewards" and "Streak Freezes."
  - *Logic*: Implement a currency system (using XP or separate "Stardust") to purchase cosmetic upgrades.
- [ implement this] **Aura Rewards System**:
  - *Visuals*: Visual particles or glow effects on the user avatar based on rank.
- [soon to be implemented. let us focus first for the layer architecture, data fetching, rendering, services, and the reusable components and hooks ] **AI Adaptive Learning (Phase 3)**:
  - *Vision*: Integration point for dynamic difficulty adjustment in quizzes based on user performance.

## 3. Design System & Content Parity 🎨
The "Cosmic Archive" design requires absolute consistency. We should:

- [ use this synchroization for global callout and not hardcoded for good architecture and traceable callout ] **Token Synchronization**: Sync `design/design-tokens.json` directly into our `ThemeContext`.
  - *Current State*: Some colors and spacing are hardcoded based on the "intent" rather than the machine-readable tokens.
- [add this since sooner or later i will add the uploading of image,files like docx and pdf and also videos when i will want to add a backend and database and will be fetch soon online. for now, i want to know about sql lite and its setup/config ] **Markdown Media Support**: The current `LessonContent` handles text and code, but needs premium support for:
  - *High-Fidelity Assets*: Rendering SVGs/PNGs from the `assets/content/` directory.
  - *Interactive Checks*: Implementing the `[ ]` micro-challenges mentioned in `LESSON_TEMPLATE.md`.

## 4. Stability & QA 🛡️
- [use edge case handling for better interaction ] **Edge Case Handling**: Empty states for Leaderboards and Missions if the user is offline or data fails to fetch.
- [ interactive haptics can add season and vibe to interactive learning, we may also add public audios from dependencies if ever we may have to add flavor to the test and quizzes and also we will add settings for this that can be seen in the settings page in the proofile.] **Vibration & Haptics**: Add `expo-haptics` to the "Commit Knowledge" button and Quiz options for a premium mobile feel.

---

### Proposed Next Phase: "The Data Bridge"
1. **Implement `services/contentService.ts`** to replace `mockData.ts`.
2. **Build the `app/store.tsx` screen** using the "Artifact Vault" aesthetic.
3. **Hook up `AsyncStorage`** to the `AppContext` for persistence.

 would you like me to start with the **Content Loader** or the **Cosmic Store**? - start with what we discuss
