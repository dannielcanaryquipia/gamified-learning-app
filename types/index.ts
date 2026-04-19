export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  content: string;
  isCompleted: boolean;
  xp: number;
  order: number;
  quiz?: Quiz;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  totalLessons: number;
  completedLessons: number;
  xp: number;
  category: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  isLocked: boolean;
  lastAccessed?: Date;
  lessons: Lesson[];
  totalXp: number; // Total XP for completing all lessons
  currentXp: number; // Current XP earned
}

export interface UserProgress {
  totalXP: number;
  streak: number;
  topicsCompleted: number;
  totalTopics: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  perfectQuizzes: number;
  totalLessons: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinDate: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Artifact';
  unlocked: boolean;
  date?: string;
  condition: string; // human readable condition description
}
