import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Animated, Easing, StyleSheet, View, Platform } from 'react-native';
import { scale } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

/**
 * Animated loading spinner component
 * Follows design tokens and accessibility guidelines
 */
export default function LoadingSpinner({ 
  size = scale(40), 
  color 
}: LoadingSpinnerProps) {

  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const spinAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    ).start();
  }, [spinAnim]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinnerColor = color || colors.primary;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate }], width: size, height: size }]}>
        <MaterialIcons 
          name="refresh" 
          size={size * 0.6} 
          color={spinnerColor} 
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
