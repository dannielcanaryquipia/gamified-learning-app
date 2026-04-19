import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { fetchTopics, fetchUserProfile, fetchUserProgress, completeLesson } from '../services/mockData';
import { Topic, UserProfile, UserProgress } from '../types';

const PROFILE_STORAGE_KEY = '@GamifiedLearning:userProfile';
const PROGRESS_STORAGE_KEY = '@GamifiedLearning:userProgress';
const STREAK_STORAGE_KEY = '@GamifiedLearning:streakData';

interface StreakData {
  lastActiveDate: string; // ISO string of the last active date
  currentStreak: number; // Current streak count
  longestStreak: number; // Longest streak achieved
}

interface AppContextType {
  isLoading: boolean;
  topics: Topic[];
  userProgress: UserProgress | null;
  userProfile: UserProfile | null;
  streakData: StreakData | null;
  refreshData: () => Promise<void>;
  markLessonComplete: (topicId: string, lessonId: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateStreak: () => Promise<StreakData | void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);

  // Load data from AsyncStorage
  const loadStoredData = async () => {
    try {
      const [storedProfile, storedProgress, storedStreak] = await Promise.all([
        AsyncStorage.getItem(PROFILE_STORAGE_KEY),
        AsyncStorage.getItem(PROGRESS_STORAGE_KEY),
        AsyncStorage.getItem(STREAK_STORAGE_KEY),
      ]);

      if (storedProfile) {
        setUserProfile(safeParse(storedProfile));
      }
      
      if (storedProgress) {
        const parsed = safeParse(storedProgress);
        // Ensure new fields have defaults for backward compatibility
        setUserProgress({
          lessonsCompleted: 0,
          quizzesPassed: 0,
          perfectQuizzes: 0,
          totalLessons: 0,
          ...parsed,
        });
      }

      // Initialize streak data if it doesn't exist
      if (storedStreak) {
        setStreakData(safeParse(storedStreak));
      } else {
        // Initialize new streak data for first-time users
        const initialStreakData = {
          lastActiveDate: new Date().toISOString(),
          currentStreak: 1,
          longestStreak: 1
        };
        setStreakData(initialStreakData);
        await saveStreakData(initialStreakData);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  // Helper function to safely serialize objects with Date objects
  const safeStringify = (obj: any): string => {
    return JSON.stringify(obj, (key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      return value;
    });  
  };

  // Helper function to safely parse objects with Date objects
  const safeParse = (json: string): any => {
    return JSON.parse(json, (key, value) => {
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }
      return value;
    });
  };

  // Save data to AsyncStorage
  const saveProfileData = async (profile: UserProfile | null) => {
    try {
      if (profile) {
        await AsyncStorage.setItem(PROFILE_STORAGE_KEY, safeStringify(profile));
      } else {
        await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  };

  const saveProgressData = async (progress: UserProgress | null) => {
    try {
      if (progress) {
        await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, safeStringify(progress));
      } else {
        await AsyncStorage.removeItem(PROGRESS_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving progress data:', error);
    }
  };

  const saveStreakData = async (streak: StreakData | null) => {
    try {
      if (streak) {
        await AsyncStorage.setItem(STREAK_STORAGE_KEY, safeStringify(streak));
      } else {
        await AsyncStorage.removeItem(STREAK_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  };

  const updateStreak = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Initialize with current date and streak of 1 for new users
      const currentStreakData = streakData || {
        lastActiveDate: today.toISOString(),
        currentStreak: 1,
        longestStreak: 1
      };
  
      // If it's a new user or first time, initialize with streak of 1
      if (!streakData) {
        const initialStreak = {
          lastActiveDate: today.toISOString(),
          currentStreak: 1,
          longestStreak: 1
        };
        setStreakData(initialStreak);
        await saveStreakData(initialStreak);
        return initialStreak;
      }   

      // If it's a new day, update the streak
      const lastActiveDate = currentStreakData.lastActiveDate 
        ? new Date(currentStreakData.lastActiveDate)
        : null;

      let newStreak = { ...currentStreakData };
      
      if (lastActiveDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActiveDate.toDateString() === yesterday.toDateString()) {
          // Increment streak if last active was yesterday
          newStreak = {
            ...newStreak,
            currentStreak: newStreak.currentStreak + 1,
            longestStreak: Math.max(newStreak.longestStreak, newStreak.currentStreak + 1),
            lastActiveDate: today.toISOString()
          };
        } else if (lastActiveDate.toDateString() !== today.toDateString()) {
          // Reset streak if missed a day
          newStreak = {
            ...newStreak,
            currentStreak: 1,
            lastActiveDate: today.toISOString()
          };
        }
      }
      
      // Save updated streak data
      await saveStreakData(newStreak);
      setStreakData(newStreak);
      
      return newStreak;
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // First load data from AsyncStorage
      await loadStoredData();
      
      // Then fetch fresh data from the server
      const [topicsData, progressData, profileData] = await Promise.all([
        fetchTopics(),
        fetchUserProgress(),
        fetchUserProfile(),
      ]);
      
      setTopics(topicsData);
      
      // Only update progress and profile if we don't have them in storage
      // or if you want to merge with server data, you can implement merging logic here
      if (!userProgress) {
        setUserProgress(progressData);
        await saveProgressData(progressData);
      }
      
      if (!userProfile) {
        setUserProfile(profileData);
        await saveProfileData(profileData);
      }
    } catch (error) {
      console.error('Failed to load app data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markLessonComplete = async (topicId: string, lessonId: string) => {
    try {
      // Call the completion service
      const result = await completeLesson(topicId, lessonId);
      
      // Update topics with the latest data
      const updatedTopics = topics.map(topic => 
        topic.id === topicId ? result.topic : topic
      );
      setTopics(updatedTopics);
      
      // Update user progress
      setUserProgress(result.userProgress);
      await saveProgressData(result.userProgress);
      
      console.log('Lesson completion updated in AppContext:', {
        topicId,
        lessonId,
        userProgress: result.userProgress
      });
      
    } catch (error) {
      console.error('Error marking lesson complete in AppContext:', error);
      throw error; // Re-throw to allow handling in the component
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    try {
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      
      // Update AsyncStorage
      await saveProfileData(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  useEffect(() => {
    loadData().then(() => {
      // Initialize or update streak when app loads
      updateStreak();
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        topics,
        userProgress,
        userProfile,
        streakData,
        refreshData: loadData,
        markLessonComplete,
        updateUserProfile,
        updateStreak,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
