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
    background: isDark ? '#121212' : '#FFFFFF',
    card: isDark ? '#1E1E1E' : '#F8F9FA',
    text: isDark ? '#FFFFFF' : '#212529',
    border: isDark ? '#333333' : '#E9ECEF',
    notification: isDark ? '#FF3B30' : '#FF3B30',
    primary: isDark ? '#BB86FC' : '#6200EE',
    primaryVariant: isDark ? '#3700B3' : '#3700B3',
    secondary: isDark ? '#03DAC6' : '#03DAC6',
    error: isDark ? '#CF6679' : '#B00020',
    surface: isDark ? '#1E1E1E' : '#FFFFFF',
    onSurface: isDark ? '#FFFFFF' : '#000000',
    disabled: isDark ? '#666666' : '#D1D5DB',
    placeholder: isDark ? '#A0A0A0' : '#9CA3AF',
    backdrop: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    modalOverlay: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
  };
};
