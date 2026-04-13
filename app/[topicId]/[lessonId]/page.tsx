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
  const [scrollY] = useState(new Animated.Value(0));
  
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
        if (lessonData?.isCompleted) setIsCompleted(true);
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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        if (isWideScreen) return;
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 150;
        if (isCloseToBottom && !isAtBottom) {
          setIsAtBottom(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: Platform.OS !== 'web',
          }).start();
        }
      }
    }
  );

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
      setIsCompleted(false);
      hideLoading();
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (isLoading) {
    return (
      <PageContainer style={{ backgroundColor: colors.background }}>
        <Skeleton width="100%" height={scale(60)} style={{ marginBottom: scale(32) }} />
        <Skeleton width="60%" height={scale(40)} style={{ marginBottom: scale(24) }} />
        <Skeleton width="100%" height={scale(20)} style={{ marginBottom: scale(12) }} />
        <Skeleton width="90%" height={scale(20)} style={{ marginBottom: scale(40) }} />
        <Skeleton width="100%" height={scale(300)} borderRadius={scale(24)} />
      </PageContainer>
    );
  }

  if (!lesson) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LoadingOverlay visible={isRedirecting} message="Integrating knowledge..." />
      
      {/* Floating Glass Header */}
      <Animated.View style={[
        styles.floatingHeader, 
        { 
          backgroundColor: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderBottomColor: colors.surfaceContainerHighest,
          opacity: headerOpacity
        }
      ]}>
          <Text style={[styles.floatingTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]} numberOfLines={1}>
            {lesson.title}
          </Text>
      </Animated.View>

      <PageContainer
        scrollable={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.pageContent}
      >
        {/* Top Navigation Row */}
        <View style={styles.topNav}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.surfaceContainerLow }]}
          >
            <MaterialIcons name="close" size={scale(20)} color={colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.breadCrumb}>
             <Text style={[styles.breadText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>{topicTitle.toUpperCase()}</Text>
             <MaterialIcons name="chevron-right" size={scale(14)} color={colors.onSurfaceVariant} opacity={0.5} />
             <Text style={[styles.breadText, { color: colors.primary, fontFamily: 'Manrope_700Bold' }]}>MODULE {lesson.order}</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.lessonHero}>
           <Text style={[styles.lessonTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
              {lesson.title}
           </Text>
           <View style={styles.metaRow}>
              <View style={[styles.metaTag, { backgroundColor: colors.surfaceContainerHighest }]}>
                 <MaterialIcons name="schedule" size={scale(12)} color={colors.primary} />
                 <Text style={[styles.metaTagName, { color: colors.onSurface, fontFamily: 'Manrope_700Bold' }]}>{lesson.duration} MIN READ</Text>
              </View>
              <View style={[styles.metaTag, { backgroundColor: colors.tertiary + '15' }]}>
                 <MaterialIcons name="bolt" size={scale(12)} color={colors.tertiary} />
                 <Text style={[styles.metaTagName, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>{lesson.xp} XP</Text>
              </View>
           </View>
        </View>

        <View style={styles.contentWrapper}>
          <LessonContent 
            content={lesson.content}
            description={lesson.description}
            isCompleted={isCompleted}
            isLoading={isRedirecting}
            onComplete={handleMarkAsCompleted}
            showCompleteButton={isAtBottom || isCompleted}
            fadeAnim={fadeAnim}
            quiz={lesson.quiz}
            xpValue={lesson.xp}
          />
        </View>
      </PageContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: scale(64),
    paddingTop: Platform.OS === 'ios' ? scale(20) : 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    borderBottomWidth: 1,
    ...Platform.select({
       web: { backdropFilter: 'blur(10px)' },
    })
  },
  floatingTitle: {
    fontSize: responsiveFontSize(14),
    maxWidth: '70%',
  },
  pageContent: {
    paddingVertical: scale(20),
    paddingBottom: scale(100),
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(48),
    gap: scale(16),
  },
  backBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  breadCrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  breadText: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 1,
  },
  lessonHero: {
    marginBottom: scale(40),
  },
  lessonTitle: {
    fontSize: responsiveFontSize(36),
    lineHeight: responsiveFontSize(42),
    marginBottom: scale(20),
    letterSpacing: -1.5,
  },
  metaRow: {
    flexDirection: 'row',
    gap: scale(12),
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(8),
    gap: scale(6),
  },
  metaTagName: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 0.5,
  },
  contentWrapper: {
    width: '100%',
  },
});
