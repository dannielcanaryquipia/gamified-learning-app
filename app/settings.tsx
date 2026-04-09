import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { scale, responsiveFontSize } from '../constants/responsive';
import { getThemeColors, useTheme } from '../contexts/ThemeContext';
import PageContainer from '../components/PageContainer/PageContainer';

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
          size={scale(24)} 
          color={colors.primary} 
          style={styles.icon} 
        />
        <Text style={[styles.settingText, { color: colors.text }]}>{title}</Text>
      </View>
      {rightComponent || (
        <MaterialIcons 
          name="chevron-right" 
          size={scale(24)} 
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

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      scrollable={true}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={scale(24)} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Appearance</Text>
        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <MaterialIcons 
              name={isDark ? 'dark-mode' : 'light-mode'} 
              size={scale(24)} 
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
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: scale(40),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(20),
    borderBottomWidth: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
    padding: scale(4),
  },
  headerTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  section: {
    marginTop: scale(24),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
    marginBottom: scale(8),
    paddingHorizontal: scale(4),
    opacity: 0.8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(16),
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
    fontSize: responsiveFontSize(16),
  },
});
