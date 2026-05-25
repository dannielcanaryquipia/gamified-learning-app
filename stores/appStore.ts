import { create } from 'zustand';
import { Platform } from 'react-native';
import { Topic, UserProfile, UserProgress, Achievement } from '../types';
import { mockTopics, fetchTopics, fetchUserProgress, fetchUserProfile } from '../services/mockData';
import { ACHIEVEMENT_RULES, EvaluationState } from '../services/achievementEngine';

// SQLite is only available on native — imported lazily to avoid SharedArrayBuffer error on web
let dbModule: typeof import('../services/database') | null = null;

function isNative(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

async function getDbModule() {
  if (!dbModule) {
    dbModule = await import('../services/database');
  }
  return dbModule;
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

interface AppSettings {
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  notifications: boolean;
}

interface AppState {
  // Data
  topics: Topic[];
  userProgress: UserProgress | null;
  userProfile: UserProfile | null;
  streakData: StreakData | null;
  achievements: Achievement[];
  settings: AppSettings;

  // UI state
  isLoading: boolean;
  error: string | null;
  _db: any | null;
  _isNative: boolean;

  // Actions
  initialize: () => Promise<void>;
  refreshData: () => Promise<void>;
  markLessonComplete: (topicId: string, lessonId: string) => Promise<void>;
  recordQuizResult: (topicId: string, lessonId: string, score: number, total: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  evaluateAchievements: () => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetProgress: () => Promise<void>;
  clearError: () => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function computeUserProgress(topics: Topic[], streak: StreakData, extra: { quizzesPassed: number; perfectQuizzes: number }): UserProgress {
  const completedLessons = topics.reduce((sum, t) => sum + t.completedLessons, 0);
  const totalLessons = topics.reduce((sum, t) => sum + t.totalLessons, 0);
  const totalXP = topics.reduce((sum, t) => sum + t.currentXp, 0);
  const topicsCompleted = topics.filter(t => t.completedLessons === t.totalLessons && t.totalLessons > 0).length;

  return {
    totalXP,
    streak: streak.currentStreak,
    topicsCompleted,
    totalTopics: topics.length,
    lessonsCompleted: completedLessons,
    totalLessons,
    quizzesPassed: extra.quizzesPassed,
    perfectQuizzes: extra.perfectQuizzes,
  };
}

function defaultStreak(): StreakData {
  return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
}

function updateStreakLogic(current: StreakData): StreakData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (!current.lastActiveDate) {
    return { currentStreak: 1, longestStreak: 1, lastActiveDate: todayStr };
  }
  if (current.lastActiveDate === todayStr) {
    return current;
  }
  if (current.lastActiveDate === yesterdayStr) {
    const newStreak = current.currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, current.longestStreak),
      lastActiveDate: todayStr,
    };
  }
  return { currentStreak: 1, longestStreak: current.longestStreak, lastActiveDate: todayStr };
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  topics: [],
  userProgress: null,
  userProfile: null,
  streakData: null,
  achievements: [],
  settings: { hapticsEnabled: true, soundEnabled: false, notifications: true },
  isLoading: true,
  error: null,
  _db: null,
  _isNative: isNative(),

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });

      if (isNative()) {
        // ── Native: SQLite ──────────────────────────────────────────────
        const dbMod = await getDbModule();
        const db = dbMod.openDatabase();
        dbMod.initializeDatabase(db);
        dbMod.seedContentData(db, mockTopics as any);

        const topics = dbMod.getTopicsWithProgress(db);
        const profile = dbMod.getProfileFromDb(db);
        const streak = dbMod.getStreakDataFromDb(db);
        const settings = dbMod.getSettingsFromDb(db);
        const achievements = dbMod.getAchievementsFromDb(db);
        const updatedStreak = dbMod.updateStreakInDb(db);

        const quizzesPassed = db.getFirstSync<{ count: number }>(
          'SELECT quizzes_passed as count FROM user_progress WHERE id = 1'
        )?.count || 0;
        const perfectQuizzes = db.getFirstSync<{ count: number }>(
          'SELECT perfect_quizzes as count FROM user_progress WHERE id = 1'
        )?.count || 0;

        set({
          _db: db,
          topics,
          userProfile: profile,
          streakData: updatedStreak,
          achievements,
          settings,
          userProgress: computeUserProgress(topics, updatedStreak, { quizzesPassed, perfectQuizzes }),
          isLoading: false,
        });
      } else {
        // ── Web: In-memory mock data ────────────────────────────────────
        const topics = await fetchTopics();
        const profile = await fetchUserProfile();
        const streak = updateStreakLogic(defaultStreak());
        const achievements = ACHIEVEMENT_RULES.map(rule => ({
          id: rule.id,
          title: rule.title,
          description: rule.description,
          icon: rule.icon,
          rarity: rule.rarity,
          condition: rule.condition,
          unlocked: false,
        }));

        set({
          topics,
          userProfile: profile,
          streakData: streak,
          achievements,
          userProgress: computeUserProgress(topics, streak, { quizzesPassed: 0, perfectQuizzes: 0 }),
          isLoading: false,
        });
      }
    } catch (e: any) {
      console.error('Failed to initialize app:', e);
      set({ error: e.message || 'Failed to initialize', isLoading: false });
    }
  },

  refreshData: async () => {
    const { _db, _isNative } = get();

    try {
      if (_isNative && _db) {
        const dbMod = await getDbModule();
        const topics = dbMod.getTopicsWithProgress(_db);
        const profile = dbMod.getProfileFromDb(_db);
        const streak = dbMod.getStreakDataFromDb(_db);
        const achievements = dbMod.getAchievementsFromDb(_db);
        const settings = dbMod.getSettingsFromDb(_db);

        const quizzesPassed = (_db as any).getFirstSync(
          'SELECT quizzes_passed as count FROM user_progress WHERE id = 1'
        )?.count || 0;
        const perfectQuizzes = (_db as any).getFirstSync(
          'SELECT perfect_quizzes as count FROM user_progress WHERE id = 1'
        )?.count || 0;

        set({
          topics,
          userProfile: profile,
          streakData: streak,
          achievements,
          settings,
          userProgress: computeUserProgress(topics, streak, { quizzesPassed, perfectQuizzes }),
        });
      } else {
        // Web: re-fetch mock data
        const topics = await fetchTopics();
        const { streakData } = get();
        set({
          topics,
          userProgress: computeUserProgress(topics, streakData || defaultStreak(), { quizzesPassed: 0, perfectQuizzes: 0 }),
        });
      }
    } catch (e: any) {
      console.error('Failed to refresh data:', e);
      set({ error: e.message || 'Failed to refresh' });
    }
  },

  markLessonComplete: async (topicId: string, lessonId: string) => {
    const { _db, _isNative, topics } = get();

    try {
      if (_isNative && _db) {
        const dbMod = await getDbModule();
        const topic = topics.find(t => t.id === topicId);
        const lesson = topic?.lessons.find(l => l.id === lessonId);
        if (!lesson || !topic) return;

        dbMod.completeLessonInDb(_db, lessonId, topicId, lesson.xp);
      } else {
        // Web: mutate topics in-memory (clone-based)
        const updatedTopics = topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            lessons: t.lessons.map(l => {
              if (l.id !== lessonId || l.isCompleted) return l;
              return { ...l, isCompleted: true };
            }),
            completedLessons: t.lessons.filter(l => l.id === lessonId || l.isCompleted).length,
            currentXp: t.lessons.reduce((sum, l) => sum + ((l.id === lessonId || l.isCompleted) ? l.xp : 0), 0),
          };
        });
        set({ topics: updatedTopics });
      }

      await get().refreshData();
      await get().evaluateAchievements();
    } catch (e: any) {
      console.error('Failed to complete lesson:', e);
      set({ error: e.message || 'Failed to complete lesson' });
    }
  },

  recordQuizResult: async (topicId: string, lessonId: string, score: number, total: number) => {
    const { _db, _isNative, topics } = get();

    try {
      if (_isNative && _db) {
        const dbMod = await getDbModule();
        const topic = topics.find(t => t.id === topicId);
        const lesson = topic?.lessons.find(l => l.id === lessonId);
        if (!lesson) return;

        dbMod.recordQuizResult(_db, score, total, lesson.xp, lesson.quiz?.passingScore);
      }
      // Web: no-op for now (quiz results don't persist without SQLite)

      await get().refreshData();
      await get().evaluateAchievements();
    } catch (e: any) {
      console.error('Failed to record quiz result:', e);
      set({ error: e.message || 'Failed to record quiz result' });
    }
  },

  updateStreak: async () => {
    const { _db, _isNative, streakData } = get();

    try {
      if (_isNative && _db) {
        const dbMod = await getDbModule();
        const updated = dbMod.updateStreakInDb(_db);
        set({ streakData: updated });
      } else {
        const updated = updateStreakLogic(streakData || defaultStreak());
        set({ streakData: updated });
      }
    } catch (e: any) {
      console.error('Failed to update streak:', e);
    }
  },

  updateUserProfile: async (updates: Partial<UserProfile>) => {
    const { _db, _isNative, userProfile } = get();

    try {
      if (_isNative && _db) {
        const dbMod = await getDbModule();
        dbMod.updateProfileInDb(_db, updates);
        const profile = dbMod.getProfileFromDb(_db);
        set({ userProfile: profile });
      } else {
        set({ userProfile: { ...userProfile, ...updates } as UserProfile });
      }
    } catch (e: any) {
      console.error('Failed to update profile:', e);
      set({ error: e.message || 'Failed to update profile' });
    }
  },

  evaluateAchievements: async () => {
    const { _db, _isNative, userProgress, streakData, topics, achievements } = get();
    if (!userProgress) return;

    try {
      const evalState: EvaluationState = {
        progress: userProgress,
        streakCurrent: streakData?.currentStreak || 0,
        streakLongest: streakData?.longestStreak || 0,
        topicsData: topics.map(t => ({
          id: t.id,
          completedLessons: t.completedLessons,
          totalLessons: t.totalLessons,
        })),
      };

      if (_isNative && _db) {
        const dbMod = await getDbModule();
        const previouslyUnlocked = new Set(dbMod.getUnlockedAchievements(_db));

        for (const rule of ACHIEVEMENT_RULES) {
          if (rule.evaluate(evalState) && !previouslyUnlocked.has(rule.id)) {
            dbMod.unlockAchievement(_db, rule.id);
          }
        }

        set({ achievements: dbMod.getAchievementsFromDb(_db) });
      } else {
        // Web: evaluate in-memory
        const updated = achievements.map(a => {
          const rule = ACHIEVEMENT_RULES.find(r => r.id === a.id);
          if (!rule) return a;
          return { ...a, unlocked: a.unlocked || rule.evaluate(evalState) };
        });
        set({ achievements: updated });
      }
    } catch (e: any) {
      console.error('Failed to evaluate achievements:', e);
    }
  },

  updateSettings: (updates: Partial<AppSettings>) => {
    const { _db, _isNative, settings } = get();
    const merged = { ...settings, ...updates };
    set({ settings: merged });

    if (_isNative && _db) {
      getDbModule().then(mod => mod.updateSettingsInDb(_db, merged));
    }
  },

  resetProgress: async () => {
    const { _db, _isNative } = get();

    try {
      if (_isNative && _db) {
        const dbMod = await getDbModule();
        dbMod.resetAllProgress(_db);
      }
      // Reset in-memory state on both platforms
      set({
        topics: [],
        userProgress: null,
        streakData: defaultStreak(),
        achievements: ACHIEVEMENT_RULES.map(rule => ({
          id: rule.id,
          title: rule.title,
          description: rule.description,
          icon: rule.icon,
          rarity: rule.rarity,
          condition: rule.condition,
          unlocked: false,
        })),
      });
      await get().refreshData();
    } catch (e: any) {
      console.error('Failed to reset progress:', e);
      set({ error: e.message || 'Failed to reset progress' });
    }
  },

  clearError: () => set({ error: null }),
}));

// ─── Compatibility Hook ────────────────────────────────────────────────────

export const useApp = () => {
  const store = useAppStore();
  return {
    isLoading: store.isLoading,
    topics: store.topics,
    userProgress: store.userProgress,
    userProfile: store.userProfile,
    streakData: store.streakData,
    achievements: store.achievements,
    refreshData: store.refreshData,
    markLessonComplete: store.markLessonComplete,
    updateUserProfile: store.updateUserProfile,
    updateStreak: store.updateStreak,
    evaluateAchievements: store.evaluateAchievements,
    settings: store.settings,
    updateSettings: store.updateSettings,
    resetProgress: store.resetProgress,
    error: store.error,
    clearError: store.clearError,
  };
};
