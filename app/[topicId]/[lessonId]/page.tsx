import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';
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
import ProgressBar from '../../../components/ProgressBar/ProgressBar';

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
    if (isWideScreen) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
    
    if (isCloseToBottom && !isAtBottom) {
      setIsAtBottom(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!topicId || !lessonId || isCompleted || isRedirecting) return;
    
    try {
      showLoading('Capturing Knowledge...');
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
        <View style={styles.header}>
          <Skeleton width={scale(40)} height={scale(40)} borderRadius={scale(20)} style={{ marginRight: scale(16) }} />
          <View style={styles.headerContent}>
            <Skeleton width={scale(240)} height={scale(32)} style={{ marginBottom: scale(8) }} />
            <Skeleton width={scale(180)} height={scale(16)} />
          </View>
        </View>
        <View style={{ marginTop: scale(32) }}>
          <Skeleton width="100%" height={scale(20)} style={{ marginBottom: scale(16) }} />
          <Skeleton width="95%" height={scale(20)} style={{ marginBottom: scale(16) }} />
          <Skeleton width="40%" height={scale(20)} style={{ marginBottom: scale(40) }} />
          <Skeleton width="100%" height={scale(280)} borderRadius={scale(16)} style={{ marginBottom: scale(32) }} />
        </View>
      </PageContainer>
    );
  }

  if (!lesson) {
    return (
      <PageContainer>
        <View style={styles.centerContainer}>
          <MaterialIcons name="report-problem" size={scale(48)} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>Knowledge Link Broken</Text>
          <TouchableOpacity onPress={handleBack} style={{ marginTop: scale(20) }}>
            <Text style={{ color: colors.primary, fontFamily: 'PlusJakartaSans_600SemiBold' }}>Return to Archives</Text>
          </TouchableOpacity>
        </View>
      </PageContainer>
    );
  }

  return (
    <>
      <LoadingOverlay visible={isRedirecting} message="Integrating knowledge..." />
      <PageContainer
        scrollable={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.pageContent}
      >
        <ProgressBar 
          progress={isCompleted ? 1 : 0.5} 
          height={scale(3)} 
          gradientColors={[colors.primary, colors.primaryDim]}
          style={styles.topProgress}
          showLabel={false}
        />
        
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: colors.surfaceContainerLow }]}
          >
            <MaterialIcons name="close" size={scale(20)} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>{lesson.title}</Text>
            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <MaterialIcons name="hourglass-top" size={scale(12)} color={colors.onSurfaceVariant} />
                <Text style={[styles.metaText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
                  {lesson.duration} min
                </Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <MaterialIcons name="stars" size={scale(12)} color={colors.tertiary} />
                <Text style={[styles.metaText, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                  {lesson.xp} XP
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.lessonContainer}>
          <LessonContent 
            content={lesson.content}
            description={lesson.description}
            isCompleted={isCompleted}
            isLoading={isRedirecting}
            onComplete={handleMarkAsCompleted}
            showCompleteButton={isAtBottom || isCompleted}
            fadeAnim={fadeAnim}
          />
        </View>
      </PageContainer>
    </>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    paddingBottom: scale(100),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(40),
  },
  errorText: {
    fontSize: responsiveFontSize(18),
    marginTop: scale(16),
  },
  topProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(20),
    marginTop: scale(8),
    marginBottom: scale(24),
  },
  backButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: responsiveFontSize(20),
    marginBottom: scale(4),
    letterSpacing: -0.3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  metaText: {
    fontSize: responsiveFontSize(12),
    opacity: 0.8,
  },
  metaDivider: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: scale(12),
  },
  lessonContainer: {
    width: '100%',
  },
});
