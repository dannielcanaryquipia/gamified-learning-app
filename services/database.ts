import * as SQLite from 'expo-sqlite';
import { Topic, Lesson, UserProfile, UserProgress, Achievement } from '../types';
import { ACHIEVEMENT_RULES } from './achievementEngine';

// ─── Database Initialization ───────────────────────────────────────────────

export function openDatabase(): SQLite.SQLiteDatabase {
  return SQLite.openDatabaseSync('cosmic-archive.db');
}

export function initializeDatabase(db: SQLite.SQLiteDatabase): void {
  db.execSync(`
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
      topic_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT,
      duration INTEGER,
      xp INTEGER,
      order_num INTEGER,
      quiz_json TEXT,
      FOREIGN KEY (topic_id) REFERENCES topics(id)
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
      lesson_id TEXT PRIMARY KEY,
      completed_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (lesson_id) REFERENCES lessons(id)
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
  `);

  // Initialize single-row tables if they don't exist
  db.runSync(`INSERT OR IGNORE INTO user_progress (id, total_xp, topics_completed, lessons_completed, quizzes_passed, perfect_quizzes) VALUES (1, 0, 0, 0, 0, 0)`);
  db.runSync(`INSERT OR IGNORE INTO streak_data (id, current_streak, longest_streak, last_active_date) VALUES (1, 0, 0, NULL)`);
  db.runSync(`INSERT OR IGNORE INTO user_profile (id, name) VALUES (1, 'Explorer')`);
}

// ─── Seeding ───────────────────────────────────────────────────────────────

interface SeedTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  difficulty: string;
  isLocked: boolean;
  lessons: {
    id: string;
    title: string;
    description: string;
    content: string;
    duration: number;
    xp: number;
    order: number;
    quiz?: any;
  }[];
}

export function seedContentData(db: SQLite.SQLiteDatabase, topics: SeedTopic[]): void {
  const existingCount = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM topics');
  if (existingCount && existingCount.count > 0) return;

  for (const topic of topics) {
    db.runSync(
      'INSERT INTO topics (id, title, description, icon, category, difficulty, is_locked) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [topic.id, topic.title, topic.description, topic.icon, topic.category, topic.difficulty || 'Beginner', topic.isLocked ? 1 : 0]
    );
    for (const lesson of topic.lessons) {
      db.runSync(
        'INSERT INTO lessons (id, topic_id, title, description, content, duration, xp, order_num, quiz_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [lesson.id, topic.id, lesson.title, lesson.description, lesson.content, lesson.duration, lesson.xp, lesson.order, lesson.quiz ? JSON.stringify(lesson.quiz) : null]
      );
    }
  }
}

// ─── Topic Queries ─────────────────────────────────────────────────────────

export function getTopicsWithProgress(db: SQLite.SQLiteDatabase): Topic[] {
  const topics = db.getAllSync<{
    id: string; title: string; description: string; icon: string;
    category: string; difficulty: string; is_locked: number;
  }>('SELECT * FROM topics');

  return topics.map(topic => {
    const lessons = db.getAllSync<{
      id: string; title: string; description: string; content: string;
      duration: number; xp: number; order_num: number; quiz_json: string | null;
    }>('SELECT * FROM lessons WHERE topic_id = ? ORDER BY order_num', [topic.id]);

    const completedLessons = db.getFirstSync<{ count: number }>(
      `SELECT COUNT(*) as count FROM completed_lessons cl
       JOIN lessons l ON cl.lesson_id = l.id
       WHERE l.topic_id = ?`,
      [topic.id]
    );

    const totalLessons = lessons.length;
    const completedCount = completedLessons?.count || 0;
    const currentXp = lessons
      .filter(l => {
        const r = db.getFirstSync<{ count: number }>(
          'SELECT COUNT(*) as count FROM completed_lessons WHERE lesson_id = ?',
          [l.id]
        );
        return (r?.count || 0) > 0;
      })
      .reduce((sum, l) => sum + l.xp, 0);

    const totalXp = lessons.reduce((sum, l) => sum + l.xp, 0);

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      icon: topic.icon,
      category: topic.category,
      difficulty: topic.difficulty as Topic['difficulty'],
      isLocked: topic.is_locked === 1,
      totalLessons,
      completedLessons: completedCount,
      xp: totalXp,
      totalXp: totalXp,
      currentXp,
      lessons: lessons.map(l => ({
        id: l.id,
        title: l.title,
        description: l.description,
        content: l.content,
        duration: l.duration,
        xp: l.xp,
        order: l.order_num,
        isCompleted: db.getFirstSync<{ count: number }>(
          'SELECT COUNT(*) as count FROM completed_lessons WHERE lesson_id = ?',
          [l.id]
        )?.count ? db.getFirstSync<{ count: number }>(
          'SELECT COUNT(*) as count FROM completed_lessons WHERE lesson_id = ?',
          [l.id]
        )!.count > 0 : false,
        quiz: l.quiz_json ? JSON.parse(l.quiz_json) : undefined,
      })),
    };
  });
}

export function getLesson(db: SQLite.SQLiteDatabase, lessonId: string): Lesson | null {
  const row = db.getFirstSync<{
    id: string; title: string; description: string; content: string;
    duration: number; xp: number; order_num: number; quiz_json: string | null;
  }>('SELECT * FROM lessons WHERE id = ?', [lessonId]);

  if (!row) return null;

  const isCompleted = (db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM completed_lessons WHERE lesson_id = ?',
    [lessonId]
  )?.count || 0) > 0;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    content: row.content,
    duration: row.duration,
    xp: row.xp,
    order: row.order_num,
    isCompleted,
    quiz: row.quiz_json ? JSON.parse(row.quiz_json) : undefined,
  };
}

// ─── Lesson Completion ─────────────────────────────────────────────────────

export function completeLessonInDb(db: SQLite.SQLiteDatabase, lessonId: string, topicId: string, xp: number): void {
  // Insert completed lesson (idempotent)
  db.runSync('INSERT OR IGNORE INTO completed_lessons (lesson_id) VALUES (?)', [lessonId]);

  // Recompute progress
  const totalLessonsCompleted = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM completed_lessons'
  )?.count || 0;

  const totalXpResult = db.getFirstSync<{ total: number }>(
    `SELECT COALESCE(SUM(l.xp), 0) as total FROM completed_lessons cl JOIN lessons l ON cl.lesson_id = l.id`
  );
  const totalXp = totalXpResult?.total || 0;

  // Count fully completed topics
  const topicsCompleted = db.getFirstSync<{ count: number }>(
    `SELECT COUNT(*) as count FROM topics t
     WHERE (SELECT COUNT(*) FROM lessons WHERE topic_id = t.id) > 0
     AND (SELECT COUNT(*) FROM lessons WHERE topic_id = t.id)
         = (SELECT COUNT(*) FROM completed_lessons cl JOIN lessons l ON cl.lesson_id = l.id WHERE l.topic_id = t.id)`
  )?.count || 0;

  db.runSync(
    `UPDATE user_progress SET total_xp = ?, lessons_completed = ?, topics_completed = ? WHERE id = 1`,
    [totalXp, totalLessonsCompleted, topicsCompleted]
  );
}

// ─── Quiz Results ──────────────────────────────────────────────────────────

export function recordQuizResult(db: SQLite.SQLiteDatabase, score: number, totalQuestions: number, xp: number, passingScore: number = 0.7): { passed: boolean; xpEarned: number } {
  const percentage = score / totalQuestions;
  const passed = percentage >= passingScore;

  let xpEarned = 0;
  if (passed) {
    xpEarned = xp;
    const isPerfect = percentage === 1;
    if (isPerfect) {
      xpEarned = Math.round(xp * 1.5);
    }

    db.runSync(
      `UPDATE user_progress SET quizzes_passed = quizzes_passed + 1, perfect_quizzes = perfect_quizzes + ?, total_xp = total_xp + ? WHERE id = 1`,
      [isPerfect ? 1 : 0, xpEarned]
    );
  }

  return { passed, xpEarned };
}

// ─── Streak ────────────────────────────────────────────────────────────────

export function getStreakDataFromDb(db: SQLite.SQLiteDatabase): { currentStreak: number; longestStreak: number; lastActiveDate: string | null } {
  const row = db.getFirstSync<{ current_streak: number; longest_streak: number; last_active_date: string | null }>(
    'SELECT * FROM streak_data WHERE id = 1'
  );
  return {
    currentStreak: row?.current_streak || 0,
    longestStreak: row?.longest_streak || 0,
    lastActiveDate: row?.last_active_date || null,
  };
}

export function updateStreakInDb(db: SQLite.SQLiteDatabase): { currentStreak: number; longestStreak: number; lastActiveDate: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const current = getStreakDataFromDb(db);
  let newStreak: number;
  let newLongest: number;

  if (!current.lastActiveDate) {
    // First time user
    newStreak = 1;
    newLongest = 1;
  } else if (current.lastActiveDate === todayStr) {
    // Already active today — no change
    return { currentStreak: current.currentStreak, longestStreak: current.longestStreak, lastActiveDate: todayStr };
  } else if (current.lastActiveDate === yesterdayStr) {
    // Consecutive day
    newStreak = current.currentStreak + 1;
    newLongest = Math.max(newStreak, current.longestStreak);
  } else {
    // Streak broken
    newStreak = 1;
    newLongest = current.longestStreak;
  }

  db.runSync(
    'UPDATE streak_data SET current_streak = ?, longest_streak = ?, last_active_date = ? WHERE id = 1',
    [newStreak, newLongest, todayStr]
  );

  return { currentStreak: newStreak, longestStreak: newLongest, lastActiveDate: todayStr };
}

// ─── User Profile ──────────────────────────────────────────────────────────

export function getProfileFromDb(db: SQLite.SQLiteDatabase): UserProfile {
  const row = db.getFirstSync<{
    name: string; email: string | null; avatar_uri: string | null;
    bio: string | null; theme: string; notifications: number;
    haptics_enabled: number; sound_enabled: number;
  }>('SELECT * FROM user_profile WHERE id = 1');

  return {
    id: 'user-1',
    name: row?.name || 'Explorer',
    email: row?.email || '',
    avatar: row?.avatar_uri || undefined,
    bio: row?.bio || undefined,
    joinDate: new Date(),
    preferences: {
      theme: (row?.theme as 'light' | 'dark' | 'system') || 'system',
      notifications: row?.notifications === 1,
    },
  };
}

export function updateProfileInDb(db: SQLite.SQLiteDatabase, updates: Partial<UserProfile>): void {
  const current = getProfileFromDb(db);
  const merged = { ...current, ...updates };

  db.runSync(
    `UPDATE user_profile SET name = ?, email = ?, avatar_uri = ?, bio = ?, theme = ?, notifications = ? WHERE id = 1`,
    [
      merged.name,
      merged.email || null,
      merged.avatar || null,
      merged.bio || null,
      merged.preferences?.theme || 'system',
      merged.preferences?.notifications ? 1 : 0,
    ]
  );
}

// ─── Achievements ──────────────────────────────────────────────────────────

export function getUnlockedAchievements(db: SQLite.SQLiteDatabase): string[] {
  const rows = db.getAllSync<{ achievement_id: string }>('SELECT achievement_id FROM unlocked_achievements');
  return rows.map(r => r.achievement_id);
}

export function unlockAchievement(db: SQLite.SQLiteDatabase, id: string): void {
  db.runSync('INSERT OR IGNORE INTO unlocked_achievements (achievement_id) VALUES (?)', [id]);
}

export function getAchievementsFromDb(db: SQLite.SQLiteDatabase): Achievement[] {
  const unlockedIds = getUnlockedAchievements(db);
  return ACHIEVEMENT_RULES.map(rule => ({
    id: rule.id,
    title: rule.title,
    description: rule.description,
    icon: rule.icon,
    rarity: rule.rarity,
    condition: rule.condition,
    unlocked: unlockedIds.includes(rule.id),
  }));
}

// ─── Settings ──────────────────────────────────────────────────────────────

export function getSettingsFromDb(db: SQLite.SQLiteDatabase): { hapticsEnabled: boolean; soundEnabled: boolean; notifications: boolean } {
  const row = db.getFirstSync<{ haptics_enabled: number; sound_enabled: number; notifications: number }>(
    'SELECT haptics_enabled, sound_enabled, notifications FROM user_profile WHERE id = 1'
  );
  return {
    hapticsEnabled: row?.haptics_enabled === 1,
    soundEnabled: row?.sound_enabled === 1,
    notifications: row?.notifications === 1,
  };
}

export function updateSettingsInDb(db: SQLite.SQLiteDatabase, updates: { hapticsEnabled?: boolean; soundEnabled?: boolean; notifications?: boolean }): void {
  const current = getSettingsFromDb(db);
  const merged = { ...current, ...updates };
  db.runSync(
    'UPDATE user_profile SET haptics_enabled = ?, sound_enabled = ?, notifications = ? WHERE id = 1',
    [merged.hapticsEnabled ? 1 : 0, merged.soundEnabled ? 1 : 0, merged.notifications ? 1 : 0]
  );
}

// ─── Reset ─────────────────────────────────────────────────────────────────

export function resetAllProgress(db: SQLite.SQLiteDatabase): void {
  db.execSync(`
    DELETE FROM completed_lessons;
    DELETE FROM unlocked_achievements;
    UPDATE user_progress SET total_xp = 0, topics_completed = 0, lessons_completed = 0, quizzes_passed = 0, perfect_quizzes = 0 WHERE id = 1;
    UPDATE streak_data SET current_streak = 0, longest_streak = 0, last_active_date = NULL WHERE id = 1;
  `);
}

// ─── Quiz Fetch (for Quizzes screen) ───────────────────────────────────────

export function fetchQuizzesFromDb(db: SQLite.SQLiteDatabase): {
  topicId: string;
  topicTitle: string;
  topicIcon: string;
  lessons: {
    lessonId: string;
    lessonTitle: string;
    lessonOrder: number;
    isLessonCompleted: boolean;
    quiz: any;
    questionCount: number;
  }[];
}[] {
  const topics = db.getAllSync<{ id: string; title: string; icon: string }>('SELECT id, title, icon FROM topics');

  return topics.map(topic => {
    const lessons = db.getAllSync<{
      id: string; title: string; order_num: number; quiz_json: string | null;
    }>('SELECT id, title, order_num, quiz_json FROM lessons WHERE topic_id = ? AND quiz_json IS NOT NULL ORDER BY order_num', [topic.id]);

    return {
      topicId: topic.id,
      topicTitle: topic.title,
      topicIcon: topic.icon,
      lessons: lessons.map(l => {
        const quiz = l.quiz_json ? JSON.parse(l.quiz_json) : null;
        const isCompleted = (db.getFirstSync<{ count: number }>(
          'SELECT COUNT(*) as count FROM completed_lessons WHERE lesson_id = ?',
          [l.id]
        )?.count || 0) > 0;

        return {
          lessonId: l.id,
          lessonTitle: l.title,
          lessonOrder: l.order_num,
          isLessonCompleted: isCompleted,
          quiz,
          questionCount: quiz?.questions?.length || 0,
        };
      }),
    };
  });
}
