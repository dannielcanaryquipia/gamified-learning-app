import React from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    TouchableOpacityProps
} from 'react-native';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import styles from './styles';

interface ButtonPrimaryProps extends TouchableOpacityProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  accessibilityLabel,
  style,
  ...rest
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={isDisabled ? undefined : onPress}
      style={[
        styles.button,
        variant === 'secondary' ? styles.secondaryButton : styles.primaryButton,
        {
          backgroundColor: isDisabled 
            ? colors.disabled
            : (variant === 'secondary' ? colors.accent : colors.primary),
        },
        style,
      ]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ButtonPrimary;
