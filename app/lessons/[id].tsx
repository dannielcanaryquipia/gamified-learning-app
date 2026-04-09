import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useApp } from '../../contexts/AppContext';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import { fetchTopics } from '../../services/mockData';
import { Lesson } from '../../types';

export default function LessonScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Using 'id' as per ARCHITECTURE.md
  const { markLessonComplete } = useApp();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadLesson = async () => {
      if (!id) return;
      
      try {
        const topics = await fetchTopics();
        // Search through all topics for the matching lesson ID
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

  const handleBack = () => {
    router.back();
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    
    if (isCloseToBottom && !isAtBottom) {
      setIsAtBottom(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (!isCloseToBottom && isAtBottom) {
      setIsAtBottom(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!id || isCompleted || !lesson) return;
    try {
      setIsCompleted(true);
      // Note: topicId is required by markLessonComplete. In a real app, 
      // we'd have the topicId metadata. For now, we search for it.
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.loadingText, { color: colors.text }]}>Loading lesson...</Text>
    </SafeAreaView>
  );

  if (!lesson) return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#FF5252" />
        <Text style={[styles.errorText, { color: colors.text }]}>Lesson not found</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <MaterialIcons name="arrow-back" size={24} color={colors.text} onPress={handleBack} />
        <Text style={[styles.title, { color: colors.text, marginLeft: 16 }]}>{lesson.title}</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.contentContainer}
      >
        <Markdown style={{ body: { color: colors.text } }}>
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
  container: { flex: 1 },
  loadingText: { textAlign: 'center', marginTop: 50 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, marginTop: 16 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold' },
  contentContainer: { padding: 16 },
  completeButtonContainer: { marginTop: 32, alignItems: 'center' },
  completeButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});
