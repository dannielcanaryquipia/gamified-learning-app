import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackButton from '../components/BackButton/BackButton';
import PageContainer from '../components/PageContainer/PageContainer';
import { responsiveFontSize, scale } from '../constants/responsive';
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
          size={scale(24)} 
          color={colors.primary} 
          style={styles.icon} 
        />
        <Text style={[styles.aboutText, { color: colors.text }]}>{title}</Text>
      </View>
      {showChevron && (
        <MaterialIcons 
          name="chevron-right" 
          size={scale(24)} 
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

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      scrollable={true}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <BackButton variant="inline" style={styles.backButton} onPress={() => router.back()} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>About</Text>
      </View>

      <View style={styles.logoContainer}>
        <View style={[styles.logo, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="school" size={scale(48)} color="white" />
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
          onPress={() => handleOpenLink('https://www.facebook.com/danniel.canary.quipia.2024')}
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
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    marginBottom: scale(4),
  },
  appVersion: {
    fontSize: responsiveFontSize(14),
  },
  section: {
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
    paddingHorizontal: scale(4),
    marginBottom: scale(8),
    opacity: 0.8,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(16),
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
    fontSize: responsiveFontSize(16),
  },
  footer: {
    alignItems: 'center',
    paddingVertical: scale(24),
  },
  copyright: {
    fontSize: responsiveFontSize(12),
    marginBottom: scale(4),
  },
  madeWith: {
    fontSize: responsiveFontSize(12),
    opacity: 0.8,
  },
});
