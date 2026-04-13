import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/Card/Card';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import PageContainer from '../../components/PageContainer/PageContainer';
import { scale, responsiveFontSize } from '../../constants/responsive';
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
      <TouchableOpacity
        key={lesson.id}
        onPress={() => handleStartLesson(lesson)}
        activeOpacity={0.7}
        style={[styles.lessonCard, { backgroundColor: colors.surfaceContainerLow }]}
      >
        <View style={styles.lessonHeader}>
          <View style={[styles.lessonIconContainer, { backgroundColor: colors.surfaceContainerHighest }]}>
            <MaterialIcons 
              name="auto-stories" 
              size={scale(20)} 
              color={lesson.isCompleted ? colors.success : colors.primary} 
            />
          </View>
          <View style={styles.lessonHeaderText}>
            <Text style={[styles.lessonTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {lesson.title}
            </Text>
            <Text style={[styles.lessonCategory, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]} numberOfLines={1}>
              Level {lesson.order} Directive
            </Text>
          </View>
          {lesson.isCompleted && (
            <View style={[styles.completeBadge, { backgroundColor: colors.success + '20' }]}>
               <MaterialIcons name="check" size={scale(14)} color={colors.success} />
            </View>
          )}
        </View>
        
        <View style={styles.lessonFooter}>
          <View style={styles.lessonMeta}>
            <View style={[styles.metaPill, { backgroundColor: colors.surfaceContainer }]}>
               <MaterialIcons name="schedule" size={scale(12)} color={colors.onSurfaceVariant} />
               <Text style={[styles.metaText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>{lesson.duration}M</Text>
            </View>
            <View style={[styles.metaPill, { backgroundColor: colors.tertiary + '15' }]}>
               <MaterialIcons name="bolt" size={scale(12)} color={colors.tertiary} />
               <Text style={[styles.metaText, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>{lesson.xp} XP</Text>
            </View>
          </View>
          <View style={[styles.playBtn, { backgroundColor: colors.primary }]}>
             <MaterialIcons name="arrow-forward" size={scale(16)} color="#FFF" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <PageContainer contentContainerStyle={styles.contentContainer}>
        <Skeleton width={scale(40)} height={scale(40)} borderRadius={scale(20)} style={{ marginBottom: scale(40) }} />
        <View style={{ alignItems: 'center' }}>
          <Skeleton width={scale(80)} height={scale(80)} borderRadius={scale(24)} style={{ marginBottom: scale(24) }} />
          <Skeleton width={scale(200)} height={scale(32)} style={{ marginBottom: scale(12) }} />
          <Skeleton width="90%" height={scale(48)} style={{ marginBottom: scale(40) }} />
        </View>
        <Skeleton width="100%" height={scale(120)} borderRadius={scale(28)} style={{ marginBottom: scale(40) }} />
        <View style={{ gap: scale(16) }}>
          {[1, 2, 3].map(i => <Skeleton key={i} width="100%" height={scale(100)} borderRadius={scale(24)} />)}
        </View>
      </PageContainer>
    );
  }

  if (!topic) return null;

  const progress = topic.totalLessons > 0 ? topic.completedLessons / topic.totalLessons : 0;

  return (
    <PageContainer contentContainerStyle={styles.contentContainer}>
      {/* Back Navigation */}
      <TouchableOpacity 
        onPress={() => router.back()}
        style={[styles.backBtn, { backgroundColor: colors.surfaceContainerHighest }]}
      >
        <MaterialIcons name="chevron-left" size={scale(24)} color={colors.onSurface} />
      </TouchableOpacity>

      {/* Atmospheric Header */}
      <View style={styles.header}>
        <View style={styles.headerGlowContainer}>
           <LinearGradient
             colors={[colors.primary, 'transparent']}
             style={styles.headerGlow}
           />
           <View style={[styles.iconBox, { backgroundColor: colors.surfaceContainerLow }]}>
             <MaterialIcons name={getTopicIcon(topic.id)} size={scale(44)} color={colors.primary} />
           </View>
        </View>
        <Text style={[styles.title, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
          {topic.title}
        </Text>
        <Text style={[styles.description, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
          {topic.description}
        </Text>
      </View>

      {/* Weighted Progress Card */}
      <View style={[styles.progressCard, { backgroundColor: colors.surfaceContainerLow }]}>
        <View style={styles.progressRow}>
           <View style={styles.mainProgress}>
              <Text style={[styles.percText, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
                {Math.round(progress * 100)}%
              </Text>
              <Text style={[styles.percLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>COMPLETED</Text>
           </View>
           <View style={styles.statsCol}>
              <View style={styles.statBubble}>
                 <Text style={[styles.statValue, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>{topic.completedLessons}/{topic.totalLessons}</Text>
                 <Text style={[styles.statTitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>MODULES</Text>
              </View>
              <View style={styles.statBubble}>
                 <Text style={[styles.statValue, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>{topic.currentXp}</Text>
                 <Text style={[styles.statTitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>XP GAINED</Text>
              </View>
           </View>
        </View>
        <ProgressBar 
          progress={progress} 
          height={scale(6)}
          gradientColors={[colors.primary, colors.primaryDim]}
          showLabel={false}
        />
      </View>

      {/* Module List */}
      <View style={styles.moduleSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>Operational Modules</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.surfaceContainerHighest }]}>
             <Text style={[styles.countText, { color: colors.onSurfaceVariant, fontFamily: 'PlusJakartaSans_700Bold' }]}>{topic.lessons?.length || 0}</Text>
          </View>
        </View>
        <View style={styles.moduleList}>
          {topic.lessons?.map(renderLessonCard)}
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: scale(32),
    paddingBottom: scale(100),
  },
  backBtn: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(40),
  },
  header: {
    alignItems: 'center',
    marginBottom: scale(40),
  },
  headerGlowContainer: {
    position: 'relative',
    width: scale(120),
    height: scale(120),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(24),
  },
  headerGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: scale(60),
    opacity: 0.15,
  },
  iconBox: {
    width: scale(88),
    height: scale(88),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  title: {
    fontSize: responsiveFontSize(34),
    textAlign: 'center',
    marginBottom: scale(12),
    letterSpacing: -1,
  },
  description: {
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
    paddingHorizontal: scale(24),
    lineHeight: responsiveFontSize(22),
    opacity: 0.8,
  },
  progressCard: {
    padding: scale(24),
    borderRadius: scale(32),
    marginBottom: scale(48),
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(24),
  },
  mainProgress: {
    flex: 1,
  },
  percText: {
    fontSize: responsiveFontSize(32),
    letterSpacing: -1,
  },
  percLabel: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 1,
    opacity: 0.6,
  },
  statsCol: {
    flexDirection: 'row',
    gap: scale(16),
  },
  statBubble: {
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: responsiveFontSize(15),
  },
  statTitle: {
    fontSize: responsiveFontSize(9),
    letterSpacing: 0.5,
    opacity: 0.5,
  },
  moduleSection: {
    gap: scale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingHorizontal: scale(4),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20),
  },
  countBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(6),
  },
  countText: {
    fontSize: responsiveFontSize(12),
  },
  moduleList: {
    gap: scale(16),
  },
  lessonCard: {
    padding: scale(20),
    borderRadius: scale(24),
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  lessonIconContainer: {
    width: scale(40),
    height: scale(40),
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
    fontSize: responsiveFontSize(11),
    opacity: 0.6,
  },
  completeBadge: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: scale(8),
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(8),
    gap: scale(4),
  },
  metaText: {
    fontSize: responsiveFontSize(10),
  },
  playBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
