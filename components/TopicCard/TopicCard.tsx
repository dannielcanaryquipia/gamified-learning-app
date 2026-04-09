import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

export interface TopicCardProps {
  id: string;
  title: string;
  category: string;
  icon: string;
  completedLessons: number;
  totalLessons: number;
  xp: number;
  isLocked: boolean;
  onPress?: (id: string) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  id,
  title,
  category,
  icon,
  completedLessons,
  totalLessons,
  xp,
  isLocked,
  onPress,
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const router = useRouter();

  const handlePress = () => {
    if (isLocked) return;
    if (onPress) {
      onPress(id);
    } else {
      router.push({
        pathname: `/${id}/page`,
        params: {},
      } as any);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        { 
          backgroundColor: isLocked ? colors.disabled + '20' : colors.card,
          borderColor: colors.border
        },
        isLocked && styles.lockedContainer
      ]}
      onPress={handlePress}
      disabled={isLocked}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: isLocked ? colors.disabled + '40' : colors.primary + '15' }]}>
          <MaterialIcons 
            name={icon as any || 'school'} 
            size={scale(24)} 
            color={isLocked ? colors.placeholder : colors.primary} 
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: isLocked ? colors.placeholder : colors.text }]}>{title}</Text>
          <Text style={[styles.category, { color: isLocked ? colors.placeholder : colors.placeholder }]}>{category}</Text>
        </View>
        {isLocked && (
          <MaterialIcons 
            name="lock" 
            size={scale(20)} 
            color={colors.placeholder} 
            style={styles.lockIcon}
          />
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progress}%`,
                backgroundColor: isLocked ? colors.disabled : colors.primary
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.placeholder }]}>
          {completedLessons}/{totalLessons} lessons
        </Text>
      </View>
      
      <View style={styles.footer}>
        <View style={[styles.xpBadge, { backgroundColor: isLocked ? colors.disabled + '20' : colors.secondary + '15' }]}>
          <Text style={[styles.xpText, { color: isLocked ? colors.placeholder : colors.secondary }]}>{xp} XP</Text>
        </View>
        {!isLocked && (
          <MaterialIcons 
            name="chevron-right" 
            size={scale(24)} 
            color={colors.primary} 
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(16),
    borderWidth: 1,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(2) },
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
        elevation: 3,
      },
    }),
  },
  lockedContainer: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  iconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: responsiveFontSize(18),
    fontWeight: '700',
    marginBottom: scale(2),
  },
  category: {
    fontSize: responsiveFontSize(12),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressContainer: {
    marginBottom: scale(16),
  },
  progressBar: {
    height: scale(8),
    borderRadius: scale(4),
    marginBottom: scale(6),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: scale(4),
  },
  progressText: {
    fontSize: responsiveFontSize(13),
    fontWeight: '500',
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(20),
  },
  xpText: {
    fontSize: responsiveFontSize(13),
    fontWeight: '700',
  },
  lockIcon: {
    marginLeft: scale(8),
  },
});

export default TopicCard;
