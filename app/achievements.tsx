import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BackButton from '../components/BackButton/BackButton';
import PageContainer from '../components/PageContainer/PageContainer';
import Skeleton from '../components/Skeleton/Skeleton';
import { responsiveFontSize, scale } from '../constants/responsive';
import { getThemeColors, useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { useFocusCleanup } from '../hooks/useFocusCleanup';
import { evaluateAchievements, getAchievementStats, EvaluationState } from '../services/achievementEngine';
import { Achievement } from '../types';

const AchievementsScreen = () => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const router = useRouter();
  const { userProgress, topics, streakData } = useApp();
  useFocusCleanup();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const evaluate = async () => {
        try {
          setIsLoading(true);
          const state: EvaluationState = {
            progress: userProgress || {
              totalXP: 0, streak: 0, topicsCompleted: 0,
              totalTopics: 0, lessonsCompleted: 0, quizzesPassed: 0,
              perfectQuizzes: 0, totalLessons: 0,
            },
            streakCurrent: streakData?.currentStreak || 0,
            streakLongest: streakData?.longestStreak || 0,
            topicsData: topics.map(t => ({
              id: t.id,
              completedLessons: t.completedLessons,
              totalLessons: t.totalLessons,
            })),
          };
          const { achievements: results } = await evaluateAchievements(state);
          setAchievements(results);
        } catch (error) {
          console.error('Error evaluating achievements:', error);
        } finally {
          setIsLoading(false);
        }
      };
      evaluate();
    }, [userProgress, topics, streakData])
  );

  const stats = getAchievementStats(achievements);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'Common': return colors.onSurfaceVariant;
      case 'Rare': return colors.primary;
      case 'Epic': return colors.tertiary;
      case 'Legendary': return colors.secondary;
      case 'Artifact': return '#FFD700';
      default: return colors.onSurfaceVariant;
    }
  };

  const renderBadge = (item: Achievement) => {
    const rarityColor = getRarityColor(item.rarity);
    
    return (
      <View key={item.id} style={[styles.badgeCard, { backgroundColor: colors.surfaceContainerLow }]}>
        {!item.unlocked && <View style={[styles.lockOverlay, { backgroundColor: colors.surface + 'CC' }]} />}
        
        <View style={[styles.badgeIconWrapper, { backgroundColor: item.unlocked ? rarityColor + '15' : colors.surfaceContainerHighest }]}>
           <MaterialIcons 
            name={item.unlocked ? (item.icon as any) : 'lock-outline'} 
            size={scale(32)} 
            color={item.unlocked ? rarityColor : colors.onSurfaceVariant} 
           />
           {item.unlocked && <View style={[styles.badgeGlow, { backgroundColor: rarityColor }]} />}
        </View>

        <View style={styles.badgeInfo}>
           <View style={styles.badgeHeader}>
              <Text style={[styles.badgeRarity, { color: rarityColor, fontFamily: 'Manrope_800ExtraBold' }]}>
                {item.rarity.toUpperCase()}
              </Text>
              {item.unlocked && item.date && (
                <Text style={[styles.badgeDate, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
                  {item.date}
                </Text>
              )}
           </View>
           <Text style={[styles.badgeTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
             {item.title}
           </Text>
           <Text style={[styles.badgeDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]} numberOfLines={2}>
             {item.description}
           </Text>
           {!item.unlocked && (
             <Text style={[styles.conditionText, { color: colors.primary, fontFamily: 'Manrope_600SemiBold' }]}>
               🎯 {item.condition}
             </Text>
           )}
        </View>

        {!item.unlocked && (
          <View style={styles.lockIndicator}>
             <MaterialIcons name="lock" size={scale(12)} color={colors.onSurfaceVariant} />
             <Text style={[styles.lockText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>LOCKED</Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <PageContainer scrollable={true} contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <BackButton variant="circle" onPress={() => router.back()} />
            <View style={styles.headerTitles}>
              <Skeleton width={scale(180)} height={scale(14)} style={{ marginBottom: scale(8) }} />
              <Skeleton width={scale(200)} height={scale(32)} />
            </View>
          </View>
          <Skeleton width="100%" height={scale(80)} borderRadius={scale(24)} style={{ marginBottom: scale(40) }} />
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} width="100%" height={scale(100)} borderRadius={scale(28)} style={{ marginBottom: scale(16) }} />
          ))}
        </PageContainer>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Decorative Background */}
      <View style={[styles.bgCircle, { backgroundColor: colors.primary + '08', top: -scale(100), left: -scale(50) }]} />
      <View style={[styles.bgCircle, { backgroundColor: colors.tertiary + '05', bottom: -scale(50), right: -scale(100), width: scale(400), height: scale(400) }]} />

      <PageContainer scrollable={true} contentContainerStyle={styles.container}>
        <View style={styles.header}>
           <BackButton variant="circle" onPress={() => router.back()} />
           <View style={styles.headerTitles}>
             <Text style={[styles.overTitle, { color: colors.primary, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>ARCHIVE COLLECTION</Text>
             <Text style={[styles.title, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>Achievements</Text>
           </View>
        </View>

        <View style={[styles.statsRow, { backgroundColor: colors.surfaceContainerLow }]}>
           <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>{stats.unlocked}/{stats.total}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>COLLECTED</Text>
           </View>
           <View style={[styles.statDivider, { backgroundColor: colors.surfaceContainerHighest }]} />
           <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>{stats.percentage}%</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>SYNC PROGRESS</Text>
           </View>
        </View>

        <View style={styles.badgesGrid}>
           {achievements.map(renderBadge)}
        </View>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: scale(60),
  },
  bgCircle: {
    position: 'absolute',
    width: scale(300),
    height: scale(300),
    borderRadius: scale(150),
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(20),
    marginBottom: scale(40),
    gap: scale(20),
  },
  headerTitles: {
    flex: 1,
  },
  overTitle: {
    fontSize: responsiveFontSize(11),
    letterSpacing: 2,
    marginBottom: scale(4),
  },
  title: {
    fontSize: responsiveFontSize(32),
  },
  statsRow: {
    flexDirection: 'row',
    padding: scale(24),
    borderRadius: scale(24),
    marginBottom: scale(40),
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: responsiveFontSize(20),
    marginBottom: scale(4),
  },
  statLabel: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 1,
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    height: scale(32),
  },
  badgesGrid: {
    gap: scale(16),
  },
  badgeCard: {
    flexDirection: 'row',
    padding: scale(20),
    borderRadius: scale(28),
    alignItems: 'center',
    gap: scale(20),
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    opacity: 0.4,
  },
  badgeIconWrapper: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: scale(24),
    opacity: 0.2,
    zIndex: -1,
  },
  badgeInfo: {
    flex: 1,
    zIndex: 2,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  badgeRarity: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 1,
  },
  badgeDate: {
    fontSize: responsiveFontSize(9),
    opacity: 0.5,
  },
  badgeTitle: {
    fontSize: responsiveFontSize(18),
    marginBottom: scale(6),
  },
  badgeDesc: {
    fontSize: responsiveFontSize(13),
    lineHeight: responsiveFontSize(18),
    opacity: 0.7,
  },
  conditionText: {
    fontSize: responsiveFontSize(11),
    marginTop: scale(6),
    opacity: 0.8,
  },
  lockIndicator: {
    position: 'absolute',
    right: scale(20),
    bottom: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    opacity: 0.5,
  },
  lockText: {
    fontSize: responsiveFontSize(9),
    letterSpacing: 1,
  },
});

export default AchievementsScreen;
