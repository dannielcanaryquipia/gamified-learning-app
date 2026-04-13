import React from 'react';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { scale } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

interface ProgressBarProps {
  progress: number; // Value between 0 and 1
  height?: number;
  color?: string;
  gradientColors?: string[];
  backgroundColor?: string;
  borderRadius?: number;
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  labelStyle?: object;
  style?: ViewStyle;
  testID?: string;
}

const ProgressBar = ({
  progress,
  height = scale(8),
  color,
  gradientColors,
  backgroundColor,
  borderRadius = scale(6),
  showLabel = false,
  labelPosition = 'right',
  labelStyle,
  style,
  testID,
}: ProgressBarProps) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(normalizedProgress * 100);
  
  const startColor = gradientColors ? gradientColors[0] : (color || colors.primary);
  const endColor = gradientColors ? (gradientColors[1] || gradientColors[0]) : (color || colors.primaryDim);
  
  const trackColor = backgroundColor || colors.trackBackground;
  
  const getLabelPosition = () => {
    switch (labelPosition) {
      case 'top':
        return { flexDirection: 'column-reverse' as const, alignItems: 'flex-start' as const };
      case 'bottom':
        return { flexDirection: 'column' as const, alignItems: 'flex-start' as const };
      case 'left':
        return { flexDirection: 'row-reverse' as const, alignItems: 'center' as const };
      case 'right':
        return { flexDirection: 'row' as const, alignItems: 'center' as const };
      case 'center':
        return { flexDirection: 'column' as const, alignItems: 'center' as const };
      default:
        return { flexDirection: 'row' as const, alignItems: 'center' as const };
    }
  };
  
  const labelPositionStyle = getLabelPosition();
  const hasLabel = showLabel && labelPosition !== 'center';
  
  return (
    <View 
      style={[
        styles.container, 
        labelPositionStyle,
        hasLabel && styles.spacing,
        style
      ]}
      testID={testID}
    >
      <View 
        style={[
          styles.track,
          {
            height,
            backgroundColor: trackColor,
            borderRadius,
            flex: hasLabel ? 1 : undefined,
          },
        ]}
      >
        <LinearGradient
          colors={[startColor, endColor]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.progress,
            {
              width: `${percentage}%`,
              height: '100%',
              borderRadius,
              ...Platform.select({
                web: {
                  boxShadow: isDark ? `0px 0px 10px ${startColor}80` : 'none',
                },
                default: {
                  shadowColor: startColor,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: isDark ? 0.5 : 0,
                  shadowRadius: 4,
                }
              })
            },
          ]}
        />
        
        {showLabel && labelPosition === 'center' && (
          <View style={styles.centeredLabelContainer}>
            <Text 
              style={[
                styles.label, 
                { color: colors.onSurface, fontFamily: 'Manrope_600SemiBold' },
                labelStyle
              ]}
            >
              {percentage}%
            </Text>
          </View>
        )}
      </View>
      
      {showLabel && labelPosition !== 'center' && (
        <Text 
          style={[
            styles.label, 
            { 
              color: colors.onSurface,
              fontFamily: 'Manrope_600SemiBold',
              marginLeft: labelPosition === 'right' ? scale(8) : 0,
              marginRight: labelPosition === 'left' ? scale(8) : 0,
              marginTop: labelPosition === 'bottom' ? scale(4) : 0,
              marginBottom: labelPosition === 'top' ? scale(4) : 0,
            },
            labelStyle
          ]}
        >
          {percentage}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  label: {
    fontSize: scale(11),
  },
  centeredLabelContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacing: {
    marginVertical: scale(4),
  },
});

export default ProgressBar;
