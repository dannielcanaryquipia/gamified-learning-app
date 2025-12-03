import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from '../../constants/responsive';
import { getThemeColors } from '../../contexts/ThemeContext';

interface StreakRestoreModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRestore: () => void;
  streakCount: number;
  isDark: boolean;
}

const StreakRestoreModal: React.FC<StreakRestoreModalProps> = ({
  isVisible,
  onClose,
  onRestore,
  streakCount,
  isDark,
}) => {
  const colors = getThemeColors(isDark);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              🔥 Keep Your Streak Alive!
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.streakContainer}>
            <Text style={[styles.streakCount, { color: colors.primary }]}>
              {streakCount} days
            </Text>
            <Text style={[styles.streakLabel, { color: colors.text }]}>
              Current Streak
            </Text>
          </View>

          <Text style={[styles.message, { color: colors.text }]}>
            {streakCount > 1 
              ? `You're on a ${streakCount}-day streak! Keep it going!`
              : 'Start your learning journey today!'}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={onRestore}
            >
              <Text style={styles.buttonText}>
                {streakCount > 1 ? 'Continue My Streak' : 'Start Learning'}
              </Text>
            </TouchableOpacity>
            
            {streakCount > 0 && (
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={onClose}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
                  View My Progress
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: scale(20),
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  title: {
    fontSize: scale(20),
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: scale(4),
  },
  streakContainer: {
    alignItems: 'center',
    marginVertical: scale(20),
  },
  streakCount: {
    fontSize: scale(48),
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: scale(16),
    marginTop: scale(4),
  },
  message: {
    fontSize: scale(16),
    textAlign: 'center',
    marginBottom: scale(24),
    lineHeight: scale(24),
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    padding: scale(16),
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: scale(12),
  },
  buttonText: {
    color: 'white',
    fontSize: scale(16),
    fontWeight: '600',
  },
  secondaryButton: {
    padding: scale(16),
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: scale(14),
    fontWeight: '500',
  },
});

export default StreakRestoreModal;
