import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import Button from '../Button/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }: ErrorStateProps) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  return (
    <View style={styles.container}>
      <MaterialIcons name="error-outline" size={scale(48)} color={colors.error || '#ff716c'} />
      <Text style={[styles.message, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_400Regular' }]}>
        {message}
      </Text>
      {onRetry && (
        <Button title="Retry" onPress={onRetry} variant="outline" size="small" style={{ marginTop: scale(16) }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(32),
    minHeight: scale(200),
  },
  message: {
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
    marginTop: scale(16),
    lineHeight: responsiveFontSize(20),
  },
});
