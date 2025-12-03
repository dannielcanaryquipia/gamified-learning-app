import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useApp } from '../../../contexts/AppContext';
import { getThemeColors, useTheme } from '../../../contexts/ThemeContext';
import { fetchTopics } from '../../../services/mockData';
import { Lesson } from '../../../types';

export default function LessonScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const router = useRouter();
  const { topicId, lessonId } = useLocalSearchParams<{ topicId: string; lessonId: string }>();
  const { refreshData, markLessonComplete } = useApp();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [topicTitle, setTopicTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadLesson = async () => {
      if (!topicId || !lessonId) return;
      
      try {
        console.log(`Loading lesson: ${lessonId} from topic: ${topicId}`);
        const topics = await fetchTopics();
        const topicData = topics.find((t: any) => t.id === topicId);
        
        if (!topicData) {
          console.error('Topic not found:', topicId);
          return;
        }
        
        console.log('Found topic:', topicData.title);
        console.log('Available lessons:', topicData.lessons?.map((l: any) => ({ id: l.id, title: l.title, isCompleted: l.isCompleted })));
        
        const lessonData = topicData.lessons?.find((l: any) => l.id === lessonId);
        console.log('Found lesson:', lessonData);
        
        setLesson(lessonData || null);
        setTopicTitle(topicData.title);
        
        // Check if lesson is already completed
        if (lessonData?.isCompleted) {
          console.log('Lesson is already completed');
          setIsCompleted(true);
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (topicId && lessonId) {
      loadLesson();
    } else {
      console.error('No topic ID or lesson ID provided');
      setIsLoading(false);
    }
  }, [topicId, lessonId]);

  const handleBack = () => {
    router.back();
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    
    console.log('Scroll position:', {
      layoutHeight: layoutMeasurement.height,
      contentOffsetY: contentOffset.y,
      contentHeight: contentSize.height,
      isCloseToBottom
    });
    
    if (isCloseToBottom && !isAtBottom) {
      console.log('Showing completion button');
      setIsAtBottom(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (!isCloseToBottom && isAtBottom) {
      console.log('Hiding completion button');
      setIsAtBottom(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!topicId || !lessonId || isCompleted) return;
    
    try {
      console.log('Marking lesson as completed:', lessonId);
      setIsCompleted(true);
      
      // Use AppContext to mark lesson complete (updates homepage stats)
      await markLessonComplete(topicId, lessonId);
      
      // Show success feedback and navigate back
      setTimeout(() => {
        router.back();
      }, 1500);
      
    } catch (error) {
      console.error('Error completing lesson:', error);
      setIsCompleted(false); // Reset on error
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading lesson...</Text>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF5252" />
          <Text style={[styles.errorText, { color: colors.text }]}>Lesson not found</Text>
          <Text style={[styles.errorSubtext, { color: colors.text }]}>
            The lesson "{lessonId}" was not found in {topicTitle}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const markdownStyles = {
    body: { color: colors.text, fontSize: 16 } as const,
    heading1: { color: colors.text, fontSize: 24, fontWeight: '700' as const, marginBottom: 16 } as const,
    heading2: { color: colors.text, fontSize: 20, fontWeight: '600' as const, marginBottom: 12 } as const,
    heading3: { color: colors.text, fontSize: 18, fontWeight: '600' as const, marginBottom: 8 } as const,
    paragraph: { color: colors.text, marginBottom: 12, lineHeight: 24 } as const,
    list_item: { color: colors.text, marginBottom: 4, marginLeft: 16 } as const,
    bullet_list: { marginBottom: 12 } as const,
    code_inline: { 
      color: colors.primary, 
      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5', 
      padding: 2, 
      borderRadius: 4 
    } as const,
    code_block: { 
      color: colors.text, 
      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5', 
      padding: 12, 
      borderRadius: 8, 
      marginBottom: 12,
      fontFamily: 'monospace'
    } as const,
    strong: { color: colors.text, fontWeight: '700' as const } as const,
    em: { color: colors.text, fontStyle: 'italic' as const } as const,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <MaterialIcons 
          name="arrow-back" 
          size={24} 
          color={colors.text} 
          onPress={handleBack}
          style={styles.backButton}
        />
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]}>{lesson.title}</Text>
          <View style={styles.meta}>
            <Text style={[styles.duration, { color: colors.text }]}>
              <MaterialIcons name="schedule" size={14} /> {lesson.duration} min
            </Text>
            <Text style={[styles.xp, { color: colors.primary }]}>
              <MaterialIcons name="star" size={14} /> {lesson.xp} XP
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={[styles.description, { color: colors.text }]}>
          {lesson.description}
        </Text>
        
        <Markdown style={markdownStyles}>
          {lesson.content}
        </Markdown>
        
        <View style={styles.completeButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.completeButton, 
              { 
                backgroundColor: isCompleted ? '#4CAF50' : colors.primary,
                opacity: isAtBottom || isCompleted ? 1 : 0.5,
              }
            ]}
            onPress={handleMarkAsCompleted}
            disabled={!isAtBottom && !isCompleted}
          >
            <MaterialIcons 
              name={isCompleted ? "check-circle" : "check-circle-outline"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.buttonText}>
              {isCompleted ? 'Completed!' : 'Mark as Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  } as const,
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  } as const,
  errorSubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  } as const,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    includeFontPadding: false,
  } as const,
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  duration: {
    fontSize: 12,
    opacity: 0.8,
    includeFontPadding: false,
  } as const,
  xp: {
    fontSize: 12,
    fontWeight: '600',
    includeFontPadding: false,
  } as const,
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    fontStyle: 'italic',
    opacity: 0.8,
    includeFontPadding: false,
  } as const,
  completeButtonContainer: {
    marginTop: 32,
    marginBottom: 40,
    alignItems: 'center',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 200,
  },
  completeButtonText: {
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    includeFontPadding: false,
    textAlign: 'center',
  } as const,
});
