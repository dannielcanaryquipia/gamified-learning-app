import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import styles from './styles';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  label?: string;
}

const XPBar: React.FC<XPBarProps> = ({ 
  currentXP, 
  maxXP, 
  label 
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(currentXP / maxXP, { damping: 15 });
  }, [currentXP, maxXP]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View style={[styles.track, { backgroundColor: colors.trackBackground }]}>
        <Animated.View 
          style={[
            styles.progress, 
            { backgroundColor: colors.primary }, 
            animatedStyle
          ]} 
        />
      </View>
      <Text style={[styles.xpText, { color: colors.text }]}>
        {currentXP} / {maxXP} XP
      </Text>
    </View>
  );
};

export default XPBar;
