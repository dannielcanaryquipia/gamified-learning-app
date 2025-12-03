import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from '../../constants/responsive';

export interface TopicCardProps {
  id: string;
  title: string;
  category: string;
  icon: string;
  completedLessons: number;
  totalLessons: number;
  xp: number;
  isLocked: boolean;
  onPress?: (id: string) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  id,
  title,
  category,
  icon,
  completedLessons,
  totalLessons,
  xp,
  isLocked,
  onPress,
}) => {
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const router = useRouter();

  const handlePress = () => {
    if (isLocked) return;
    if (onPress) {
      onPress(id);
    } else {
      // Navigate to the direct topic page using the correct route format
      router.push({
        pathname: `/${id}/page`,
        params: {},
      } as any);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isLocked && styles.lockedContainer]}
      onPress={handlePress}
      disabled={isLocked}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons 
            name={icon as any || 'school'} 
            size={scale(24)} 
            color={isLocked ? '#999' : '#6200ee'} 
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, isLocked && styles.lockedText]}>{title}</Text>
          <Text style={[styles.category, isLocked && styles.lockedText]}>{category}</Text>
        </View>
        {isLocked && (
          <MaterialIcons 
            name="lock" 
            size={scale(20)} 
            color="#999" 
            style={styles.lockIcon}
          />
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progress}%`,
                backgroundColor: isLocked ? '#999' : '#6200ee'
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, isLocked && styles.lockedText]}>
          {completedLessons}/{totalLessons} lessons
        </Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>
        {!isLocked && (
          <MaterialIcons 
            name="chevron-right" 
            size={scale(24)} 
            color="#6200ee" 
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedContainer: {
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  iconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: scale(2),
  },
  category: {
    fontSize: scale(12),
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginBottom: scale(12),
  },
  progressBar: {
    height: scale(6),
    backgroundColor: '#e0e0e0',
    borderRadius: scale(3),
    marginBottom: scale(4),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: scale(3),
  },
  progressText: {
    fontSize: scale(12),
    color: '#666',
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpBadge: {
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12),
  },
  xpText: {
    color: '#6200ee',
    fontSize: scale(12),
    fontWeight: '600',
  },
  lockedText: {
    color: '#999',
  },
  lockIcon: {
    marginLeft: 'auto',
  },
});

export default TopicCard;
