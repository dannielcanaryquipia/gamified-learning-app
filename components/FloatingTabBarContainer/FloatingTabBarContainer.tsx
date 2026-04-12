import React from 'react';
import { Platform, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

interface FloatingTabBarProps {
  isVisible: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * A reusable floating container for bottom tab navigation.
 * Provides a pill-shaped, elevated design that responds to screen width.
 */
const FloatingTabBarContainer: React.FC<FloatingTabBarProps> = ({ isVisible, children, style }) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const { isTablet, isDesktop, scale } = useResponsive();
  const isWide = isTablet || isDesktop;

  if (!isVisible) return null;

  return (
    <View 
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          left: isWide ? '50%' : scale(20),
          right: isWide ? 'auto' : scale(20),
          width: isWide ? scale(350) : undefined,
          marginLeft: isWide ? scale(-175) : 0,
          ...Platform.select({
            web: {
              boxShadow: isDark 
                ? '0px 8px 24px rgba(0, 0, 0, 0.5)' 
                : '0px 8px 24px rgba(0, 0, 0, 0.12)',
            },
            default: {
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            },
          }),
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = {
  container: {
    position: 'absolute' as const,
    borderTopWidth: 0,
    overflow: 'hidden' as const,
    flexDirection: 'row' as const,
  }
};

export default FloatingTabBarContainer;
