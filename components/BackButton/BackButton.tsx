import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { scale } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

export type BackButtonVariant = 'circle' | 'inline';

interface BackButtonProps {
  /** Visual style of the button. Defaults to 'circle'. */
  variant?: BackButtonVariant;
  /** Override the default onPress (router.back()). */
  onPress?: () => void;
  /** Additional style applied to the outer container. */
  style?: ViewStyle;
  /** Icon color override. Defaults to theme-appropriate color. */
  color?: string;
  /** Icon size. Defaults to scale(24). */
  size?: number;
  /** Icon name override. Defaults to 'arrow-back'. Use 'close' for modal-style screens. */
  icon?: React.ComponentProps<typeof MaterialIcons>['name'];
}

/**
 * Universal back button used across all non-tab screens.
 * Automatically calls `router.back()` unless `onPress` is provided.
 *
 * Variants:
 *  - `circle`  — rounded square container (default). Great for detail pages.
 *  - `inline`  — bare icon with padding, sits naturally inside a row header.
 */
const BackButton: React.FC<BackButtonProps> = ({
  variant = 'circle',
  onPress,
  style,
  color,
  size = scale(24),
  icon = 'arrow-back',
}) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  const iconColor = color ?? (variant === 'circle' ? colors.onSurface : colors.primary);

  if (variant === 'inline') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.inline, style]}
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialIcons name={icon} size={size} color={iconColor} />
      </TouchableOpacity>
    );
  }

  // circle variant
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.circle,
        { backgroundColor: colors.surfaceContainerHighest },
        style,
      ]}
      accessibilityLabel="Go back"
      accessibilityRole="button"
    >
      <MaterialIcons name={icon} size={size} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inline: {
    padding: scale(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackButton;
