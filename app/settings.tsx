import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { scale } from '../constants/responsive';
import { getThemeColors, useTheme } from '../contexts/ThemeContext';

type SettingsItemProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
};

const SettingsItem = ({ icon, title, onPress, rightComponent }: SettingsItemProps) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  return (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <MaterialIcons 
          name={icon} 
          size={24} 
          color={colors.primary} 
          style={styles.icon} 
        />
        <Text style={[styles.settingText, { color: colors.text }]}>{title}</Text>
      </View>
      {rightComponent || (
        <MaterialIcons 
          name="chevron-right" 
          size={24} 
          color={colors.placeholder} 
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, justifyContent: 'center' }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Appearance</Text>
        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <MaterialIcons 
              name={isDark ? 'dark-mode' : 'light-mode'} 
              size={24} 
              color={colors.primary} 
              style={styles.icon} 
            />
            <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleThemeChange}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Preferences</Text>
        <SettingsItem 
          icon="help-outline" 
          title="Help & Support" 
          onPress={() => router.push('/help-support')}
        />
        <SettingsItem 
          icon="info-outline" 
          title="About" 
          onPress={() => router.push('/about')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    borderBottomWidth: 1,
  },
  backButton: {
    padding: scale(4),
  },
  headerTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginLeft: scale(-24), // To center the title
  },
  headerRight: {
    width: scale(32),
  },
  section: {
    marginTop: scale(24),
  },
  sectionTitle: {
    fontSize: scale(14),
    fontWeight: '600',
    marginBottom: scale(12),
    paddingHorizontal: scale(16),
    opacity: 0.8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(16),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: scale(16),
    width: scale(24),
    textAlign: 'center',
  },
  settingText: {
    fontSize: scale(16),
  },
});
