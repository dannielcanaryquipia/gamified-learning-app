import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { scale } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

interface ProgressBarProps {
  progress: number; // Value between 0 and 1
  height?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  labelStyle?: object;
  style?: ViewStyle;
  testID?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = scale(8),
  color,
  backgroundColor,
  borderRadius = scale(4),
  showLabel = false,
  labelPosition = 'right',
  labelStyle,
  style,
  testID,
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(normalizedProgress * 100);
  
  // Default colors based on theme
  const progressColor = color || colors.primary;
  const trackColor = backgroundColor || (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)');
  
  // Determine label position styles
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
        <View
          style={[
            styles.progress,
            {
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: progressColor,
              borderTopLeftRadius: borderRadius,
              borderBottomLeftRadius: borderRadius,
              borderTopRightRadius: normalizedProgress === 1 ? borderRadius : 0,
              borderBottomRightRadius: normalizedProgress === 1 ? borderRadius : 0,
            },
          ]}
        />
        
        {showLabel && labelPosition === 'center' && (
          <View style={styles.centeredLabelContainer}>
            <Text 
              style={[
                styles.label, 
                { color: colors.text },
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
              color: colors.text,
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
    fontSize: scale(12),
    fontWeight: '500',
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
