import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: (mode?: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Update theme when system color scheme changes
  useEffect(() => {
    if (theme === 'system') {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, theme]);

  // Apply theme to the app
  useEffect(() => {
    if (theme !== 'system') {
      setIsDark(theme === 'dark');
    }
  }, [theme]);

  const toggleTheme = (mode?: ThemeMode) => {
    if (mode) {
      setTheme(mode);
    } else {
      setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Custom hook to get theme-aware styles
export const useThemeStyles = <T,>(
  lightStyles: T,
  darkStyles: T
): T => {
  const { isDark } = useTheme();
  return isDark ? { ...lightStyles, ...darkStyles } : lightStyles;
};

// Helper function to get theme colors
export const getThemeColors = (isDark: boolean) => {
  return {
    // Cosmic Archive Core Palette
    background: isDark ? '#040a2f' : '#FFFFFF',
    surface: isDark ? '#040a2f' : '#FFFFFF',
    surfaceContainerLow: isDark ? '#080e38' : '#e2e3ff',
    surfaceContainer: isDark ? '#0d1542' : '#d7d9ff',
    surfaceContainerHigh: isDark ? '#121a4c' : '#cccefc',
    surfaceContainerHighest: isDark ? '#182056' : '#c2c4f9',
    surfaceBright: isDark ? '#1d2660' : '#fbf8ff',
    
    onSurface: isDark ? '#e2e3ff' : '#040a2f',
    onSurfaceVariant: isDark ? '#a3a8d5' : '#4d527a',
    outlineVariant: isDark ? 'rgba(63, 73, 157, 0.15)' : 'rgba(63, 69, 108, 0.15)',
    
    // Primary Actions (Luminal Blue)
    primary: '#8bacff',
    primaryDim: '#006cfb',
    primaryContainer: '#759eff',
    
    // Gamification & Feedback
    secondary: '#cad6fd',
    tertiary: '#ffc565', // Gold/XP Tone
    success: '#2ECC71',
    error: '#ff716c',
    
    // UI Helpers
    notification: '#ff716c',
    disabled: isDark ? '#3f456c' : '#D1D5DB',
    placeholder: isDark ? '#6d739d' : '#9CA3AF',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    modalOverlay: isDark ? 'rgba(4, 10, 47, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    codeBackground: isDark ? '#0d1542' : '#f5f5f5',
    trackBackground: isDark ? '#000000' : '#E0E0E0',
    skeletonBackground: isDark ? '#121a4c' : '#e1e1e1',
    shadow: '#000000',
    white: '#FFFFFF',
    
    // Legacy mapping for backwards compatibility during migration
    text: isDark ? '#e2e3ff' : '#040a2f', // Map to onSurface
    border: isDark ? 'rgba(63, 73, 157, 0.15)' : 'rgba(63, 69, 108, 0.15)', // Map to outlineVariant
    card: isDark ? '#080e38' : '#e2e3ff', // Map to surfaceContainerLow
    accent: '#ffc565', // Map to tertiary
    onPrimary: '#FFFFFF',
  };
};
