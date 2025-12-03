import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from '../constants/responsive';
import { getThemeColors, useTheme } from '../contexts/ThemeContext';

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
    >
      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
        <MaterialIcons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.placeholder }]}>{description}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={colors.placeholder} />
    </TouchableOpacity>
  );
};

export default function HelpSupportScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const handleContactSupport = () => {
    // In a real app, this would open an email client or support form
    Linking.openURL('mailto:support@example.com');
  };

  const handleViewFaqs = () => {
    // In a real app, this would navigate to an FAQ page
    alert('FAQs would be shown here');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, justifyContent: 'center' }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
      </View>

      <ScrollView style={styles.content}>
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
    padding: scale(16),
  },
  sectionTitle: {
    fontSize: scale(14),
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
    fontSize: scale(16),
    fontWeight: '500',
    marginBottom: scale(2),
  },
  description: {
    fontSize: scale(14),
  },
  infoContainer: {
    marginTop: scale(8),
    padding: scale(12),
    borderRadius: scale(8),
    backgroundColor: 'transparent',
  },
  infoText: {
    fontSize: scale(13),
    textAlign: 'center',
    opacity: 0.7,
  },
});
