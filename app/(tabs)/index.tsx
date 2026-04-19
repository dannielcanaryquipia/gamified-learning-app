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
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StreakRestoreModal from '../../components/StreakRestoreModal/StreakRestoreModal';
import PageContainer from '../../components/PageContainer/PageContainer';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { useApp } from '../../contexts/AppContext';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import { fetchTopics } from '../../services/mockData';
import { Topic } from '../../types';
import Skeleton from '../../components/Skeleton/Skeleton';

import TopicCard from '../../components/TopicCard/TopicCard';

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
  const availableTopics = topics.filter(topic => !topic.isLocked && (topic.completedLessons === topic.totalLessons || topic.completedLessons === 0));
  
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

  const renderTopicCard = (topic: Topic, isFeatured: boolean = false) => {
    return (
      <TopicCard 
        key={topic.id}
        {...topic}
        featured={isFeatured}
      />
    );
  };

  if (isLoading) {
    return (
      <PageContainer contentContainerStyle={{ paddingVertical: scale(32) }}>
        <View style={styles.header}>
          <Skeleton width={scale(200)} height={scale(32)} style={{ marginBottom: scale(8) }} />
          <Skeleton width={scale(150)} height={scale(16)} />
        </View>
        <View style={styles.statsRow}>
           <Skeleton width={scale(100)} height={scale(80)} borderRadius={scale(16)} />
           <Skeleton width={scale(100)} height={scale(80)} borderRadius={scale(16)} />
           <Skeleton width={scale(100)} height={scale(80)} borderRadius={scale(16)} />
        </View>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer
        contentContainerStyle={{ paddingVertical: scale(32), paddingBottom: scale(100) }}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={refreshData}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Atmospheric Header - Weighted Layout */}
        <View style={styles.header}>
          <LinearGradient
            colors={[isDark ? 'rgba(139, 172, 255, 0.15)' : 'rgba(0, 108, 251, 0.1)', 'transparent']}
            style={styles.headerGlow}
          />
          <View style={styles.headerContent}>
            <Text style={[styles.greeting, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
              Mission{"\n"}Control
            </Text>
            <View style={styles.subtitleContainer}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.subtitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
                {userProfile?.name || 'Explorer'} active. Archive: {userProgress?.topicsCompleted}/{userProgress?.totalTopics}
              </Text>
            </View>
          </View>
          
          {/* Level Overlay - Asymmetric Element */}
          <View style={[styles.levelBadgeContainer, { backgroundColor: colors.surfaceContainerHighest }]}>
            <Text style={[styles.levelLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>RANK</Text>
            <Text style={[styles.levelValue, { color: colors.primary, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
              {Math.floor((userProgress?.totalXP || 0) / 1000) + 1}
            </Text>
          </View>
        </View>

        {/* Stats Row - Tonal stacking */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, { backgroundColor: colors.surfaceContainerLow }]}>
            <Text style={[styles.statValue, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {userProgress?.totalXP || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>TOTAL XP</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: colors.surfaceContainerLow }]}>
            <Text style={[styles.statValue, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {streakData?.currentStreak || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>STREAK</Text>
          </View>
        </View>

        {/* Weighted Grid Layout */}
        <View style={styles.contentGrid}>
          {inProgressTopics.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                Active Missions
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.horizontalScroll}
                snapToInterval={Math.min(scale(280), Dimensions.get('window').width - scale(24)) + scale(16)}
                decelerationRate="fast"
              >
                {inProgressTopics.map(topic => renderTopicCard(topic, true))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              Knowledge Archive
            </Text>
            <View style={styles.verticalGrid}>
              {availableTopics.map(topic => renderTopicCard(topic, false))}
            </View>
          </View>
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

const styles = StyleSheet.create({
  header: {
    marginBottom: scale(40),
    paddingHorizontal: scale(4),
    position: 'relative',
    paddingVertical: scale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerGlow: {
    position: 'absolute',
    top: -scale(100),
    left: -scale(50),
    right: -scale(50),
    height: scale(350),
    opacity: 0.8,
  },
  headerContent: {
    flex: 1,
    zIndex: 2,
  },
  greeting: {
    fontSize: responsiveFontSize(48),
    lineHeight: responsiveFontSize(52),
    letterSpacing: -2,
    marginBottom: scale(16),
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginRight: scale(10),
  },
  subtitle: {
    fontSize: responsiveFontSize(13),
    opacity: 0.8,
    letterSpacing: 0.2,
  },
  levelBadgeContainer: {
    padding: scale(16),
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scale(80),
    zIndex: 3,
    marginTop: scale(10),
    ...Platform.select({
      web: { boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
      default: { elevation: 10 }
    })
  },
  levelLabel: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 2,
    marginBottom: scale(4),
    opacity: 0.6,
  },
  levelValue: {
    fontSize: responsiveFontSize(28),
  },
  statsRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginBottom: scale(48),
    paddingHorizontal: scale(4),
  },
  statItem: {
    flex: 1,
    padding: scale(20),
    borderRadius: scale(20),
    justifyContent: 'center',
  },
  statValue: {
    fontSize: responsiveFontSize(24),
    marginBottom: scale(4),
  },
  statLabel: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 1,
    opacity: 0.5,
  },
  contentGrid: {
    gap: scale(40),
  },
  section: {
    gap: scale(20),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20),
    paddingHorizontal: scale(4),
    letterSpacing: -0.5,
  },
  horizontalScroll: {
    paddingRight: scale(20),
    gap: scale(16),
    paddingVertical: scale(4),
  },
  verticalGrid: {
    gap: scale(16),
  },
});

export default HomeScreen;