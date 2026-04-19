import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackButton from '../components/BackButton/BackButton';
import { scale, responsiveFontSize } from '../constants/responsive';
import { getThemeColors, useTheme } from '../contexts/ThemeContext';
import PageContainer from '../components/PageContainer/PageContainer';

type SupportItemProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  description: string;
  onPress?: () => void;
};

const SupportItem = ({ icon, title, description, onPress }: SupportItemProps) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  return (
    <TouchableOpacity 
      style={[styles.supportItem, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
        <MaterialIcons name={icon} size={scale(24)} color={colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.placeholder }]}>{description}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={scale(24)} color={colors.placeholder} />
    </TouchableOpacity>
  );
};

export default function HelpSupportScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@example.com');
  };

  const handleViewFaqs = () => {
    // In a real app, this would navigate to an FAQ page
    alert('FAQs would be shown here');
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{'Help & Support'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>How can we help you?</Text>
        
        <SupportItem
          icon="email"
          title="Contact Support"
          description="Get in touch with our support team"
          onPress={handleContactSupport}
        />
        
        <SupportItem
          icon="help-outline"
          title="FAQs"
          description="Find answers to common questions"
          onPress={handleViewFaqs}
        />
        
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.text }]}>
            Our support team typically responds within 24 hours.
          </Text>
        </View>
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
    marginBottom: scale(16),
    opacity: 0.8,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(12),
    marginBottom: scale(12),
    ...Platform.select({
      web: {
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(1) },
        shadowOpacity: 0.05,
        shadowRadius: scale(2),
        elevation: 1,
      },
    }),
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: responsiveFontSize(16),
    fontWeight: '500',
    marginBottom: scale(2),
  },
  description: {
    fontSize: responsiveFontSize(14),
  },
  infoContainer: {
    marginTop: scale(8),
    padding: scale(12),
    borderRadius: scale(8),
  },
  infoText: {
    fontSize: responsiveFontSize(13),
    textAlign: 'center',
    opacity: 0.7,
  },
});
