import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { isLandscape, responsiveFontSize, scale } from '../../constants/responsive';
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
  const { height, width } = useWindowDimensions();
  const landscape = isLandscape(width, height);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[
          styles.modalContent, 
          { 
            backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface,
            maxHeight: landscape ? height * 0.85 : height * 0.7,
          }
        ]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              🔥 Keep Your Streak Alive!
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={scale(20)} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.streakContainer}>
            <Text style={[styles.streakCount, { color: colors.primary, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
              {streakCount} {streakCount === 1 ? 'day' : 'days'}
            </Text>
            <Text style={[styles.streakLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
              Current Streak
            </Text>
          </View>

          <Text style={[styles.message, { color: colors.onSurface, fontFamily: 'Manrope_500Medium' }]}>
            {streakCount > 1 
              ? `You're on an incredible ${streakCount}-day streak! Maintain the momentum and capture new knowledge today.`
              : 'The Cosmic Archive awaits. Start your learning journey today and begin your legacy.'}
          </Text>

          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={onRestore}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDim]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.button, landscape && styles.buttonCompact]}
                >
                  <Text style={[styles.buttonText, { fontFamily: 'PlusJakartaSans_700Bold' }]}>
                    {streakCount > 1 ? 'Continue Mission' : 'Initialize Learning'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              {streakCount >= 0 && (
                <TouchableOpacity 
                  style={[styles.secondaryButton, landscape && styles.secondaryButtonCompact]}
                  onPress={onClose}
                >
                  <Text style={[styles.secondaryButtonText, { color: colors.primary, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                    View My Progress
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
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
    padding: scale(24),
  },
  modalContent: {
    width: '100%',
    borderRadius: scale(20),
    padding: scale(24),
    maxWidth: scale(360),
    ...Platform.select({
      web: {
        boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.6)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(10) },
        shadowOpacity: 0.5,
        shadowRadius: scale(20),
        elevation: 10,
      }
    })
  },
  scrollContainer: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(24),
  },
  title: {
    fontSize: responsiveFontSize(18),
    flex: 1,
  },
  closeButton: {
    padding: scale(6),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(8),
  },
  streakContainer: {
    alignItems: 'center',
    marginVertical: scale(24),
  },
  streakCount: {
    fontSize: responsiveFontSize(42),
    letterSpacing: -1,
  },
  streakLabel: {
    fontSize: responsiveFontSize(13),
    marginTop: scale(4),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  message: {
    fontSize: responsiveFontSize(15),
    textAlign: 'center',
    marginBottom: scale(32),
    lineHeight: responsiveFontSize(22),
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    padding: scale(16),
    borderRadius: scale(30), // Pill shaped buttons as per design system
    alignItems: 'center',
    marginBottom: scale(12),
  },
  buttonCompact: {
    paddingVertical: scale(12),
    marginBottom: scale(8),
  },
  buttonText: {
    color: 'white',
    fontSize: responsiveFontSize(16),
  },
  secondaryButton: {
    padding: scale(16),
    alignItems: 'center',
  },
  secondaryButtonCompact: {
    paddingVertical: scale(10),
  },
  secondaryButtonText: {
    fontSize: responsiveFontSize(14),
  },
});

export default StreakRestoreModal;
