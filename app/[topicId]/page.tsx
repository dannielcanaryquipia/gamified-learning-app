import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Card from '../../components/Card/Card';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { scale } from '../../constants/responsive';
import { useApp } from '../../contexts/AppContext';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import { fetchTopics } from '../../services/mockData';
import { Lesson, Topic } from '../../types';

export default function TopicScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const { refreshData } = useApp();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if the screen is large enough to show dividers
  const isLargeScreen = width >= 768;

  // Get topic icon based on topic ID
  const getTopicIcon = (id: string): any => {
    const iconMap: { [key: string]: any } = {
      'computer-basics': 'computer',
      'internet-basics': 'language',
      'programming-basics': 'code',
    };
    return iconMap[id] || 'school';
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadTopic = async () => {
        if (!topicId) return;
        
        try {
          console.log(`Refreshing topic: ${topicId}`);
          setIsLoading(true);
          const topics = await fetchTopics();
          const topicData = topics.find((t: any) => t.id === topicId);
          console.log(`Found topic: ${topicData?.title}`);
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

  useEffect(() => {
    const loadTopic = async () => {
      if (!topicId) return;
      
      try {
        console.log(`Loading topic: ${topicId}`);
        const topics = await fetchTopics();
        const topicData = topics.find((t: any) => t.id === topicId);
        console.log(`Found topic: ${topicData?.title}`);
        setTopic(topicData || null);
      } catch (error) {
        console.error(`Error loading topic ${topicId}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopic();
  }, [topicId]);

  const handleStartLesson = (lesson: Lesson) => {
    router.push(`/${topicId}/${lesson.id}/page`);
  };

  const renderLessonCard = (lesson: Lesson) => {
    const progress = lesson.isCompleted ? 100 : 0;
    
    return (
      <Card
        key={lesson.id}
        style={styles.lessonCard}
        onPress={() => handleStartLesson(lesson)}
        variant="elevated"
      >
        <View style={styles.lessonHeader}>
          <View style={styles.lessonIconContainer}>
            <MaterialIcons 
              name="code" 
              size={scale(24)} 
              color={lesson.isCompleted ? '#4CAF50' : colors.primary} 
            />
          </View>
          <View style={styles.lessonHeaderText}>
            <Text style={[styles.lessonTitle, { color: colors.text }]}>
              {lesson.order}. {lesson.title}
            </Text>
            <Text style={[styles.lessonCategory, { color: colors.text }]}>
              {lesson.description}
            </Text>
          </View>
          {lesson.isCompleted && (
            <MaterialIcons 
              name="check-circle" 
              size={scale(20)} 
              color="#4CAF50" 
              style={styles.lessonCheckIcon}
            />
          )}
        </View>
        
        <View style={styles.lessonProgressContainer}>
          <View style={styles.lessonProgressBar}>
            <ProgressBar
              progress={lesson.isCompleted ? 1 : 0}
              height={scale(6)}
              color={lesson.isCompleted ? '#4CAF50' : colors.primary}
              showLabel={false}
            />
          </View>
          <Text style={[styles.lessonProgressText, { color: colors.text }]}>
            {lesson.isCompleted ? 'Completed' : 'Not started'}
          </Text>
        </View>
        
        <View style={styles.lessonFooter}>
          <View style={styles.lessonMeta}>
            <View style={styles.lessonMetaItem}>
              <MaterialIcons name="schedule" size={scale(14)} color={colors.text} />
              <Text style={[styles.lessonMetaText, { color: colors.text }]}>
                {lesson.duration} min
              </Text>
            </View>
            <View style={styles.lessonMetaItem}>
              <MaterialIcons name="star" size={scale(14)} color={colors.primary} />
              <Text style={[styles.lessonMetaText, { color: colors.primary }]}>
                {lesson.xp} XP
              </Text>
            </View>
          </View>
          <MaterialIcons 
            name="play-circle-outline" 
            size={scale(24)} 
            color={lesson.isCompleted ? '#4CAF50' : colors.primary} 
          />
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading topic...</Text>
      </SafeAreaView>
    );
  }

  if (!topic) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Topic not found</Text>
      </SafeAreaView>
    );
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.backButtonContainer}>
            <MaterialIcons 
              name="arrow-back" 
              size={scale(24)} 
              color={colors.primary} 
              onPress={handleGoBack}
              style={styles.backButton}
            />
          </View>
          <View style={styles.headerIcon}>
            <MaterialIcons name={getTopicIcon(topic.id)} size={scale(64)} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{topic.title}</Text>
          <Text style={[styles.description, { color: colors.text }]}>{topic.description}</Text>
          
          <View style={styles.progressCard}>
            <View style={styles.progressContent}>
              <View style={styles.progressStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.text }]}>
                    {topic.completedLessons}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.text }]}>
                    Completed
                  </Text>
                </View>
                {isLargeScreen && <View style={styles.statDivider} />}
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.text }]}>
                    {topic.totalLessons}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.text }]}>
                    Total Lessons
                  </Text>
                </View>
                {isLargeScreen && <View style={styles.statDivider} />}
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.primary }]}>
                    {topic.currentXp}/{topic.totalXp}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.primary }]}>
                    XP Earned
                  </Text>
                </View>
              </View>
              <ProgressBar
                progress={topic.totalLessons > 0 ? topic.completedLessons / topic.totalLessons : 0}
                height={scale(8)}
                color={colors.primary}
                showLabel={false}
              />
            </View>
          </View>
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Lessons</Text>
            <Text style={[styles.lessonCount, { color: colors.text }]}>
              {topic.lessons?.length || 0} lessons
            </Text>
          </View>
          {topic.lessons?.map(renderLessonCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // View styles
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: scale(16),
    paddingBottom: scale(100),
  },
  loadingText: {
    fontSize: scale(16),
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    fontSize: scale(18),
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    padding: scale(20),
    paddingBottom: scale(10),
    position: 'relative',
  },
  backButtonContainer: {
    position: 'absolute',
    left: scale(20),
    top: scale(20),
    zIndex: 1,
  },
  backButton: {
    padding: scale(8),
  },
  headerIcon: {
    marginBottom: scale(20),
  },
  title: {
    fontSize: scale(28),
    fontWeight: 'bold',
    marginBottom: scale(12),
    textAlign: 'center',
  },
  description: {
    fontSize: scale(16),
    lineHeight: scale(24),
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: scale(24),
  },
  progressCard: {
    width: '100%',
    padding: scale(16),
    borderRadius: scale(12),
  },
  progressContent: {
    gap: scale(16),
  },
  progressStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: scale(8),
  },
  statItem: {
    alignItems: 'center',
    minWidth: scale(80),
    flex: 1,
  },
  statNumber: {
    fontSize: scale(20),
    fontWeight: 'bold',
    marginBottom: scale(2),
    textAlign: 'center',
    minWidth: scale(60),
  },
  statLabel: {
    fontSize: scale(12),
    opacity: 0.8,
  },
  statDivider: {
    width: scale(1),
    height: scale(40),
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: scale(8),
  },
  lessonsSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(20),
    paddingHorizontal: scale(4),
  },
  sectionTitle: {
    fontSize: scale(20),
    fontWeight: '600',
  },
  lessonCount: {
    fontSize: scale(14),
    opacity: 0.7,
  },
  lessonCard: {
    marginBottom: scale(16),
    padding: scale(16),
    borderRadius: scale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  lessonIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  lessonHeaderText: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    marginBottom: scale(2),
  },
  lessonCategory: {
    fontSize: scale(12),
    opacity: 0.7,
  },
  lessonCheckIcon: {
    marginLeft: 'auto',
  },
  lessonProgressContainer: {
    marginBottom: scale(12),
  },
  lessonProgressBar: {
    marginBottom: scale(4),
  },
  lessonProgressText: {
    fontSize: scale(12),
    opacity: 0.7,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: scale(16),
  },
  lessonMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  lessonMetaText: {
    fontSize: scale(12),
    fontWeight: '500',
  },
});
