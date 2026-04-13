import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import Card from '../../components/Card/Card';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import PageContainer from '../../components/PageContainer/PageContainer';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { useApp } from '../../contexts/AppContext';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import { fetchTopics } from '../../services/mockData';
import { Lesson, Topic } from '../../types';
import Skeleton from '../../components/Skeleton/Skeleton';

export default function TopicScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const router = useRouter();
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const getTopicIcon = (id: string): any => {
    const iconMap: { [key: string]: any } = {
      'computer-basics': 'settings-input-component',
      'internet-basics': 'public',
      'programming-basics': 'terminal',
    };
    return iconMap[id] || 'layers';
  };

  useFocusEffect(
    useCallback(() => {
      const loadTopic = async () => {
        if (!topicId) return;
        
        try {
          setIsLoading(true);
          const topics = await fetchTopics();
          const topicData = topics.find((t: any) => t.id === topicId);
          setTopic(topicData || null);
        } catch (error) {
          console.error(`Error loading topic ${topicId}:`, error);
        } finally {
          setIsLoading(false);
        }
      };

      loadTopic();
    }, [topicId])
  );

  const handleStartLesson = (lesson: Lesson) => {
    router.push(`/${topicId}/${lesson.id}/page`);
  };

  const renderLessonCard = (lesson: Lesson) => {
    return (
      <Card
        key={lesson.id}
        style={styles.lessonCard}
        onPress={() => handleStartLesson(lesson)}
        variant="filled"
      >
        <View style={styles.lessonHeader}>
          <View style={[styles.lessonIconContainer, { backgroundColor: lesson.isCompleted ? 'rgba(0, 255, 143, 0.08)' : 'rgba(11, 111, 255, 0.08)' }]}>
            <MaterialIcons 
              name="auto-stories" 
              size={scale(20)} 
              color={lesson.isCompleted ? colors.success : colors.primary} 
            />
          </View>
          <View style={styles.lessonHeaderText}>
            <Text style={[styles.lessonTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {lesson.order}. {lesson.title}
            </Text>
            <Text style={[styles.lessonCategory, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
              {lesson.description}
            </Text>
          </View>
          {lesson.isCompleted && (
            <MaterialIcons 
              name="check-circle" 
              size={scale(18)} 
              color={colors.success} 
              style={styles.lessonCheckIcon}
            />
          )}
        </View>
        
        <View style={styles.lessonProgressContainer}>
          <ProgressBar
            progress={lesson.isCompleted ? 1 : 0}
            height={scale(4)}
            gradientColors={lesson.isCompleted ? [colors.success, colors.success] : [colors.primary, colors.primaryDim]}
            showLabel={false}
          />
        </View>
        
        <View style={styles.lessonFooter}>
          <View style={styles.lessonMeta}>
            <View style={styles.lessonMetaItem}>
              <MaterialIcons name="schedule" size={scale(14)} color={colors.onSurfaceVariant} style={{ opacity: 0.6 }} />
              <Text style={[styles.lessonMetaText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold', opacity: 0.8 }]}>
                {lesson.duration} min
              </Text>
            </View>
            <View style={styles.lessonMetaItem}>
              <MaterialIcons name="local-activity" size={scale(14)} color={colors.tertiary} />
              <Text style={[styles.lessonMetaText, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                {lesson.xp} XP
              </Text>
            </View>
          </View>
          <MaterialIcons 
            name="play-arrow" 
            size={scale(22)} 
            color={lesson.isCompleted ? colors.success : colors.primary} 
          />
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <PageContainer contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.backButtonContainer}>
            <Skeleton width={scale(40)} height={scale(40)} borderRadius={scale(20)} />
          </View>
          <Skeleton width={scale(64)} height={scale(64)} borderRadius={scale(12)} style={{ marginBottom: scale(20) }} />
          <Skeleton width={scale(200)} height={scale(32)} style={{ marginBottom: scale(12) }} />
          <Skeleton width="90%" height={scale(48)} style={{ marginBottom: scale(24) }} />
          <Skeleton width="100%" height={scale(100)} borderRadius={scale(16)} />
        </View>

        <View style={styles.lessonsSection}>
          <View style={styles.sectionHeader}>
            <Skeleton width={scale(100)} height={scale(24)} />
            <Skeleton width={scale(80)} height={scale(16)} />
          </View>
          {[1, 2, 3].map((i) => (
            <Skeleton 
              key={i} 
              style={styles.lessonCard} 
              height={scale(140)} 
              borderRadius={scale(16)} 
            />
          ))}
        </View>
      </PageContainer>
    );
  }

  if (!topic) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={[styles.errorText, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>Topic not found</Text>
      </View>
    );
  }

  return (
    <PageContainer
      scrollable={true}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.surfaceContainerHigh }]}
          >
            <MaterialIcons name="chevron-left" size={scale(24)} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
        <View style={[styles.headerIcon, { backgroundColor: colors.surfaceContainerLow }]}>
          <MaterialIcons name={getTopicIcon(topic.id)} size={scale(40)} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>{topic.title}</Text>
        <Text style={[styles.description, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>{topic.description}</Text>
        
        <Card variant="cosmic" style={styles.progressCard}>
          <View style={styles.progressContent}>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                  {topic.completedLessons}
                </Text>
                <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>
                  DONE
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.outlineVariant }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                  {topic.totalLessons}
                </Text>
                <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>
                  TOTAL
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.outlineVariant }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                  {topic.currentXp}
                </Text>
                <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>
                  XP
                </Text>
              </View>
            </View>
            <ProgressBar
              progress={topic.totalLessons > 0 ? topic.completedLessons / topic.totalLessons : 0}
              height={scale(6)}
              gradientColors={[colors.primary, colors.primaryDim]}
              showLabel={false}
            />
          </View>
        </Card>
      </View>

      <View style={styles.lessonsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>Course Modules</Text>
          <Text style={[styles.lessonCount, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
            {topic.lessons?.length || 0} Modules
          </Text>
        </View>
        {topic.lessons?.map(renderLessonCard)}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: scale(32),
    paddingBottom: scale(120),
  },
  errorText: {
    fontSize: responsiveFontSize(18),
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    paddingBottom: scale(16),
    position: 'relative',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
      },
      default: {
        elevation: 2,
      }
    })
  },
  headerIcon: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(24),
  },
  title: {
    fontSize: responsiveFontSize(32),
    marginBottom: scale(8),
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: responsiveFontSize(15),
    lineHeight: responsiveFontSize(22),
    textAlign: 'center',
    marginBottom: scale(32),
    paddingHorizontal: scale(20),
    opacity: 0.9,
  },
  progressCard: {
    width: '100%',
    padding: scale(24),
  },
  progressContent: {
    gap: scale(20),
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: responsiveFontSize(22),
    marginBottom: scale(2),
  },
  statLabel: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: scale(32),
    opacity: 0.3,
  },
  lessonsSection: {
    width: '100%',
    marginTop: scale(40),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(24),
    paddingHorizontal: scale(4),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20),
  },
  lessonCount: {
    fontSize: responsiveFontSize(13),
    opacity: 0.6,
  },
  lessonCard: {
    marginBottom: scale(16),
    padding: scale(20),
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  lessonIconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  lessonHeaderText: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: responsiveFontSize(16),
    marginBottom: scale(2),
  },
  lessonCategory: {
    fontSize: responsiveFontSize(12),
    opacity: 0.8,
  },
  lessonCheckIcon: {
    marginLeft: scale(8),
  },
  lessonProgressContainer: {
    marginBottom: scale(16),
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: scale(20),
  },
  lessonMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  lessonMetaText: {
    fontSize: responsiveFontSize(12),
  },
});
