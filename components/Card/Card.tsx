import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native';
import { scale } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost';

interface CardProps extends TouchableOpacityProps {
  children: ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
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
      backgroundColor: colors.card,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 0,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    filled: {
      backgroundColor: isDark ? colors.surface : colors.card,
      borderWidth: 0,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  }[variant];

  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress 
    ? { 
        onPress: disabled ? undefined : onPress, 
        activeOpacity: 0.7,
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
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  content: {
    width: '100%',
  },
});

export default Card;
