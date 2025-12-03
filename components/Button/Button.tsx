import React, { forwardRef } from 'react';
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle
} from 'react-native';
import { scale } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'disabled';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  testID?: string;
}

const Button = forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps & TouchableOpacityProps>(({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
  testID,
  ...rest
}, ref) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const isDisabled = disabled || loading;

  // Size styles
  const sizeStyles = {
    small: {
      paddingVertical: scale(6),
      paddingHorizontal: scale(12),
      borderRadius: scale(4),
    },
    medium: {
      paddingVertical: scale(10),
      paddingHorizontal: scale(16),
      borderRadius: scale(8),
    },
    large: {
      paddingVertical: scale(14),
      paddingHorizontal: scale(24),
      borderRadius: scale(12),
    },
  };

  // Text size styles
  const textSizeStyles = {
    small: {
      fontSize: scale(12),
    },
    medium: {
      fontSize: scale(14),
    },
    large: {
      fontSize: scale(16),
    },
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: isDisabled ? colors.disabled : colors.primary,
      borderWidth: 0,
      borderColor: 'transparent',
    },
    secondary: {
      backgroundColor: isDisabled ? colors.disabled : colors.secondary,
      borderWidth: 0,
      borderColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDisabled ? colors.disabled : colors.primary,
    },
    text: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: 'transparent',
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    disabled: {
      backgroundColor: colors.disabled,
      borderWidth: 0,
      borderColor: 'transparent',
    },
  };

  // Text color based on variant
  const getTextColor = () => {
    if (variant === 'outline') return colors.primary;
    if (variant === 'text') return colors.primary;
    if (variant === 'disabled') return colors.onSurface;
    return colors.surface;
  };

  return (
    <TouchableOpacity
      ref={ref}
      testID={testID}
      activeOpacity={0.7}
      onPress={isDisabled ? undefined : onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDisabled ? 0.6 : 1,
          width: fullWidth ? '100%' : undefined,
          alignSelf: fullWidth ? 'stretch' : 'center',
        },
        sizeStyles[size],
        variantStyles[variant === 'disabled' ? 'disabled' : variant],
        style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size={textSizeStyles[size].fontSize}
          color={getTextColor()}
          style={{ marginRight: icon ? scale(8) : 0 }}
        />
      ): icon ? (
        <>{icon}</>
      ) : null}
      
      {!loading && title && (
        <Text
          style={[
            {
              color: getTextColor(),
              fontWeight: '600',
              textAlign: 'center',
              marginLeft: icon ? scale(8) : 0,
              opacity: isDisabled ? 0.7 : 1,
            },
            textSizeStyles[size],
            textStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

export default Button;
