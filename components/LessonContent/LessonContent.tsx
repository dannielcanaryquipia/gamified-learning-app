import React from 'react';
import { Animated, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { responsiveFontSize, scale } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import ButtonPrimary from '../ButtonPrimary';

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
        <Text style={[styles.description, { color: colors.text }]}>
          {description}
        </Text>
      )}

      <View style={styles.markdownContainer}>
        <Markdown style={{ 
          body: { 
            color: colors.text,
            fontSize: responsiveFontSize(16),
            lineHeight: responsiveFontSize(24),
            fontFamily: 'System',
          },
          heading1: {
            color: colors.primary,
            fontSize: responsiveFontSize(24),
            fontWeight: 'bold',
            marginTop: scale(16),
            marginBottom: scale(8),
          },
          heading2: {
            color: colors.text,
            fontSize: responsiveFontSize(20),
            fontWeight: '600',
            marginTop: scale(12),
            marginBottom: scale(6),
          },
          paragraph: {
            marginBottom: scale(12),
          },
          list_item: {
            marginBottom: scale(4),
          },
          code_inline: {
            color: colors.primary,
            backgroundColor: colors.codeBackground,
            padding: scale(2),
            borderRadius: scale(4),
          },
          code_block: {
            color: colors.text,
            backgroundColor: colors.codeBackground,
            padding: scale(12),
            borderRadius: scale(8),
            marginBottom: scale(12),
            fontFamily: 'monospace',
          },
          strong: {
            color: colors.text,
            fontWeight: '700',
          },
          em: {
            color: colors.text,
            fontStyle: 'italic',
          }
        }}>
          {content}
        </Markdown>
      </View>

      {onComplete && (
        <Animated.View style={[styles.completeButtonContainer, fadeAnim ? { opacity: fadeAnim } : { opacity: showCompleteButton ? 1 : 0 }]}>
          <ButtonPrimary
            label={isCompleted ? 'Completed! ✨' : 'Mark as Complete'}
            onPress={onComplete}
            loading={isLoading}
            disabled={(!showCompleteButton && !isCompleted) || isLoading}
            style={{ 
              backgroundColor: isCompleted ? colors.success : colors.primary,
              width: '100%',
              maxWidth: scale(400)
            }}
          />
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
    marginBottom: scale(20),
    fontStyle: 'italic',
    opacity: 0.8,
  },
  markdownContainer: {
    width: '100%',
  },
  completeButtonContainer: {
    marginTop: scale(40),
    marginBottom: scale(20),
    alignItems: 'center',
    width: '100%',
  },
});

export default LessonContent;
