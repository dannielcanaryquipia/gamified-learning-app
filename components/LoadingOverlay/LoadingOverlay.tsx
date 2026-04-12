import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { responsiveFontSize, scale } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  spinnerSize?: number;
}

/**
 * Floating container loading overlay component
 * Displays a centered card with spinner and message
 */
export default function LoadingOverlay({
  visible,
  message = 'Loading...',
  spinnerSize = scale(60),
}: LoadingOverlayProps) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);



  if (!visible) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <LoadingSpinner size={spinnerSize} />
          <Text style={[styles.message, { color: colors.text }]}>
            {message}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
    ...(Platform.OS === 'web' ? {
      position: 'fixed' as any,
      width: '100%' as any,
      height: '100%' as any,
    } : {}),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    ...(Platform.OS === 'web' ? {
      position: 'fixed' as any,
      width: '100%' as any,
      height: '100%' as any,
    } : {}),
  },
  container: {
    padding: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.3)',
      },
      default: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
    }),
  },
  message: {
    marginTop: scale(16),
    fontSize: responsiveFontSize(16),
    textAlign: 'center',
  },
});
