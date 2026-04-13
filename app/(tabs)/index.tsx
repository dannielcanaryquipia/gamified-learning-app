import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/Card/Card';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import StreakRestoreModal from '../../components/StreakRestoreModal/StreakRestoreModal';
import PageContainer from '../../components/PageContainer/PageContainer';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { useApp } from '../../contexts/AppContext';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import { fetchTopics } from '../../services/mockData';
import { Topic } from '../../types';
import Skeleton from '../../components/Skeleton/Skeleton';

type Styles = {
  header: ViewStyle;
  greeting: TextStyle;
  subtitle: TextStyle;
  statsContainer: ViewStyle;
  statCard: ViewStyle;
  statValue: TextStyle;
  statLabel: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  card: ViewStyle;
  topicHeader: ViewStyle;
  topicInfo: ViewStyle;
  topicTitle: TextStyle;
  topicCategory: TextStyle;
  progressContainer: ViewStyle;
  progressTextContainer: ViewStyle;
  progressText: TextStyle;
  xpText: TextStyle;
  headerContent: ViewStyle;
  headerGlow: ViewStyle;
  missionLevelContainer: ViewStyle;
  levelBadge: ViewStyle;
  levelText: TextStyle;
  levelProgressWrapper: ViewStyle;
  subtitleContainer: ViewStyle;
  statusDot: ViewStyle;
};

const HomeScreen = () => {
  const { 
    isLoading, 
    userProgress, 
    refreshData,
    userProfile,
    streakData,
    updateStreak
  } = useApp();
  
  const [topics, setTopics] = useState<Topic[]>([]);
  
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const fetchedTopics = await fetchTopics();
        setTopics(fetchedTopics);
      } catch (error) {
        console.error('Failed to load topics:', error);
      }
    };
    
    loadTopics();
  }, []);
  
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  const router = useRouter();
  const inProgressTopics = topics.filter(topic => !topic.isLocked && topic.completedLessons < topic.totalLessons);
  
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  useEffect(() => {
    if (!isLoading) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (!streakData) {
        updateStreak().then(() => {
          setShowStreakModal(true);
        });
      } else {
        const lastActive = streakData.lastActiveDate ? new Date(streakData.lastActiveDate) : null;
        if (isFirstLoad || (lastActive && lastActive < today)) {
          setShowStreakModal(true);
        }
      }
      
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    }
  }, [isLoading, streakData, isFirstLoad, updateStreak]);

  const handleStreakRestore = useCallback(() => {
    updateStreak().finally(() => {
      setShowStreakModal(false);
    });
  }, [updateStreak]);

  const renderTopicCard = (topic: Topic) => {
    const progress = topic.totalLessons > 0 ? (topic.completedLessons / topic.totalLessons) : 0;
    const isCompleted = topic.completedLessons === topic.totalLessons;

    const handlePress = () => {
      router.push({
        pathname: '/[topicId]/page',
        params: { topicId: topic.id },
      } as any);
    };

    return (
      <Card 
        key={topic.id} 
        style={styles.card}
        onPress={handlePress}
        variant="elevated"
      >
        <View style={styles.topicHeader}>
          <View style={styles.topicInfo}>
            <Text style={[styles.topicTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>{topic.title}</Text>
            <Text style={[styles.topicCategory, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>{topic.category}</Text>
          </View>
          {isCompleted && (
            <MaterialIcons 
              name="check-circle" 
              size={scale(24)} 
              color={colors.success} 
            />
          )}
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
              {topic.completedLessons} of {topic.totalLessons} lessons
            </Text>
            <Text style={[styles.xpText, { color: colors.primary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {topic.currentXp}/{topic.totalXp} XP
            </Text>
          </View>
          <ProgressBar 
            progress={progress} 
            height={scale(6)}
            gradientColors={isCompleted ? [colors.success, colors.success] : [colors.primary, colors.primaryDim]}
            showLabel={false}
          />
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <PageContainer contentContainerStyle={{ paddingVertical: scale(32) }}>
        <View style={styles.header}>
          <Skeleton width={scale(200)} height={scale(32)} style={{ marginBottom: scale(8) }} />
          <Skeleton width={scale(150)} height={scale(16)} />
        </View>

        <View style={styles.statsContainer}>
          {[1, 2, 3].map((i) => (
            <Skeleton 
              key={i}
              style={styles.statCard} 
              height={scale(80)} 
              borderRadius={scale(12)} 
            />
          ))}
        </View>

        {[1, 2].map((section) => (
          <View key={section} style={styles.section}>
            <Skeleton width={scale(140)} height={scale(24)} style={{ marginBottom: scale(16) }} />
            {[1, 2].map((card) => (
              <Skeleton 
                key={card}
                style={styles.card} 
                height={scale(120)} 
                borderRadius={scale(12)} 
              />
            ))}
          </View>
        ))}
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer
        contentContainerStyle={{ paddingVertical: scale(32) }}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={refreshData}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <LinearGradient
            colors={[isDark ? 'rgba(139, 172, 255, 0.12)' : 'rgba(0, 108, 251, 0.08)', 'transparent']}
            style={styles.headerGlow}
          />
          <View style={styles.headerContent}>
            <Text style={[styles.greeting, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
              Hello, {userProfile?.name || 'Learner'}! 👋
            </Text>
            <View style={styles.missionLevelContainer}>
              <View style={[styles.levelBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.levelText, { color: colors.onPrimary || '#FFF', fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
                  LVL {Math.floor((userProgress?.totalXP || 0) / 1000) + 1}
                </Text>
              </View>
              <View style={styles.levelProgressWrapper}>
                <ProgressBar 
                  progress={((userProgress?.totalXP || 0) % 1000) / 1000} 
                  height={scale(6)}
                  gradientColors={[colors.primary, colors.primaryDim]}
                  showLabel={false}
                />
              </View>
            </View>
            <View style={styles.subtitleContainer}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={{ ...styles.subtitle, color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }}>
                {userProgress?.topicsCompleted} of {userProgress?.totalTopics} topics archived
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Card variant="filled" style={StyleSheet.flatten([styles.statCard, { backgroundColor: colors.surfaceContainer }])}>
            <Text style={[styles.statValue, { color: colors.primary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {userProgress?.topicsCompleted || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>Topics</Text>
          </Card>
          
          <Card variant="filled" style={StyleSheet.flatten([styles.statCard, { backgroundColor: colors.surfaceContainer }])}>
            <Text style={[styles.statValue, { color: colors.primary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {userProgress?.totalXP || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>XP</Text>
          </Card>
          
          <Card variant="filled" style={StyleSheet.flatten([styles.statCard, { backgroundColor: colors.surfaceContainerHigh }])}>
            <Text style={[styles.statValue, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {streakData?.currentStreak || 0} 🔥
            </Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>Streak</Text>
          </Card>
        </View>

        {inProgressTopics.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              Continue Mission
            </Text>
            {inProgressTopics.map(renderTopicCard)}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
            {inProgressTopics.length > 0 ? 'Archive Library' : 'Available Knowledge'}
          </Text>
          {topics
            .filter(topic => !topic.isLocked)
            .map(renderTopicCard)}
        </View>
      </PageContainer>

      <StreakRestoreModal
        isVisible={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        onRestore={handleStreakRestore}
        streakCount={streakData?.currentStreak || 1}
        isDark={isDark}
      />
    </>
  );
};

const styles = StyleSheet.create<Styles>({
  header: {
    marginBottom: scale(32),
    paddingHorizontal: scale(4),
    position: 'relative',
    paddingVertical: scale(20),
    minHeight: scale(160),
  },
  headerGlow: {
    ...StyleSheet.absoluteFillObject,
    height: scale(250),
    top: -scale(80),
    left: -scale(60),
    right: -scale(60),
    opacity: 0.8,
  },
  headerContent: {
    zIndex: 2,
  },
  greeting: {
    fontSize: responsiveFontSize(36),
    letterSpacing: -1.5,
    marginBottom: scale(12),
  },
  missionLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
    gap: scale(12),
  },
  levelBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: responsiveFontSize(12),
    letterSpacing: 0.5,
  },
  levelProgressWrapper: {
    flex: 1,
    maxWidth: scale(180),
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginRight: scale(8),
  },
  subtitle: {
    fontSize: responsiveFontSize(14),
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(40),
  },
  statCard: {
    flex: 1,
    marginHorizontal: scale(4),
    padding: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: responsiveFontSize(24),
    marginBottom: scale(2),
  },
  statLabel: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: scale(32),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    marginBottom: scale(16),
    paddingHorizontal: scale(4),
  },
  card: {
    marginBottom: scale(16),
    padding: scale(20),
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: responsiveFontSize(17),
    marginBottom: scale(2),
  },
  topicCategory: {
    fontSize: responsiveFontSize(13),
  },
  progressContainer: {
    marginTop: scale(8),
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(10),
  },
  progressText: {
    fontSize: responsiveFontSize(12),
  },
  xpText: {
    fontSize: responsiveFontSize(12),
  },
});

export default HomeScreen;