import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, Platform } from 'react-native';
import { useApp } from '../../../contexts/AppContext';
import { getThemeColors, useTheme } from '../../../contexts/ThemeContext';
import { fetchTopics } from '../../../services/mockData';
import { Lesson } from '../../../types';
import PageContainer from '../../../components/PageContainer/PageContainer';
import LessonContent from '../../../components/LessonContent/LessonContent';
import LoadingOverlay from '../../../components/LoadingOverlay/LoadingOverlay';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { scale, responsiveFontSize, getScreenDimensions } from '../../../constants/responsive';
import { useLoadingOverlay } from '../../../hooks/useLoadingOverlay';

export default function NestedLessonScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const router = useRouter();
  const { topicId, lessonId } = useLocalSearchParams<{ topicId: string; lessonId: string }>();
  const { markLessonComplete } = useApp();
  const { isLoading: isRedirecting, showLoading, hideLoading } = useLoadingOverlay();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [topicTitle, setTopicTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const screenDims = getScreenDimensions();
  const isWideScreen = screenDims.isDesktop || screenDims.isTablet;

  useEffect(() => {
    const loadLesson = async () => {
      if (!topicId || !lessonId) return;
      
      try {
        const topics = await fetchTopics();
        const topicData = topics.find((t: any) => t.id === topicId);
        
        if (!topicData) return;
        
        const lessonData = topicData.lessons?.find((l: any) => l.id === lessonId);
        
        setLesson(lessonData || null);
        setTopicTitle(topicData.title);
        
        if (lessonData?.isCompleted) {
          setIsCompleted(true);
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [topicId, lessonId]);

  // Wide screen auto-enable logic
  useEffect(() => {
    if (!isLoading && lesson && isWideScreen && !isAtBottom) {
      setIsAtBottom(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [isLoading, lesson, isWideScreen]);

  const handleBack = () => {
    router.back();
  };

  const handleScroll = (event: any) => {
    // Only use scroll logic on mobile/small screens
    if (isWideScreen) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    
    if (isCloseToBottom && !isAtBottom) {
      setIsAtBottom(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else if (!isCloseToBottom && isAtBottom && !isCompleted) {
      setIsAtBottom(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!topicId || !lessonId || isCompleted || isRedirecting) return;
    
    try {
      showLoading('Marking lesson complete...');
      await markLessonComplete(topicId, lessonId);
      setIsCompleted(true);
      
      setTimeout(() => {
        hideLoading();
        router.back();
      }, 1500);
    } catch (error) {
      console.error('Error completing lesson:', error);
      setIsCompleted(false);
      hideLoading();
    }
  };

  if (isLoading) {
    return (
      <PageContainer style={{ backgroundColor: colors.background }}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <Skeleton width={scale(40)} height={scale(32)} style={{ marginRight: scale(16) }} />
          <View style={styles.headerContent}>
            <Skeleton width={scale(200)} height={scale(28)} style={{ marginBottom: scale(8) }} />
            <Skeleton width={scale(150)} height={scale(16)} />
          </View>
        </View>

        {/* Content Skeleton */}
        <View style={{ marginTop: scale(20) }}>
          <Skeleton width="100%" height={scale(18)} style={{ marginBottom: scale(12) }} />
          <Skeleton width="95%" height={scale(18)} style={{ marginBottom: scale(12) }} />
          <Skeleton width="100%" height={scale(18)} style={{ marginBottom: scale(12) }} />
          <Skeleton width="60%" height={scale(18)} style={{ marginBottom: scale(40) }} />

          <Skeleton width="100%" height={scale(180)} borderRadius={scale(12)} style={{ marginBottom: scale(40) }} />

          <Skeleton width="100%" height={scale(18)} style={{ marginBottom: scale(12) }} />
          <Skeleton width="90%" height={scale(18)} style={{ marginBottom: scale(12) }} />
        </View>
      </PageContainer>
    );
  }

  if (!lesson) {
    return (
      <PageContainer>
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={scale(48)} color="#FF5252" />
          <Text style={[styles.errorText, { color: colors.text }]}>Lesson not found</Text>
          <Text style={[styles.errorSubtext, { color: colors.text }]}>
            The lesson was not found in {topicTitle}
          </Text>
        </View>
      </PageContainer>
    );
  }

  return (
    <>
      <LoadingOverlay visible={isRedirecting} message="Marking lesson complete..." />
      <PageContainer
        scrollable={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <MaterialIcons 
            name="arrow-back" 
            size={scale(24)} 
            color={colors.text} 
            onPress={handleBack}
            style={styles.backButton}
          />
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text }]}>{lesson.title}</Text>
            <View style={styles.meta}>
              <Text style={[styles.duration, { color: colors.text }]}>
                <MaterialIcons name="schedule" size={scale(14)} /> {lesson.duration} min
              </Text>
              <Text style={[styles.xp, { color: colors.primary }]}>
                <MaterialIcons name="star" size={scale(14)} /> {lesson.xp} XP
              </Text>
            </View>
          </View>
        </View>

        <LessonContent 
          content={lesson.content}
          description={lesson.description}
          isCompleted={isCompleted}
          isLoading={isRedirecting}
          onComplete={handleMarkAsCompleted}
          showCompleteButton={isAtBottom || isCompleted}
          fadeAnim={fadeAnim}
        />
      </PageContainer>
    </>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  loadingText: {
    fontSize: responsiveFontSize(16),
  },
  errorText: {
    fontSize: responsiveFontSize(18),
    fontWeight: '600',
    marginTop: scale(16),
  },
  errorSubtext: {
    fontSize: responsiveFontSize(14),
    opacity: 0.7,
    marginTop: scale(8),
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(16),
    marginBottom: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    marginRight: scale(16),
    padding: scale(4),
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: responsiveFontSize(22),
    fontWeight: 'bold',
    marginBottom: scale(4),
  },
  meta: {
    flexDirection: 'row',
    gap: scale(16),
  },
  duration: {
    fontSize: responsiveFontSize(14),
    opacity: 0.8,
  },
  xp: {
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
  },
});
