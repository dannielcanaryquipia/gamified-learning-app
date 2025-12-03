import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from '../constants/responsive';
import { getThemeColors, useTheme } from '../contexts/ThemeContext';

type AboutItemProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  onPress?: () => void;
  showChevron?: boolean;
};

const AboutItem = ({ icon, title, onPress, showChevron = true }: AboutItemProps) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  return (
    <TouchableOpacity 
      style={[styles.aboutItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.aboutLeft}>
        <MaterialIcons 
          name={icon} 
          size={24} 
          color={colors.primary} 
          style={styles.icon} 
        />
        <Text style={[styles.aboutText, { color: colors.text }]}>{title}</Text>
      </View>
      {showChevron && (
        <MaterialIcons 
          name="chevron-right" 
          size={24} 
          color={colors.placeholder} 
        />
      )}
    </TouchableOpacity>
  );
};

export default function AboutScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const appVersion = '1.0.0';

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, justifyContent: 'center' }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>About</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <MaterialIcons name="school" size={48} color="white" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Gamified Learning</Text>
          <Text style={[styles.appVersion, { color: colors.placeholder }]}>
            Version {appVersion}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Information</Text>
          <AboutItem 
            icon="info-outline" 
            title="Terms of Service" 
            onPress={() => handleOpenLink('https://example.com/terms')}
          />
          <AboutItem 
            icon="privacy-tip" 
            title="Privacy Policy" 
            onPress={() => handleOpenLink('https://example.com/privacy')}
          />
          <AboutItem 
            icon="description" 
            title="Licenses" 
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Connect</Text>
          <AboutItem 
            icon="language" 
            title="Website" 
            onPress={() => handleOpenLink('https://example.com')}
          />
          <AboutItem 
            icon="facebook" 
            title="Facebook" 
            onPress={() => handleOpenLink('https://facebook.com/example')}
          />
          <AboutItem 
            icon="alternate-email" 
            title="Contact Us" 
            onPress={() => handleOpenLink('mailto:contact@example.com')}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.copyright, { color: colors.placeholder }]}>
            © {new Date().getFullYear()} Gamified Learning App
          </Text>
          <Text style={[styles.madeWith, { color: colors.placeholder }]}>
            Made with ❤️ for better education
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: scale(32),
  },
  logo: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  appName: {
    fontSize: scale(24),
    fontWeight: 'bold',
    marginBottom: scale(4),
  },
  appVersion: {
    fontSize: scale(14),
  },
  section: {
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: scale(14),
    fontWeight: '600',
    paddingHorizontal: scale(16),
    marginBottom: scale(12),
    opacity: 0.8,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(16),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
  },
  aboutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: scale(16),
    width: scale(24),
    textAlign: 'center',
  },
  aboutText: {
    fontSize: scale(16),
  },
  footer: {
    alignItems: 'center',
    padding: scale(24),
  },
  copyright: {
    fontSize: scale(12),
    marginBottom: scale(4),
  },
  madeWith: {
    fontSize: scale(12),
    opacity: 0.8,
  },
});
