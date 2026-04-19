import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, UserProgress } from '../types';

const ACHIEVEMENTS_STORAGE_KEY = '@GamifiedLearning:achievements';

interface AchievementRule {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: Achievement['rarity'];
  condition: string;
  evaluate: (state: EvaluationState) => boolean;
}

export interface EvaluationState {
  progress: UserProgress;
  streakCurrent: number;
  streakLongest: number;
  topicsData: { id: string; completedLessons: number; totalLessons: number }[];
}

// ─── Achievement Rules ─────────────────────────────────────────────────────────
const ACHIEVEMENT_RULES: AchievementRule[] = [
  {
    id: 'first-transmission',
    title: 'First Transmission',
    description: 'Complete your initial learning module.',
    icon: 'wifi-tethering',
    rarity: 'Common',
    condition: 'Complete 1 lesson',
    evaluate: (s) => s.progress.lessonsCompleted >= 1,
  },
  {
    id: 'data-archivist',
    title: 'Data Archivist',
    description: 'Archive 5 lessons across all sectors.',
    icon: 'inventory',
    rarity: 'Rare',
    condition: 'Complete 5 lessons',
    evaluate: (s) => s.progress.lessonsCompleted >= 5,
  },
  {
    id: 'sync-master',
    title: 'Sync Master',
    description: 'Maintain a 7-day synchronization streak.',
    icon: 'bolt',
    rarity: 'Epic',
    condition: '7-day streak',
    evaluate: (s) => s.streakCurrent >= 7,
  },
  {
    id: 'cosmic-scholar',
    title: 'Cosmic Scholar',
    description: 'Achieve 100% proficiency in any topic.',
    icon: 'auto-awesome',
    rarity: 'Legendary',
    condition: 'Complete all lessons in a topic',
    evaluate: (s) => s.topicsData.some(t => t.completedLessons === t.totalLessons && t.totalLessons > 0),
  },
  {
    id: 'neural-overlay',
    title: 'Neural Overlay',
    description: 'Complete all available topics.',
    icon: 'psychology',
    rarity: 'Artifact',
    condition: 'Complete all topics',
    evaluate: (s) => s.progress.topicsCompleted === s.progress.totalTopics && s.progress.totalTopics > 0,
  },
  {
    id: 'quiz-ace',
    title: 'Quiz Ace',
    description: 'Pass your first knowledge evaluation.',
    icon: 'verified',
    rarity: 'Common',
    condition: 'Pass 1 quiz',
    evaluate: (s) => s.progress.quizzesPassed >= 1,
  },
  {
    id: 'perfect-sync',
    title: 'Perfect Sync',
    description: 'Score 100% on a knowledge evaluation.',
    icon: 'star',
    rarity: 'Rare',
    condition: 'Perfect quiz score',
    evaluate: (s) => s.progress.perfectQuizzes >= 1,
  },
  {
    id: 'security-sentinel',
    title: 'Security Sentinel',
    description: 'Complete all Networking modules.',
    icon: 'security',
    rarity: 'Rare',
    condition: 'Complete networking topic',
    evaluate: (s) => {
      const networking = s.topicsData.find(t => t.id === 'networking-basics');
      return networking ? networking.completedLessons === networking.totalLessons && networking.totalLessons > 0 : false;
    },
  },
  {
    id: 'global-node',
    title: 'Global Node',
    description: 'Accumulate 500 total XP.',
    icon: 'public',
    rarity: 'Epic',
    condition: 'Earn 500 XP',
    evaluate: (s) => s.progress.totalXP >= 500,
  },
  {
    id: 'streak-ignition',
    title: 'Streak Ignition',
    description: 'Start a 3-day learning streak.',
    icon: 'whatshot',
    rarity: 'Common',
    condition: '3-day streak',
    evaluate: (s) => s.streakCurrent >= 3,
  },
  {
    id: 'half-archive',
    title: 'Half Archive',
    description: 'Complete half of all available lessons.',
    icon: 'hourglass-bottom',
    rarity: 'Epic',
    condition: 'Complete 50% of lessons',
    evaluate: (s) => s.progress.lessonsCompleted >= Math.ceil(s.progress.totalLessons / 2),
  },
  {
    id: 'xp-master',
    title: 'XP Master',
    description: 'Accumulate 1000 total XP.',
    icon: 'military-tech',
    rarity: 'Legendary',
    condition: 'Earn 1000 XP',
    evaluate: (s) => s.progress.totalXP >= 1000,
  },
];

// ─── Engine Functions ───────────────────────────────────────────────────────────

/** Load unlocked achievement IDs from storage */
export const loadUnlockedAchievements = async (): Promise<Set<string>> => {
  try {
    const stored = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (stored) {
      const ids: string[] = JSON.parse(stored);
      return new Set(ids);
    }
  } catch (error) {
    console.error('Error loading achievements:', error);
  }
  return new Set();
};

/** Save unlocked achievement IDs to storage */
const saveUnlockedAchievements = async (ids: Set<string>): Promise<void> => {
  try {
    await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify([...ids]));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
};

/** Evaluate all rules against current state. Returns the full achievement list with unlock status + newly unlocked IDs */
export const evaluateAchievements = async (
  state: EvaluationState
): Promise<{ achievements: Achievement[]; newlyUnlocked: string[] }> => {
  const previouslyUnlocked = await loadUnlockedAchievements();
  const newlyUnlocked: string[] = [];
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

  const achievements: Achievement[] = ACHIEVEMENT_RULES.map(rule => {
    const wasUnlocked = previouslyUnlocked.has(rule.id);
    const isNowUnlocked = rule.evaluate(state);

    if (isNowUnlocked && !wasUnlocked) {
      newlyUnlocked.push(rule.id);
      previouslyUnlocked.add(rule.id);
    }

    return {
      id: rule.id,
      title: rule.title,
      description: rule.description,
      icon: rule.icon,
      rarity: rule.rarity,
      unlocked: wasUnlocked || isNowUnlocked,
      date: (wasUnlocked || isNowUnlocked) ? today : undefined,
      condition: rule.condition,
    };
  });

  // Persist any new unlocks
  if (newlyUnlocked.length > 0) {
    await saveUnlockedAchievements(previouslyUnlocked);
  }

  return { achievements, newlyUnlocked };
};

/** Get the total count */
export const getAchievementStats = (achievements: Achievement[]) => {
  const total = achievements.length;
  const unlocked = achievements.filter(a => a.unlocked).length;
  const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;
  return { total, unlocked, percentage };
};
