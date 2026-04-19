import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View, Platform } from 'react-native';
import BackButton from '../components/BackButton/BackButton';
import { scale, responsiveFontSize } from '../constants/responsive';
import { getThemeColors, useTheme } from '../contexts/ThemeContext';
import PageContainer from '../components/PageContainer/PageContainer';

type SettingsItemProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  description?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  destructive?: boolean;
};

const SettingsItem = ({ icon, title, description, onPress, rightComponent, destructive }: SettingsItemProps) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  return (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: colors.surfaceContainerLow }]}
      onPress={onPress}
      disabled={!onPress && !rightComponent}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: destructive ? '#FF3B3010' : colors.surfaceContainerHighest }]}>
        <MaterialIcons 
          name={icon} 
          size={scale(20)} 
          color={destructive ? '#FF3B30' : colors.primary} 
        />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: destructive ? '#FF3B30' : colors.onSurface, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.settingDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
            {description}
          </Text>
        )}
      </View>
      {rightComponent || (
        <MaterialIcons 
          name="chevron-right" 
          size={scale(20)} 
          color={colors.onSurfaceVariant} 
          style={{ opacity: 0.5 }}
        />
      )}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const colors = getThemeColors(isDark);

  const handleThemeChange = (value: boolean) => {
    toggleTheme(value ? 'dark' : 'light');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PageContainer
        scrollable={true}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton variant="circle" onPress={() => router.back()} />
          <View style={styles.headerTitles}>
            <Text style={[styles.overTitle, { color: colors.primary, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
              SYSTEM CONTROL
            </Text>
            <Text style={[styles.headerTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
              Settings
            </Text>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>
            APPEARANCE
          </Text>
          <View style={styles.sectionContent}>
            <View style={[styles.settingItem, { backgroundColor: colors.surfaceContainerLow }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.surfaceContainerHighest }]}>
                <MaterialIcons 
                  name={isDark ? 'dark-mode' : 'light-mode'} 
                  size={scale(20)} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.settingDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
                  {isDark ? 'Cosmic dark interface active' : 'Light interface active'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleThemeChange}
                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primary + '60' }}
                thumbColor={isDark ? colors.primary : colors.onSurfaceVariant}
                ios_backgroundColor={colors.surfaceContainerHighest}
              />
            </View>
          </View>
        </View>

        {/* Feedback Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>
            FEEDBACK & INTERACTION
          </Text>
          <View style={styles.sectionContent}>
            <View style={[styles.settingItem, { backgroundColor: colors.surfaceContainerLow }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.surfaceContainerHighest }]}>
                <MaterialIcons name="vibration" size={scale(20)} color={colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                  Haptic Feedback
                </Text>
                <Text style={[styles.settingDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
                  Tactile response on interactions
                </Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primary + '60' }}
                thumbColor={colors.primary}
                ios_backgroundColor={colors.surfaceContainerHighest}
              />
            </View>
            <View style={[styles.settingItem, { backgroundColor: colors.surfaceContainerLow }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.surfaceContainerHighest }]}>
                <MaterialIcons name="volume-up" size={scale(20)} color={colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                  Sound Effects
                </Text>
                <Text style={[styles.settingDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
                  Audio cues for quizzes & achievements
                </Text>
              </View>
              <Switch
                value={false}
                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primary + '60' }}
                thumbColor={colors.onSurfaceVariant}
                ios_backgroundColor={colors.surfaceContainerHighest}
              />
            </View>
          </View>
        </View>

        {/* Navigation Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>
            SYSTEM DIRECTIVES
          </Text>
          <View style={styles.sectionContent}>
            <SettingsItem 
              icon="notifications-none"
              title="Notifications"
              description="Manage push notification preferences"
            />
            <SettingsItem 
              icon="help-outline" 
              title="Help & Support"
              description="FAQs and contact transmission"
              onPress={() => router.push('/help-support')}
            />
            <SettingsItem 
              icon="info-outline" 
              title="About"
              description="Version info & credits"
              onPress={() => router.push('/about')}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#FF3B30', fontFamily: 'Manrope_700Bold' }]}>
            DANGER ZONE
          </Text>
          <View style={styles.sectionContent}>
            <SettingsItem 
              icon="delete-outline"
              title="Clear Progress"
              description="Reset all learning data"
              destructive
            />
            <SettingsItem 
              icon="logout"
              title="Deactivate Session"
              description="Sign out of the archive"
              destructive
            />
          </View>
        </View>

        {/* Version Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
            Cosmic Archive v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
            Built with ⚡ by the Archive Team
          </Text>
        </View>
      </PageContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: scale(32),
    paddingBottom: scale(60),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(48),
    gap: scale(20),
  },
  headerTitles: {
    flex: 1,
  },
  overTitle: {
    fontSize: responsiveFontSize(11),
    letterSpacing: 2,
    marginBottom: scale(4),
  },
  headerTitle: {
    fontSize: responsiveFontSize(32),
    letterSpacing: -1,
  },
  section: {
    marginBottom: scale(32),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 2,
    marginBottom: scale(16),
    paddingHorizontal: scale(8),
    opacity: 0.6,
  },
  sectionContent: {
    gap: scale(8),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(20),
    gap: scale(16),
  },
  settingIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: responsiveFontSize(15),
    marginBottom: scale(2),
  },
  settingDesc: {
    fontSize: responsiveFontSize(11),
    opacity: 0.6,
  },
  footer: {
    alignItems: 'center',
    gap: scale(6),
    paddingTop: scale(32),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    marginTop: scale(16),
  },
  footerText: {
    fontSize: responsiveFontSize(11),
    opacity: 0.4,
  },
});
