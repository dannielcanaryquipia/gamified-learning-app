import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
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
      
      // For new users or first time, show the popup
      if (!streakData) {
        // Initialize streak data for new users
        updateStreak().then(() => {
          setShowStreakModal(true);
        });
      } else {
        const lastActive = streakData.lastActiveDate ? new Date(streakData.lastActiveDate) : null;
        // Show modal if it's a new day or first load
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
      console.log(`Home: Navigating to topic ${topic.id}`);
      // Navigate to the dynamic topic page
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
            <Text style={[styles.topicTitle, { color: colors.text }]}>{topic.title}</Text>
            <Text style={[styles.topicCategory, { color: colors.text }]}>{topic.category}</Text>
          </View>
          {isCompleted && (
            <MaterialIcons 
              name="check-circle" 
              size={scale(24)} 
              color="#4CAF50" 
            />
          )}
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressText, { color: colors.text }]}>
              {topic.completedLessons} of {topic.totalLessons} lessons
            </Text>
            <Text style={[styles.xpText, { color: colors.primary }]}>
              {topic.currentXp}/{topic.totalXp} XP
            </Text>
          </View>
          <ProgressBar 
            progress={progress} 
            height={scale(8)}
            color={isCompleted ? '#4CAF50' : colors.primary}
            showLabel={false}
          />
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <PageContainer contentContainerStyle={{ paddingVertical: scale(24) }}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <Skeleton width={scale(200)} height={scale(32)} style={{ marginBottom: scale(8) }} />
          <Skeleton width={scale(150)} height={scale(16)} />
        </View>

        {/* Stats Skeleton */}
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

        {/* Sections Skeleton */}
        {[1, 2].map((section) => (
          <View key={section} style={styles.section}>
            <Skeleton width={scale(140)} height={scale(24)} style={{ marginBottom: scale(16) }} />
            {[1, 2].map((card) => (
              <Skeleton 
                key={card}
                style={styles.card} 
                height={scale(120)} 
                borderRadius={scale(16)} 
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
        contentContainerStyle={{ paddingVertical: scale(24) }}
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
          <Text style={[styles.greeting, { color: colors.text }]}>
            Hello, {userProfile?.name || 'Learner'}! 👋
          </Text>
          <Text style={{ ...styles.subtitle, color: colors.text }}>
            {userProgress?.topicsCompleted} of {userProgress?.totalTopics} topics completed
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <Card variant="filled" style={{ ...styles.statCard, backgroundColor: `${colors.primary}10` }}>
            <Text style={{ ...styles.statValue, color: colors.primary }}>
              {userProgress?.topicsCompleted || 0}
            </Text>
            <Text style={{ ...styles.statLabel, color: colors.text }}>Topic{userProgress?.topicsCompleted !== 1 ? 's' : ''}</Text>
          </Card>
          
          <Card variant="filled" style={{ ...styles.statCard, backgroundColor: `${colors.secondary}10` }}>
            <Text style={{ ...styles.statValue, color: colors.secondary }}>
              {userProgress?.totalXP || 0}
            </Text>
            <Text style={{ ...styles.statLabel, color: colors.text }}>XP</Text>
          </Card>
          
          <Card variant="filled" style={{ ...styles.statCard, backgroundColor: '#FFC10710' }}>
            <Text style={{ ...styles.statValue, color: '#FFC107' }}>
              {streakData?.currentStreak || 0} 🔥
            </Text>
            <Text style={{ ...styles.statLabel, color: colors.text }}>Day Streak</Text>
          </Card>
        </View>

        {inProgressTopics.length > 0 && (
          <View style={styles.section}>
            <Text style={{ ...styles.sectionTitle, color: colors.text }}>
              Continue Learning
            </Text>
            {inProgressTopics.map(renderTopicCard)}
          </View>
        )}

        <View style={styles.section}>
          <Text style={{ ...styles.sectionTitle, color: colors.text }}>
            {inProgressTopics.length > 0 ? 'All Topics' : 'Available Topics'}
          </Text>
          {topics
            .filter(topic => !topic.isLocked)
            .map(renderTopicCard)}
        </View>
      </PageContainer>

      {/* Streak Restore Modal */}
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
  container: {
    flex: 1,
    padding: scale(16),
  },
  contentContainer: {
    paddingBottom: scale(80),
  },
  header: {
    marginBottom: scale(24),
  },
  greeting: {
    fontSize: responsiveFontSize(28),
    fontWeight: 'bold',
    marginBottom: scale(4),
  },
  subtitle: {
    fontSize: responsiveFontSize(14),
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(20),
  },
  statCard: {
    flex: 1,
    marginHorizontal: scale(4),
    padding: scale(12),
    alignItems: 'center',
  },
  statValue: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    marginBottom: scale(4),
  },
  statLabel: {
    fontSize: responsiveFontSize(12),
    opacity: 0.8,
  },
  section: {
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: '600',
    marginBottom: scale(12),
  },
  card: {
    marginBottom: scale(16),
    padding: scale(16),
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    marginBottom: scale(4),
  },
  topicCategory: {
    fontSize: responsiveFontSize(14),
    opacity: 0.7,
  },
  progressContainer: {
    marginTop: scale(8),
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(8),
  },
  progressText: {
    fontSize: responsiveFontSize(14),
  },
  xpText: {
    fontSize: responsiveFontSize(12),
    fontWeight: '600',
  },
});

export default HomeScreen;