import React from 'react';
import { Animated, StyleSheet, Text, View, ViewStyle, Platform } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { responsiveFontSize, scale } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import ButtonPrimary from '../ButtonPrimary';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';

interface LessonContentProps {
  content: string;
  description?: string;
  isCompleted?: boolean;
  isLoading?: boolean;
  onComplete?: () => void;
  showCompleteButton?: boolean;
  fadeAnim?: Animated.Value;
  style?: ViewStyle;
}

const LessonContent: React.FC<LessonContentProps> = ({ 
  content, 
  description,
  isCompleted,
  isLoading,
  onComplete,
  showCompleteButton,
  fadeAnim,
  style 
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  return (
    <View style={[styles.container, style]}>
      {description && (
        <Text style={[styles.description, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
          {description}
        </Text>
      )}

      <View style={styles.markdownContainer}>
        <Markdown style={{ 
          body: { 
            color: colors.onSurface,
            fontSize: responsiveFontSize(16),
            lineHeight: responsiveFontSize(26),
            fontFamily: 'Manrope_400Regular',
          },
          heading1: {
            color: colors.onSurface,
            fontSize: responsiveFontSize(28),
            fontFamily: 'PlusJakartaSans_800ExtraBold',
            marginTop: scale(24),
            marginBottom: scale(16),
            letterSpacing: -0.5,
          },
          heading2: {
            color: colors.primary,
            fontSize: responsiveFontSize(20),
            fontFamily: 'PlusJakartaSans_700Bold',
            marginTop: scale(20),
            marginBottom: scale(12),
          },
          paragraph: {
            marginBottom: scale(16),
            opacity: 0.9,
          },
          list_item: {
            marginBottom: scale(10),
          },
          bullet_list: {
            marginBottom: scale(16),
          },
          code_inline: {
            color: colors.primary,
            backgroundColor: colors.surfaceContainerHigh,
            paddingHorizontal: scale(6),
            paddingVertical: scale(2),
            borderRadius: scale(6),
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
          },
          code_block: {
            color: colors.onSurface,
            backgroundColor: colors.surfaceContainerLow,
            padding: scale(20),
            borderRadius: scale(16),
            marginBottom: scale(20),
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            borderWidth: 0, // No-line architecture
          },
          blockquote: {
            backgroundColor: colors.surfaceContainerLow,
            borderLeftColor: colors.primary,
            borderLeftWidth: scale(4),
            padding: scale(16),
            borderRadius: scale(8),
            marginBottom: scale(16),
          },
          strong: {
            color: colors.primary,
            fontFamily: 'Manrope_700Bold',
          },
        }}>
          {content}
        </Markdown>
      </View>

      {onComplete && (
        <Animated.View style={[
          styles.completeButtonWrapper, 
          fadeAnim ? { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] } : { opacity: showCompleteButton ? 1 : 0 }
        ]}>
           <TouchableOpacity 
              activeOpacity={0.8}
              onPress={onComplete}
              disabled={(!showCompleteButton && !isCompleted) || isLoading}
              style={styles.pillContainer}
            >
              <LinearGradient
                colors={isCompleted ? [colors.success, colors.success] : [colors.primary, colors.primaryDim]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.completeButton}
              >
                <Text style={[styles.completeButtonText, { color: 'white', fontFamily: 'PlusJakartaSans_700Bold' }]}>
                  {isCompleted ? 'Mission Accomplished' : 'Archive Knowledge'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  description: {
    fontSize: responsiveFontSize(16),
    marginBottom: scale(24),
    opacity: 0.7,
  },
  markdownContainer: {
    width: '100%',
  },
  completeButtonWrapper: {
    marginTop: scale(48),
    marginBottom: scale(40),
    alignItems: 'center',
    width: '100%',
  },
  pillContainer: {
    width: '100%',
    maxWidth: scale(320),
  },
  completeButton: {
    paddingVertical: scale(16),
    borderRadius: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 25px rgba(11, 111, 255, 0.25)',
      },
      default: {
        shadowColor: '#0b6fff',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
      }
    })
  },
  completeButtonText: {
    fontSize: responsiveFontSize(16),
  },
});

export default LessonContent;
