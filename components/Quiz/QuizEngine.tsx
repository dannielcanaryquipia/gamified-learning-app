import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import OptionPill from './OptionPill';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';

export interface QuizQuestionData {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizEngineProps {
  questions: QuizQuestionData[];
  onComplete: (score: number) => void;
  xpReward: number;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ questions, onComplete, xpReward }) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    const passed = (score / questions.length) >= 0.7;
    return (
      <View style={[styles.resultsContainer, { backgroundColor: colors.surfaceContainerLow }]}>
        <LinearGradient
           colors={[passed ? colors.success : colors.error, 'transparent']}
           style={styles.resultsGlow}
        />
        <View style={[styles.resultIcon, { backgroundColor: passed ? colors.success + '20' : colors.error + '20' }]}>
           <MaterialIcons 
            name={passed ? 'verified' : 'error-outline'} 
            size={scale(48)} 
            color={passed ? colors.success : colors.error} 
           />
        </View>
        <Text style={[styles.resultsTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
          {passed ? 'Proficiency Confirmed' : 'Sync Failed'}
        </Text>
        <Text style={[styles.resultsDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
          {passed 
            ? `You have successfully archived the core directives for this sector.` 
            : `Core knowledge parity was not achieved. Re-examine the transmission and try again.`}
        </Text>
        
        <View style={styles.scoreBoard}>
           <View style={styles.scoreItem}>
              <Text style={[styles.scoreValue, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>{score}/{questions.length}</Text>
              <Text style={[styles.scoreLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>SCORE</Text>
           </View>
           <View style={[styles.statDivider, { backgroundColor: colors.surfaceContainerHighest }]} />
           <View style={styles.scoreItem}>
              <Text style={[styles.scoreValue, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>+{passed ? xpReward : 0}</Text>
              <Text style={[styles.scoreLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>XP EARNED</Text>
           </View>
        </View>

        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => onComplete(score)}
          style={styles.finalBtnWrapper}
        >
          <LinearGradient
            colors={passed ? [colors.success, colors.success] : [colors.primary, colors.primaryDim]}
            style={styles.finalBtn}
          >
            <Text style={[styles.finalBtnText, { color: 'white', fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {passed ? 'CLOSE TRANSMISSION' : 'RETRY EVALUATION'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Quiz Header */}
      <View style={styles.qHeader}>
         <View style={styles.qStatus}>
            <Text style={[styles.qCounter, { color: colors.primary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
               EVALUATION {currentIndex + 1}/{questions.length}
            </Text>
            <View style={[styles.qProgressBase, { backgroundColor: colors.surfaceContainerHighest }]}>
               <View 
                style={[
                  styles.qProgressFill, 
                  { backgroundColor: colors.primary, width: `${((currentIndex + 1) / questions.length) * 100}%` }
                ]} 
               />
            </View>
         </View>
      </View>

      <Text style={[styles.question, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
        {currentQuestion.question}
      </Text>

      <View style={styles.optionsList}>
        {currentQuestion.options.map((option, index) => (
          <OptionPill
            key={index}
            label={option}
            isSelected={selectedOption === index}
            isCorrect={isAnswered && index === currentQuestion.correctIndex}
            isWrong={isAnswered && selectedOption === index && index !== currentQuestion.correctIndex}
            onPress={() => handleSelect(index)}
            disabled={isAnswered}
          />
        ))}
      </View>

      {isAnswered && (
        <Animated.View style={styles.nextBtnWrapper}>
           <TouchableOpacity 
            onPress={nextQuestion}
            style={[styles.nextBtn, { backgroundColor: colors.primary }]}
           >
              <Text style={[styles.nextBtnText, { color: 'white', fontFamily: 'PlusJakartaSans_700Bold' }]}>
                {currentIndex < questions.length - 1 ? 'NEXT EVALUATION' : 'FINALIZE SYNC'}
              </Text>
              <MaterialIcons name="arrow-forward" size={scale(18)} color="white" />
           </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: scale(20),
  },
  qHeader: {
    marginBottom: scale(32),
  },
  qStatus: {
    gap: scale(12),
  },
  qCounter: {
    fontSize: responsiveFontSize(12),
    letterSpacing: 1.5,
  },
  qProgressBase: {
    height: scale(4),
    borderRadius: scale(2),
  },
  qProgressFill: {
    height: '100%',
    borderRadius: scale(2),
  },
  question: {
    fontSize: responsiveFontSize(22),
    lineHeight: responsiveFontSize(30),
    marginBottom: scale(32),
  },
  optionsList: {
    gap: scale(4),
  },
  nextBtnWrapper: {
    marginTop: scale(40),
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(18),
    borderRadius: scale(16),
    gap: scale(12),
  },
  nextBtnText: {
    fontSize: responsiveFontSize(14),
    letterSpacing: 0.5,
  },
  resultsContainer: {
    padding: scale(32),
    borderRadius: scale(32),
    alignItems: 'center',
    marginTop: scale(40),
    position: 'relative',
    overflow: 'hidden',
  },
  resultsGlow: {
    position: 'absolute',
    top: -scale(40),
    width: '120%',
    height: scale(200),
    opacity: 0.1,
  },
  resultIcon: {
    width: scale(96),
    height: scale(96),
    borderRadius: scale(48),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(24),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  resultsTitle: {
    fontSize: responsiveFontSize(24),
    textAlign: 'center',
    marginBottom: scale(16),
  },
  resultsDesc: {
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
    lineHeight: responsiveFontSize(22),
    opacity: 0.8,
    marginBottom: scale(32),
  },
  scoreBoard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(40),
    marginBottom: scale(48),
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: responsiveFontSize(20),
    marginBottom: scale(4),
  },
  scoreLabel: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 1,
    opacity: 0.5,
  },
  statDivider: {
    width: 1,
    height: scale(32),
  },
  finalBtnWrapper: {
    width: '100%',
  },
  finalBtn: {
    paddingVertical: scale(18),
    borderRadius: scale(16),
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }
    })
  },
  finalBtnText: {
    fontSize: responsiveFontSize(14),
    letterSpacing: 1,
  },
});

export default QuizEngine;
