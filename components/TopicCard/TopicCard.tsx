import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import Card from '../Card/Card';
import ProgressBar from '../ProgressBar/ProgressBar';

export interface TopicCardProps {
  id: string;
  title: string;
  category: string;
  icon: string;
  completedLessons: number;
  totalLessons: number;
  currentXp: number;
  isLocked: boolean;
  onPress?: (id: string) => void;
  featured?: boolean;
}

const TopicCard: React.FC<TopicCardProps> = ({
  id,
  title,
  category,
  icon,
  completedLessons,
  totalLessons,
  currentXp,
  isLocked,
  onPress,
  featured = false,
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) : 0;
  const isCompleted = completedLessons === totalLessons && totalLessons > 0;
  const router = useRouter();

  const handlePress = () => {
    if (isLocked) return;
    if (onPress) {
      onPress(id);
    } else {
      router.push({
        pathname: '/[topicId]/page',
        params: { topicId: id },
      } as any);
    }
  };

  return (
    <Card 
      onPress={handlePress}
      disabled={isLocked}
      variant="cosmic"
      style={[
        styles.container, 
        featured && styles.featuredCard,
        { 
          backgroundColor: featured ? colors.surfaceContainerHighest : colors.surfaceContainerLow,
          opacity: isLocked ? 0.6 : 1
        }
      ]}
    >
      <View style={styles.topicHeader}>
        <View style={styles.topicInfo}>
           <View style={styles.categoryRow}>
             <MaterialIcons name={icon as any || 'school'} size={scale(14)} color={isLocked ? colors.onSurfaceVariant : colors.primary} style={{ marginRight: scale(6) }} />
             <Text style={[styles.topicCategory, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>{category}</Text>
           </View>
           <Text style={[styles.topicTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>{title}</Text>
        </View>
        {isCompleted ? (
           <MaterialIcons name="verified" size={scale(24)} color={colors.success} />
        ) : isLocked ? (
           <MaterialIcons name="lock" size={scale(20)} color={colors.onSurfaceVariant} />
        ) : (
           <Text style={[styles.xpText, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>{currentXp} XP</Text>
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressTextContainer}>
          <Text style={[styles.progressText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
            {completedLessons}/{totalLessons} {featured ? 'MODULES' : ''}
          </Text>
          {isCompleted && !featured && <Text style={[styles.xpText, { color: colors.success, fontFamily: 'PlusJakartaSans_700Bold' }]}>COMPLETED</Text>}
        </View>
        <ProgressBar 
          progress={progress} 
          height={scale(4)}
          gradientColors={isCompleted ? [colors.success, colors.success] : [colors.primary, colors.primaryDim]}
          showLabel={false}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    borderRadius: scale(24),
    marginBottom: scale(16),
  },
  featuredCard: {
    width: scale(280),
    minHeight: scale(160),
    marginBottom: 0,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(24),
  },
  topicInfo: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  topicTitle: {
    fontSize: responsiveFontSize(18),
    lineHeight: responsiveFontSize(24),
  },
  topicCategory: {
    fontSize: responsiveFontSize(10),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressContainer: {
    gap: scale(10),
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 1,
    opacity: 0.7,
  },
  xpText: {
    fontSize: responsiveFontSize(12),
  },
});

export default TopicCard;
