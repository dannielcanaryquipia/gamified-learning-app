import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme, getThemeColors } from '../../contexts/ThemeContext';
import { scale } from '../../constants/responsive';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'rect' | 'circle' | 'text';
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = scale(20),
  borderRadius = scale(8),
  style,
  variant = 'rect'
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, [opacity]);

  const skeletonStyle: ViewStyle = {
    width: width as any,
    height: height as any,
    borderRadius: variant === 'circle' ? (typeof height === 'number' ? height / 2 : scale(50)) : borderRadius,
    backgroundColor: isDark ? '#2c2c2e' : '#e1e1e1',
  };

  return (
    <Animated.View
      style={[
        skeletonStyle,
        { opacity },
        style
      ]}
    />
  );
};

export default Skeleton;
