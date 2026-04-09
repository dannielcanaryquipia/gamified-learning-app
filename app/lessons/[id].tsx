import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useApp } from '../../contexts/AppContext';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import { fetchTopics } from '../../services/mockData';
import { Lesson } from '../../types';
import ButtonPrimary from '../../components/ButtonPrimary';
import PageContainer from '../../components/PageContainer/PageContainer';
import LessonContent from '../../components/LessonContent/LessonContent';
import Skeleton from '../../components/Skeleton/Skeleton';
import { scale, responsiveFontSize, getScreenDimensions } from '../../constants/responsive';

export default function LessonScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { markLessonComplete } = useApp();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const { isDesktop: isWideScreen, isTablet: isTabletScreen } = getScreenDimensions();

  // If we're on a wide screen (Web/Tablet/Desktop), enable the button automatically
  // because content likely fits or the user can see everything easily.
  useEffect(() => {
    if ((isWideScreen || isTabletScreen) && !isLoading && lesson) {
      setIsAtBottom(true);
    }
  }, [isWideScreen, isTabletScreen, isLoading, lesson]);

  // Fade in the button when it becomes available
  useEffect(() => {
    if (isAtBottom || isCompleted) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isAtBottom, isCompleted]);

  useEffect(() => {
    const loadLesson = async () => {
      if (!id) return;
      try {
        const topics = await fetchTopics();
        let foundLesson = null;
        for (const topic of topics) {
          const l = topic.lessons?.find((l: any) => l.id === id);
          if (l) {
            foundLesson = l;
            break;
          }
        }
        setLesson(foundLesson || null);
        if (foundLesson?.isCompleted) {
          setIsCompleted(true);
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLesson();
  }, [id]);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isCloseToBottom) {
      setIsAtBottom(true);
    }
  };

  const handleLayoutChange = (e: any) => {
    const { height } = e.nativeEvent.layout;
    setLayoutHeight(height);
    checkIfScrollRequired(height, contentHeight);
  };

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
    checkIfScrollRequired(layoutHeight, height);
  };

  const checkIfScrollRequired = (lHeight: number, cHeight: number) => {
    if (lHeight > 0 && cHeight > 0) {
      // If content is smaller than or equal to layout, it's already "at the bottom"
      if (cHeight <= lHeight + 50) {
        setIsAtBottom(true);
      }
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!id || isCompleted || !lesson) return;
    try {
      setIsCompleted(true);
      const topics = await fetchTopics();
      const topic = topics.find((t: any) => t.lessons?.some((l: any) => l.id === id));
      if (topic) {
        await markLessonComplete(topic.id, id);
      }
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      setIsCompleted(false);
    }
  };

  if (isLoading) return (
    <PageContainer style={{ backgroundColor: colors.background }} contentContainerStyle={styles.contentContainer}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton width={scale(40)} height={scale(24)} style={{ marginRight: scale(16) }} />
        <Skeleton width={scale(250)} height={scale(28)} />
      </View>

      {/* Content Skeleton */}
      <View style={{ marginTop: scale(20) }}>
        <Skeleton width="100%" height={scale(20)} style={{ marginBottom: scale(12) }} />
        <Skeleton width="95%" height={scale(20)} style={{ marginBottom: scale(12) }} />
        <Skeleton width="100%" height={scale(20)} style={{ marginBottom: scale(12) }} />
        <Skeleton width="60%" height={scale(20)} style={{ marginBottom: scale(40) }} />

        <Skeleton width="100%" height={scale(150)} borderRadius={scale(12)} style={{ marginBottom: scale(40) }} />

        <Skeleton width="100%" height={scale(20)} style={{ marginBottom: scale(12) }} />
        <Skeleton width="90%" height={scale(20)} style={{ marginBottom: scale(12) }} />
      </View>
    </PageContainer>
  );

  if (!lesson) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={scale(48)} color="#FF5252" />
        <Text style={[styles.errorText, { color: colors.text }]}>Lesson not found</Text>
      </View>
    </View>
  );

  return (
    <PageContainer
      scrollable={true}
      onScroll={handleScroll}
      onLayout={handleLayoutChange}
      onContentSizeChange={handleContentSizeChange}
      scrollEventThrottle={16}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <MaterialIcons 
          name="arrow-back" 
          size={scale(24)} 
          color={colors.text} 
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text style={[styles.title, { color: colors.text }]}>
          {lesson.title}
        </Text>
      </View>

      <LessonContent 
        content={lesson.content}
        description={lesson.description}
        isCompleted={isCompleted}
        onComplete={handleMarkAsCompleted}
        showCompleteButton={isAtBottom || isCompleted}
        fadeAnim={fadeAnim}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  loadingText: { textAlign: 'center', marginTop: scale(50), fontSize: responsiveFontSize(16) },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: scale(20) },
  errorText: { fontSize: responsiveFontSize(18), marginTop: scale(16), textAlign: 'center' },
  contentContainer: { 
    paddingBottom: scale(60),
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: scale(20), 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginBottom: scale(16),
  },
  backButton: {
    marginRight: scale(16),
  },
  title: { 
    fontSize: responsiveFontSize(22), 
    fontWeight: 'bold',
    flex: 1,
  },
});
