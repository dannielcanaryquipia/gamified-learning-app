import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from '../../constants/responsive';
import { getThemeColors } from '../../contexts/ThemeContext';

interface StreakCardProps {
  currentStreak: number;
  onPress?: () => void;
  isDark: boolean;
}

const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, onPress, isDark }) => {
  const colors = getThemeColors(isDark);

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <MaterialIcons name="whatshot" size={scale(24)} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.streakLabel, { color: colors.text }]}>
            {currentStreak > 0 ? '🔥 Current Streak' : 'Start Your Streak!'}
          </Text>
          <Text style={[styles.streakCount, { color: colors.primary }]}>
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
        <MaterialIcons 
          name="chevron-right" 
          size={scale(24)} 
          color={colors.text} 
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: scale(16),
    marginBottom: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  textContainer: {
    flex: 1,
  },
  streakLabel: {
    fontSize: scale(14),
    marginBottom: scale(2),
    opacity: 0.8,
  },
  streakCount: {
    fontSize: scale(20),
    fontWeight: 'bold',
  },
  chevron: {
    opacity: 0.5,
  },
});

export default StreakCard;
