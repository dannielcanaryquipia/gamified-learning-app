import React, { ReactNode } from 'react';
import { Platform, StyleSheet, TouchableOpacity, TouchableOpacityProps, View, ViewStyle, StyleProp } from 'react-native';
import { scale } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost' | 'cosmic';

interface CardProps extends TouchableOpacityProps {
  children: ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  testID?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  style,
  contentContainerStyle,
  onPress,
  disabled = false,
  fullWidth = false,
  testID,
  ...rest
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  const cardStyles = {
    elevated: {
      backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface,
      ...Platform.select({
        web: {
          boxShadow: isDark ? '0px 10px 30px rgba(0, 0, 0, 0.5)' : `0px 4px 12px rgba(63, 69, 108, 0.08)`,
        },
        default: {
          shadowColor: isDark ? '#000' : colors.onSurface,
          shadowOffset: { width: 0, height: scale(8) },
          shadowOpacity: isDark ? 0.4 : 0.05,
          shadowRadius: scale(16),
          elevation: isDark ? 0 : 2, 
        },
      }),
      borderWidth: 0,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    filled: {
      backgroundColor: isDark ? colors.surfaceContainer : colors.surfaceContainerLow,
      borderWidth: 0,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    cosmic: {
      backgroundColor: isDark ? colors.surfaceContainerHighest : colors.surfaceContainerHigh,
      borderWidth: 0,
    }
  }[variant] || { backgroundColor: colors.surfaceContainerLow };

  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress 
    ? { 
        onPress: disabled ? undefined : onPress, 
        activeOpacity: 0.85,
        disabled,
        testID,
        ...rest 
      } 
    : { testID, ...rest };

  return (
    <Container
      style={[
        styles.container,
        {
          width: fullWidth ? '100%' : undefined,
          opacity: disabled ? 0.6 : 1,
        },
        cardStyles,
        style,
      ]}
      {...containerProps}
    >
      <View style={[styles.content, contentContainerStyle]}>
        {children}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(12), // Cosmic Archive rule: 12px corner radius for cards
    overflow: 'hidden',
  },
  content: {
    width: '100%',
  },
});

export default Card;
