import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PageContainer from '../../components/PageContainer/PageContainer';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { useFocusEffect, useRouter } from 'expo-router';

interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  xpReward: number;
  type: 'lesson' | 'quiz' | 'streak' | 'review' | 'explore';
  progress: number;
  target: number;
  isCompleted: boolean;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  xpReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  target: number;
  isCompleted: boolean;
  topicId?: string;
}

const MissionsScreen = () => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const { userProgress, topics, streakData } = useApp();
  const router = useRouter();
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);

  // ─── Dynamic Quest Generator ──────────────────────────────────────────
  const generateDailyQuests = useCallback(() => {
    const quests: DailyQuest[] = [];
    const lessonsCompleted = userProgress?.lessonsCompleted || 0;
    const currentStreak = streakData?.currentStreak || 0;

    // Quest 1: Complete a lesson today
    quests.push({
      id: 'daily-lesson',
      title: 'Complete a Module',
      description: 'Finish any learning module today',
      icon: 'menu-book',
      xpReward: 25,
      type: 'lesson',
      progress: Math.min(lessonsCompleted > 0 ? 1 : 0, 1),
      target: 1,
      isCompleted: lessonsCompleted > 0,
    });

    // Quest 2: Pass a quiz
    const quizzesPassed = userProgress?.quizzesPassed || 0;
    quests.push({
      id: 'daily-quiz',
      title: 'Pass an Evaluation',
      description: 'Score above the threshold on any quiz',
      icon: 'quiz',
      xpReward: 30,
      type: 'quiz',
      progress: Math.min(quizzesPassed, 1),
      target: 1,
      isCompleted: quizzesPassed > 0,
    });

    // Quest 3: Maintain streak
    quests.push({
      id: 'daily-streak',
      title: 'Keep the Streak',
      description: `Maintain your ${currentStreak > 0 ? currentStreak + '-day' : ''} streak`,
      icon: 'whatshot',
      xpReward: 15,
      type: 'streak',
      progress: currentStreak > 0 ? 1 : 0,
      target: 1,
      isCompleted: currentStreak > 0,
    });

    // Quest 4: Explore a new topic (only if not all explored)
    const topicsStarted = topics.filter(t => t.completedLessons > 0).length;
    if (topicsStarted < topics.length) {
      quests.push({
        id: 'daily-explore',
        title: 'Explore New Territory',
        description: 'Start a topic you haven\'t tried yet',
        icon: 'explore',
        xpReward: 20,
        type: 'explore',
        progress: topicsStarted,
        target: topicsStarted + 1,
        isCompleted: false,
      });
    }

    setDailyQuests(quests);
  }, [userProgress, topics, streakData]);

  // ─── Dynamic Mission Generator ────────────────────────────────────────
  const generateMissions = useCallback(() => {
    const allMissions: Mission[] = [];

    // Per-topic mastery missions
    topics.forEach(topic => {
      allMissions.push({
        id: `master-${topic.id}`,
        title: `Master ${topic.title}`,
        description: `Complete all ${topic.totalLessons} modules in ${topic.title}`,
        icon: 'auto-awesome',
        xpReward: topic.totalXp,
        difficulty: topic.totalLessons >= 3 ? 'Hard' : 'Medium',
        progress: topic.completedLessons,
        target: topic.totalLessons,
        isCompleted: topic.completedLessons === topic.totalLessons,
        topicId: topic.id,
      });
    });

    // XP milestone missions
    const xp = userProgress?.totalXP || 0;
    const milestones = [
      { id: 'xp-100', target: 100, xp: 50, title: 'Emerging Scholar', diff: 'Easy' as const },
      { id: 'xp-300', target: 300, xp: 100, title: 'Rising Adept', diff: 'Medium' as const },
      { id: 'xp-500', target: 500, xp: 150, title: 'Archive Initiate', diff: 'Medium' as const },
      { id: 'xp-1000', target: 1000, xp: 250, title: 'Cosmic Scholar', diff: 'Hard' as const },
    ];

    milestones.forEach(m => {
      allMissions.push({
        id: m.id,
        title: m.title,
        description: `Accumulate ${m.target} total XP`,
        icon: 'military-tech',
        xpReward: m.xp,
        difficulty: m.diff,
        progress: Math.min(xp, m.target),
        target: m.target,
        isCompleted: xp >= m.target,
      });
    });

    // Streak mission
    const streak = streakData?.currentStreak || 0;
    allMissions.push({
      id: 'streak-7',
      title: 'Week of Dedication',
      description: 'Maintain a 7-day learning streak',
      icon: 'local-fire-department',
      xpReward: 100,
      difficulty: 'Hard',
      progress: Math.min(streak, 7),
      target: 7,
      isCompleted: streak >= 7,
    });

    setMissions(allMissions);
  }, [userProgress, topics, streakData]);

  useFocusEffect(
    useCallback(() => {
      generateDailyQuests();
      generateMissions();
    }, [generateDailyQuests, generateMissions])
  );

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return colors.success;
      case 'Medium': return colors.tertiary;
      case 'Hard': return colors.error;
      default: return colors.onSurfaceVariant;
    }
  };

  // ─── Time remaining until midnight ────────────────────────────────────
  const getTimeRemaining = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const completedDailies = dailyQuests.filter(q => q.isCompleted).length;
  const completedMissions = missions.filter(m => m.isCompleted).length;

  return (
    <PageContainer contentContainerStyle={{ paddingVertical: scale(32), paddingBottom: scale(120) }}>
      {/* Atmospheric Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[isDark ? 'rgba(255, 113, 108, 0.12)' : 'rgba(255, 59, 48, 0.08)', 'transparent']}
          style={styles.headerGlow}
        />
        <Text style={[styles.headerTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
          Mission{"\n"}Directives
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
          Complete daily objectives and long-range missions to earn bonus XP.
        </Text>
      </View>

      {/* Daily Quests Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              Daily Objectives
            </Text>
            <Text style={[styles.sectionMeta, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
              {completedDailies}/{dailyQuests.length} completed • Resets in {getTimeRemaining()}
            </Text>
          </View>
          <View style={[styles.timerBadge, { backgroundColor: colors.error + '15' }]}>
            <MaterialIcons name="schedule" size={scale(14)} color={colors.error} />
            <Text style={[styles.timerText, { color: colors.error, fontFamily: 'Manrope_700Bold' }]}>
              {getTimeRemaining()}
            </Text>
          </View>
        </View>

        <View style={styles.questList}>
          {dailyQuests.map(quest => (
            <View key={quest.id} style={[styles.questCard, { backgroundColor: colors.surfaceContainerLow }]}>
              <View style={[
                styles.questIcon,
                { backgroundColor: quest.isCompleted ? colors.success + '15' : colors.surfaceContainerHighest }
              ]}>
                <MaterialIcons
                  name={quest.isCompleted ? 'check-circle' : quest.icon}
                  size={scale(24)}
                  color={quest.isCompleted ? colors.success : colors.primary}
                />
              </View>

              <View style={styles.questInfo}>
                <Text style={[
                  styles.questTitle,
                  { color: quest.isCompleted ? colors.success : colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' },
                  quest.isCompleted && styles.completedText,
                ]}>
                  {quest.title}
                </Text>
                <Text style={[styles.questDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
                  {quest.description}
                </Text>

                {/* Progress Bar */}
                <View style={[styles.progressBase, { backgroundColor: colors.surfaceContainerHighest }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: quest.isCompleted ? colors.success : colors.primary,
                        width: `${quest.target > 0 ? Math.min((quest.progress / quest.target) * 100, 100) : 0}%`
                      }
                    ]}
                  />
                </View>
              </View>

              <View style={[styles.xpBadge, { backgroundColor: colors.tertiary + '15' }]}>
                <Text style={[styles.xpText, { color: colors.tertiary, fontFamily: 'Manrope_800ExtraBold' }]}>
                  +{quest.xpReward}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Active Missions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              Active Missions
            </Text>
            <Text style={[styles.sectionMeta, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
              {completedMissions}/{missions.length} completed
            </Text>
          </View>
        </View>

        <View style={styles.missionList}>
          {missions.map(mission => (
            <TouchableOpacity
              key={mission.id}
              style={[styles.missionCard, { backgroundColor: colors.surfaceContainerLow }]}
              onPress={mission.topicId ? () => router.push(`/${mission.topicId}/page`) : undefined}
              activeOpacity={mission.topicId ? 0.7 : 1}
            >
              <View style={styles.missionTop}>
                <View style={[
                  styles.missionIcon,
                  { backgroundColor: mission.isCompleted ? colors.success + '15' : colors.surfaceContainerHighest }
                ]}>
                  <MaterialIcons
                    name={mission.isCompleted ? 'verified' : mission.icon}
                    size={scale(20)}
                    color={mission.isCompleted ? colors.success : colors.primary}
                  />
                </View>

                <View style={styles.missionInfo}>
                  <Text style={[
                    styles.missionTitle,
                    { color: mission.isCompleted ? colors.success : colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' },
                    mission.isCompleted && styles.completedText,
                  ]}>
                    {mission.title}
                  </Text>
                  <Text style={[styles.missionDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
                    {mission.description}
                  </Text>
                </View>

                <View style={styles.missionBadges}>
                  <View style={[styles.diffBadge, { backgroundColor: getDifficultyColor(mission.difficulty) + '15' }]}>
                    <Text style={[styles.diffText, { color: getDifficultyColor(mission.difficulty), fontFamily: 'Manrope_700Bold' }]}>
                      {mission.difficulty.toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.xpBadge, { backgroundColor: colors.tertiary + '15' }]}>
                    <Text style={[styles.xpText, { color: colors.tertiary, fontFamily: 'Manrope_800ExtraBold' }]}>
                      +{mission.xpReward}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Mission Progress */}
              <View style={styles.missionProgressRow}>
                <View style={[styles.progressBase, styles.missionProgressBase, { backgroundColor: colors.surfaceContainerHighest }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: mission.isCompleted ? colors.success : colors.primary,
                        width: `${mission.target > 0 ? Math.min((mission.progress / mission.target) * 100, 100) : 0}%`
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.missionProgressText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
                  {mission.progress}/{mission.target}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: scale(40),
    paddingHorizontal: scale(4),
    position: 'relative',
  },
  headerGlow: {
    position: 'absolute',
    top: -scale(80),
    left: -scale(50),
    right: -scale(50),
    height: scale(300),
    opacity: 0.8,
  },
  headerTitle: {
    fontSize: responsiveFontSize(42),
    lineHeight: responsiveFontSize(46),
    letterSpacing: -1.5,
    marginBottom: scale(12),
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(14),
    opacity: 0.7,
    maxWidth: '85%',
    lineHeight: responsiveFontSize(20),
  },
  section: {
    marginBottom: scale(40),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(20),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    marginBottom: scale(4),
  },
  sectionMeta: {
    fontSize: responsiveFontSize(11),
    opacity: 0.5,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(12),
  },
  timerText: {
    fontSize: responsiveFontSize(11),
  },
  questList: {
    gap: scale(12),
  },
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(20),
    gap: scale(16),
  },
  questIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: responsiveFontSize(14),
    marginBottom: scale(2),
  },
  questDesc: {
    fontSize: responsiveFontSize(11),
    opacity: 0.6,
    marginBottom: scale(8),
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  progressBase: {
    height: scale(4),
    borderRadius: scale(2),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: scale(2),
  },
  xpBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(10),
  },
  xpText: {
    fontSize: responsiveFontSize(11),
  },
  missionList: {
    gap: scale(14),
  },
  missionCard: {
    padding: scale(20),
    borderRadius: scale(24),
    gap: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  missionTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(16),
  },
  missionIcon: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(2),
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: responsiveFontSize(15),
    marginBottom: scale(4),
  },
  missionDesc: {
    fontSize: responsiveFontSize(12),
    opacity: 0.6,
    lineHeight: responsiveFontSize(18),
  },
  missionBadges: {
    alignItems: 'flex-end',
    gap: scale(6),
  },
  diffBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
    borderRadius: scale(8),
  },
  diffText: {
    fontSize: responsiveFontSize(9),
    letterSpacing: 0.5,
  },
  missionProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  missionProgressBase: {
    flex: 1,
  },
  missionProgressText: {
    fontSize: responsiveFontSize(11),
    opacity: 0.5,
    minWidth: scale(40),
    textAlign: 'right',
  },
});

export default MissionsScreen;
