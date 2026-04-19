import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PageContainer from '../../components/PageContainer/PageContainer';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { fetchQuizzes } from '../../services/mockData';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useFocusEffect } from 'expo-router';

interface QuizItem {
  lessonId: string;
  lessonTitle: string;
  lessonOrder: number;
  isLessonCompleted: boolean;
  quiz: any;
  questionCount: number;
}

interface TopicQuizGroup {
  topicId: string;
  topicTitle: string;
  topicIcon: string;
  lessons: QuizItem[];
}

const QuizzesScreen = () => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const router = useRouter();
  const { topics } = useApp();
  const [quizGroups, setQuizGroups] = useState<TopicQuizGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadQuizzes = async () => {
        try {
          setIsLoading(true);
          const data = await fetchQuizzes();
          setQuizGroups(data);
        } catch (error) {
          console.error('Error loading quizzes:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadQuizzes();
    }, [topics])
  );

  const getTopicProgress = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return { completed: 0, total: 0 };
    return { completed: topic.completedLessons, total: topic.totalLessons };
  };

  const isTopicFullyCompleted = (topicId: string) => {
    const { completed, total } = getTopicProgress(topicId);
    return completed === total && total > 0;
  };

  const handleStartQuiz = (topicId: string, lessonId: string) => {
    router.push(`/${topicId}/${lessonId}/page`);
  };

  const renderQuizCard = (item: QuizItem, topicId: string, isUnlocked: boolean) => {
    const isCompleted = item.isLessonCompleted;

    return (
      <TouchableOpacity
        key={item.lessonId}
        onPress={() => isUnlocked ? handleStartQuiz(topicId, item.lessonId) : null}
        activeOpacity={isUnlocked ? 0.7 : 1}
        style={[
          styles.quizCard,
          { backgroundColor: colors.surfaceContainerLow },
          !isUnlocked && styles.lockedCard,
        ]}
      >
        {!isUnlocked && (
          <View style={[styles.lockOverlay, { backgroundColor: colors.surface + 'CC' }]} />
        )}

        <View style={styles.quizCardHeader}>
          <View style={[
            styles.quizIconContainer,
            {
              backgroundColor: isCompleted
                ? colors.success + '15'
                : isUnlocked
                  ? colors.primary + '15'
                  : colors.surfaceContainerHighest
            }
          ]}>
            <MaterialIcons
              name={isCompleted ? 'check-circle' : isUnlocked ? 'quiz' : 'lock'}
              size={scale(24)}
              color={isCompleted ? colors.success : isUnlocked ? colors.primary : colors.onSurfaceVariant}
            />
          </View>

          <View style={styles.quizCardInfo}>
            <Text style={[styles.quizTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {item.lessonTitle}
            </Text>
            <Text style={[styles.quizMeta, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
              {item.questionCount} {item.questionCount === 1 ? 'question' : 'questions'} • Module {item.lessonOrder}
            </Text>
          </View>

          {isCompleted ? (
            <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.statusText, { color: colors.success, fontFamily: 'Manrope_700Bold' }]}>PASSED</Text>
            </View>
          ) : isUnlocked ? (
            <View style={[styles.playBtn, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="play-arrow" size={scale(18)} color="#FFF" />
            </View>
          ) : (
            <View style={styles.lockIndicator}>
              <MaterialIcons name="lock" size={scale(14)} color={colors.onSurfaceVariant} />
            </View>
          )}
        </View>

        {!isUnlocked && (
          <Text style={[styles.lockHint, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
            Complete the lesson to unlock this evaluation
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderTopicGroup = (group: TopicQuizGroup) => {
    const { completed, total } = getTopicProgress(group.topicId);
    const isFullyCompleted = isTopicFullyCompleted(group.topicId);
    const unlockedCount = group.lessons.filter(l => l.isLessonCompleted).length;

    return (
      <View key={group.topicId} style={styles.topicGroup}>
        {/* Topic Header */}
        <View style={[styles.topicHeader, { backgroundColor: colors.surfaceContainerLow }]}>
          <View style={styles.topicHeaderLeft}>
            <View style={[styles.topicIconBox, { backgroundColor: colors.surfaceContainerHighest }]}>
              <MaterialIcons name={group.topicIcon as any} size={scale(24)} color={colors.primary} />
            </View>
            <View style={styles.topicHeaderInfo}>
              <Text style={[styles.topicTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                {group.topicTitle}
              </Text>
              <Text style={[styles.topicMeta, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
                {unlockedCount}/{group.lessons.length} evaluations unlocked
              </Text>
            </View>
          </View>
          {isFullyCompleted && (
            <View style={[styles.topicComplete, { backgroundColor: colors.success + '15' }]}>
              <MaterialIcons name="verified" size={scale(16)} color={colors.success} />
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={[styles.topicProgressBase, { backgroundColor: colors.surfaceContainerHighest }]}>
          <View
            style={[
              styles.topicProgressFill,
              {
                backgroundColor: colors.primary,
                width: `${total > 0 ? (completed / total) * 100 : 0}%`
              }
            ]}
          />
        </View>

        {/* Quiz List */}
        <View style={styles.quizList}>
          {group.lessons.map(item =>
            renderQuizCard(item, group.topicId, item.isLessonCompleted)
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <PageContainer contentContainerStyle={{ paddingVertical: scale(32) }}>
        <Skeleton width={scale(200)} height={scale(32)} style={{ marginBottom: scale(8) }} />
        <Skeleton width={scale(260)} height={scale(16)} style={{ marginBottom: scale(40) }} />
        {[1, 2, 3].map(i => (
          <Skeleton key={i} width="100%" height={scale(180)} borderRadius={scale(24)} style={{ marginBottom: scale(20) }} />
        ))}
      </PageContainer>
    );
  }

  const totalQuizzes = quizGroups.reduce((s, g) => s + g.lessons.length, 0);
  const passedQuizzes = quizGroups.reduce((s, g) => s + g.lessons.filter(l => l.isLessonCompleted).length, 0);

  return (
    <PageContainer contentContainerStyle={{ paddingVertical: scale(32), paddingBottom: scale(100) }}>
      {/* Editorial Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[isDark ? 'rgba(255, 197, 101, 0.12)' : 'rgba(255, 184, 77, 0.08)', 'transparent']}
          style={styles.headerGlow}
        />
        <Text style={[styles.headerTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
          Knowledge{"\n"}Evaluations
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
          Complete lessons to unlock evaluations. Pass to prove mastery.
        </Text>
      </View>

      {/* Stats Overview */}
      <View style={[styles.statsCard, { backgroundColor: colors.surfaceContainerLow }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
            {passedQuizzes}/{totalQuizzes}
          </Text>
          <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>PASSED</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.surfaceContainerHighest }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
            {totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>MASTERY</Text>
        </View>
      </View>

      {/* Quiz Groups */}
      <View style={styles.groupList}>
        {quizGroups.map(renderTopicGroup)}
      </View>

      {quizGroups.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialIcons name="quiz" size={scale(64)} color={colors.onSurfaceVariant} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
            No evaluations available yet.{'\n'}Start learning to unlock quizzes.
          </Text>
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: scale(32),
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
  statsCard: {
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
    fontSize: responsiveFontSize(22),
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
  groupList: {
    gap: scale(32),
  },
  topicGroup: {
    gap: scale(12),
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    borderRadius: scale(20),
  },
  topicHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
    flex: 1,
  },
  topicIconBox: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicHeaderInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: responsiveFontSize(16),
    marginBottom: scale(2),
  },
  topicMeta: {
    fontSize: responsiveFontSize(11),
    opacity: 0.6,
  },
  topicComplete: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicProgressBase: {
    height: scale(4),
    borderRadius: scale(2),
    marginHorizontal: scale(4),
  },
  topicProgressFill: {
    height: '100%',
    borderRadius: scale(2),
  },
  quizList: {
    gap: scale(10),
  },
  quizCard: {
    padding: scale(16),
    borderRadius: scale(20),
    position: 'relative',
    overflow: 'hidden',
  },
  lockedCard: {
    opacity: 0.7,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    opacity: 0.3,
  },
  quizCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
    zIndex: 2,
  },
  quizIconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizCardInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: responsiveFontSize(14),
    marginBottom: scale(2),
  },
  quizMeta: {
    fontSize: responsiveFontSize(11),
    opacity: 0.6,
  },
  statusBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(8),
  },
  statusText: {
    fontSize: responsiveFontSize(9),
    letterSpacing: 1,
  },
  playBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIndicator: {
    opacity: 0.5,
    zIndex: 2,
  },
  lockHint: {
    fontSize: responsiveFontSize(11),
    marginTop: scale(10),
    opacity: 0.5,
    paddingLeft: scale(60),
    zIndex: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: scale(80),
    gap: scale(20),
  },
  emptyText: {
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
    lineHeight: responsiveFontSize(22),
    opacity: 0.5,
  },
});

export default QuizzesScreen;
