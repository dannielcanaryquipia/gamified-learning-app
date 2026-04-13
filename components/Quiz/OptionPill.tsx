import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

interface OptionPillProps {
  label: string;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const OptionPill: React.FC<OptionPillProps> = ({ 
  label, 
  isSelected, 
  isCorrect, 
  isWrong, 
  onPress,
  disabled 
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  let borderColor = 'transparent';
  let backgroundColor = colors.surfaceContainerLow;
  let iconName: React.ComponentProps<typeof MaterialIcons>['name'] | null = null;
  let iconColor = colors.onSurfaceVariant;

  if (isCorrect) {
    borderColor = colors.success;
    backgroundColor = colors.success + '10';
    iconName = 'check-circle';
    iconColor = colors.success;
  } else if (isWrong) {
    borderColor = colors.error;
    backgroundColor = colors.error + '10';
    iconName = 'cancel';
    iconColor = colors.error;
  } else if (isSelected) {
    borderColor = colors.primary;
    backgroundColor = colors.primary + '10';
    iconName = 'radio-button-checked';
    iconColor = colors.primary;
  } else {
    iconName = 'radio-button-unchecked';
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress} 
      disabled={disabled}
      style={[
        styles.container, 
        { 
          backgroundColor, 
          borderWidth: isSelected || isCorrect || isWrong ? 2 : 1,
          borderColor: isSelected || isCorrect || isWrong ? borderColor : 'rgba(255,255,255,0.05)'
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
           <MaterialIcons name={iconName as any} size={scale(20)} color={iconColor} />
        </View>
        <Text style={[styles.label, { color: colors.onSurface, fontFamily: 'Manrope_600SemiBold' }]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(18),
    borderRadius: scale(20),
    marginBottom: scale(12),
    ...Platform.select({
      web: { transition: 'all 0.2s ease' }
    })
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  iconWrapper: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: responsiveFontSize(15),
    flex: 1,
  },
});

export default OptionPill;
