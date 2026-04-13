import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PageContainer from '../../components/PageContainer/PageContainer';
import Card from '../../components/Card/Card';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

const MissionsScreen = () => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const missions = [
    {
      id: '1',
      title: 'Networking Novice',
      description: 'Complete 3 lessons in Internet Basics',
      progress: 0.66,
      reward: '500 XP',
      icon: 'public',
      isHot: true,
    },
    {
      id: '2',
      title: 'Code Cracker',
      description: 'Finish your first Programming module',
      progress: 0.25,
      reward: '800 XP',
      icon: 'terminal',
      isHot: false,
    },
    {
      id: '3',
      title: 'Archive Specialist',
      description: 'Archive 2 total topics',
      progress: 0.5,
      reward: '1200 XP',
      icon: 'layers',
      isHot: false,
    },
  ];

  const dailyQuests = [
    { id: 'd1', title: 'Daily Review', xp: 50, completed: true },
    { id: 'd2', title: 'Perfect Quiz', xp: 100, completed: false },
    { id: 'd3', title: 'Speed Reader', xp: 75, completed: false },
  ];

  return (
    <PageContainer contentContainerStyle={{ paddingVertical: scale(32), paddingBottom: scale(100) }}>
      {/* Editorial Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
          Mission{"\n"}Directives
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
          Current assignments from the central archive.
        </Text>
      </View>

      {/* Daily Directive Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>Daily Directives</Text>
          <View style={[styles.timerBadge, { backgroundColor: colors.surfaceContainerHighest }]}>
             <MaterialIcons name="schedule" size={scale(12)} color={colors.primary} />
             <Text style={[styles.timerText, { color: colors.primary, fontFamily: 'PlusJakartaSans_700Bold' }]}>14H REMAINING</Text>
          </View>
        </View>
        <View style={styles.dailyGrid}>
          {dailyQuests.map((quest) => (
            <View 
              key={quest.id} 
              style={[
                styles.dailyItem, 
                { backgroundColor: colors.surfaceContainerLow },
                quest.completed && { opacity: 0.6 }
              ]}
            >
              <View style={[styles.dailyIcon, { backgroundColor: quest.completed ? colors.success + '20' : colors.surfaceContainer }]}>
                <MaterialIcons 
                  name={quest.completed ? 'check' : 'radio-button-unchecked'} 
                  size={scale(18)} 
                  color={quest.completed ? colors.success : colors.onSurfaceVariant} 
                />
              </View>
              <Text style={[styles.dailyTitle, { color: colors.onSurface, fontFamily: 'Manrope_600SemiBold' }]}>{quest.title}</Text>
              <Text style={[styles.dailyXP, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>+{quest.xp} XP</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Active Missions - Weighted Cards */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold', marginBottom: scale(20) }]}>
          Active Assignments
        </Text>
        <View style={styles.missionList}>
          {missions.map((mission) => (
            <Card 
              key={mission.id} 
              variant="cosmic" 
              style={[styles.missionCard, { backgroundColor: colors.surfaceContainerLow }]}
            >
              <View style={styles.missionHeader}>
                <View style={[styles.missionIcon, { backgroundColor: colors.surfaceContainerHighest }]}>
                  <MaterialIcons name={mission.icon as any} size={scale(24)} color={colors.primary} />
                </View>
                <View style={styles.missionInfo}>
                  <Text style={[styles.missionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>{mission.title}</Text>
                  <Text style={[styles.missionDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>{mission.description}</Text>
                </View>
                {mission.isHot && (
                   <View style={[styles.hotBadge, { backgroundColor: colors.tertiary + '20' }]}>
                      <MaterialIcons name="whatshot" size={scale(14)} color={colors.tertiary} />
                   </View>
                )}
              </View>
              
              <View style={styles.missionProgress}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>PROGRESS</Text>
                  <Text style={[styles.progressValue, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>{Math.round(mission.progress * 100)}%</Text>
                </View>
                <ProgressBar 
                  progress={mission.progress} 
                  height={scale(6)}
                  gradientColors={[colors.primary, colors.primaryDim]}
                  showLabel={false}
                />
              </View>
              
              <View style={styles.missionFooter}>
                <Text style={[styles.rewardLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>REWARD</Text>
                <Text style={[styles.rewardValue, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>{mission.reward}</Text>
              </View>
            </Card>
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
    maxWidth: '80%',
    lineHeight: responsiveFontSize(20),
  },
  section: {
    marginBottom: scale(48),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(20),
    paddingHorizontal: scale(4),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20),
    letterSpacing: -0.5,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(8),
    gap: scale(6),
  },
  timerText: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 0.5,
  },
  dailyGrid: {
    gap: scale(12),
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(16),
  },
  dailyIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  dailyTitle: {
    flex: 1,
    fontSize: responsiveFontSize(14),
  },
  dailyXP: {
    fontSize: responsiveFontSize(12),
  },
  missionList: {
    gap: scale(16),
  },
  missionCard: {
    padding: scale(24),
    borderRadius: scale(24),
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scale(24),
  },
  missionIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: responsiveFontSize(16),
    marginBottom: scale(4),
  },
  missionDesc: {
    fontSize: responsiveFontSize(12),
    lineHeight: responsiveFontSize(18),
    opacity: 0.7,
  },
  hotBadge: {
    padding: scale(6),
    borderRadius: scale(8),
  },
  missionProgress: {
    gap: scale(10),
    marginBottom: scale(20),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: responsiveFontSize(9),
    letterSpacing: 1,
    opacity: 0.5,
  },
  progressValue: {
    fontSize: responsiveFontSize(12),
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: scale(16),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  rewardLabel: {
    fontSize: responsiveFontSize(9),
    letterSpacing: 1,
    opacity: 0.5,
  },
  rewardValue: {
    fontSize: responsiveFontSize(14),
  },
});

export default MissionsScreen;
