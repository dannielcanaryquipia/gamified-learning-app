import React, { useState } from 'react';
import { Animated, StyleSheet, Text, View, ViewStyle, Platform } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { responsiveFontSize, scale } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import QuizEngine from '../Quiz/QuizEngine';
import { Quiz } from '../../types';

interface LessonContentProps {
  content: string;
  description?: string;
  isCompleted?: boolean;
  isLoading?: boolean;
  onComplete?: () => void;
  showCompleteButton?: boolean;
  fadeAnim?: Animated.Value;
  style?: ViewStyle;
  quiz?: Quiz;
  xpValue?: number;
}

const LessonContent: React.FC<LessonContentProps> = ({ 
  content, 
  description,
  isCompleted,
  isLoading,
  onComplete,
  showCompleteButton,
  fadeAnim,
  style,
  quiz,
  xpValue = 50
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleQuizComplete = (score: number) => {
    const passed = (score / (quiz?.questions.length || 1)) >= (quiz?.passingScore || 0.7);
    if (passed) {
      setQuizFinished(true);
      if (onComplete) onComplete();
    } else {
       // Reset or keep failing state handled in QuizEngine
    }
  };

  return (
    <View style={[styles.container, style]}>
      {description && (
        <View style={[styles.blueprintIndicator, { backgroundColor: colors.primary + '10' }]}>
           <MaterialIcons name="info-outline" size={scale(16)} color={colors.primary} />
           <Text style={[styles.description, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
             {description}
           </Text>
        </View>
      )}

      <View style={styles.markdownContainer}>
        <Markdown style={{ 
          body: { 
            color: colors.onSurface,
            fontSize: responsiveFontSize(17),
            lineHeight: responsiveFontSize(28),
            fontFamily: 'Manrope_400Regular',
          },
          heading1: {
            color: colors.onSurface,
            fontSize: responsiveFontSize(32),
            fontFamily: 'PlusJakartaSans_800ExtraBold',
            marginTop: scale(32),
            marginBottom: scale(20),
            letterSpacing: -1,
          },
          heading2: {
            color: colors.primary,
            fontSize: responsiveFontSize(22),
            fontFamily: 'PlusJakartaSans_700Bold',
            marginTop: scale(28),
            marginBottom: scale(16),
          },
          paragraph: {
            marginBottom: scale(20),
            opacity: 0.9,
          },
          list_item: {
            marginBottom: scale(12),
          },
          bullet_list: {
            marginBottom: scale(20),
          },
          code_block: {
            color: colors.onSurface,
            backgroundColor: colors.surfaceContainerLow,
            padding: scale(20),
            borderRadius: scale(20),
            marginBottom: scale(24),
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.05)',
          },
        }}>
          {content}
        </Markdown>
      </View>

      {/* Conditional Rendering: Quiz or Completion Button */}
      {quiz && !isCompleted && !quizFinished ? (
        <View style={styles.quizSection}>
           <View style={[styles.checkpointLine, { backgroundColor: colors.surfaceContainerHighest }]} />
           <Text style={[styles.checkpointText, { color: colors.onSurfaceVariant, fontFamily: 'PlusJakartaSans_700Bold' }]}>KNOWLEDGE EVALUATION REQUIRED</Text>
           <QuizEngine 
            questions={quiz.questions} 
            onComplete={handleQuizComplete} 
            xpReward={xpValue}
           />
        </View>
      ) : (
        onComplete && (
          <Animated.View style={[
            styles.completeButtonWrapper, 
            fadeAnim ? { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] } : { opacity: (showCompleteButton || isCompleted) ? 1 : 0 }
          ]}>
             <View style={[styles.checkpointLine, { backgroundColor: colors.surfaceContainerHighest }]} />
             <Text style={[styles.checkpointText, { color: colors.onSurfaceVariant, fontFamily: 'PlusJakartaSans_700Bold' }]}>
               {isCompleted || quizFinished ? 'SYNCHRONIZATION COMPLETE' : 'END OF TRANSMISSION'}
             </Text>
             
             <TouchableOpacity 
                activeOpacity={0.8}
                onPress={onComplete}
                disabled={(!showCompleteButton && !isCompleted && !quizFinished) || isLoading || isCompleted}
                style={styles.pillContainer}
              >
                <LinearGradient
                  colors={isCompleted || quizFinished ? [colors.success, colors.success] : [colors.primary, colors.primaryDim]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.completeButton}
                >
                  <Text style={[styles.completeButtonText, { color: 'white', fontFamily: 'PlusJakartaSans_700Bold' }]}>
                    {isCompleted || quizFinished ? 'ARCHIVE SYNCED' : 'COMMIT KNOWLEDGE'}
                  </Text>
                  {!isCompleted && !quizFinished && <MaterialIcons name="bolt" size={scale(20)} color="white" style={{ marginLeft: scale(8) }} />}
                </LinearGradient>
              </TouchableOpacity>
          </Animated.View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  blueprintIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(16),
    marginBottom: scale(32),
    gap: scale(12),
  },
  description: {
    fontSize: responsiveFontSize(14),
    flex: 1,
  },
  markdownContainer: {
    width: '100%',
  },
  quizSection: {
    marginTop: scale(64),
    paddingBottom: scale(40),
    alignItems: 'center',
  },
  completeButtonWrapper: {
    marginTop: scale(64),
    marginBottom: scale(40),
    alignItems: 'center',
    width: '100%',
  },
  checkpointLine: {
    width: scale(80),
    height: scale(2),
    borderRadius: scale(1),
    marginBottom: scale(12),
  },
  checkpointText: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 2,
    marginBottom: scale(32),
    opacity: 0.5,
    textAlign: 'center',
  },
  pillContainer: {
    width: '100%',
    maxWidth: scale(340),
  },
  completeButton: {
    paddingVertical: scale(18),
    borderRadius: scale(36),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 15px 35px rgba(11, 111, 255, 0.3)',
      },
      default: {
        shadowColor: '#0b6fff',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 8,
      }
    })
  },
  completeButtonText: {
    fontSize: responsiveFontSize(16),
    letterSpacing: 0.5,
  },
});

export default LessonContent;
