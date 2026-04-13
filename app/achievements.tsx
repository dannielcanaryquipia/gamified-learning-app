import React from 'react';
import { StyleSheet, Text, View, ScrollView, Animated, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { scale, responsiveFontSize } from '../constants/responsive';
import { getThemeColors, useTheme } from '../contexts/ThemeContext';
import PageContainer from '../components/PageContainer/PageContainer';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Artifact';
  unlocked: boolean;
  date?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Transmission', description: 'Complete your initial learning module.', icon: 'wifi-tethering', rarity: 'Common', unlocked: true, date: 'APR 10, 2026' },
  { id: '2', title: 'Data Archivist', description: 'Archive 5 lessons in a single session.', icon: 'inventory', rarity: 'Rare', unlocked: true, date: 'APR 12, 2026' },
  { id: '3', title: 'Sync Master', description: 'Maintain a 7-day synchronization streak.', icon: 'bolt', rarity: 'Epic', unlocked: false },
  { id: '4', title: 'Cosmic Scholar', description: 'Achieve 100% proficiency in Networking Basics.', icon: 'auto-awesome', rarity: 'Legendary', unlocked: false },
  { id: '5', title: 'Neural Overlay', description: 'Complete all missions in one directive cycle.', icon: 'psychology', rarity: 'Artifact', unlocked: false },
  { id: '6', title: 'Security Sentinel', description: 'Identify all security breaches in the Firewall test.', icon: 'security', rarity: 'Rare', unlocked: false },
  { id: '7', title: 'Global Node', description: 'Reach the Top 3 in the regional rankings.', icon: 'public', rarity: 'Epic', unlocked: false },
];

const AchievementsScreen = () => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const router = useRouter();

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'Common': return colors.onSurfaceVariant;
      case 'Rare': return colors.primary;
      case 'Epic': return colors.tertiary;
      case 'Legendary': return colors.secondary;
      case 'Artifact': return '#FFD700'; // Gold glow for artifacts
      default: return colors.onSurfaceVariant;
    }
  };

  const renderBadge = (item: Achievement) => {
    const rarityColor = getRarityColor(item.rarity);
    
    return (
      <View key={item.id} style={[styles.badgeCard, { backgroundColor: colors.surfaceContainerLow }]}>
        {!item.unlocked && <View style={[styles.lockOverlay, { backgroundColor: colors.surface + 'CC' }]} />}
        
        <View style={[styles.badgeIconWrapper, { backgroundColor: item.unlocked ? rarityColor + '15' : colors.surfaceContainerHighest }]}>
           <MaterialIcons 
            name={item.unlocked ? (item.icon as any) : 'lock-outline'} 
            size={scale(32)} 
            color={item.unlocked ? rarityColor : colors.onSurfaceVariant} 
           />
           {item.unlocked && <View style={[styles.badgeGlow, { backgroundColor: rarityColor }]} />}
        </View>

        <View style={styles.badgeInfo}>
           <View style={styles.badgeHeader}>
              <Text style={[styles.badgeRarity, { color: rarityColor, fontFamily: 'Manrope_800ExtraBold' }]}>
                {item.rarity.toUpperCase()}
              </Text>
              {item.unlocked && item.date && (
                <Text style={[styles.badgeDate, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
                  {item.date}
                </Text>
              )}
           </View>
           <Text style={[styles.badgeTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
             {item.title}
           </Text>
           <Text style={[styles.badgeDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]} numberOfLines={2}>
             {item.description}
           </Text>
        </View>

        {!item.unlocked && (
          <View style={styles.lockIndicator}>
             <MaterialIcons name="lock" size={scale(12)} color={colors.onSurfaceVariant} />
             <Text style={[styles.lockText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>LOCKED</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Decorative Background */}
      <View style={[styles.bgCircle, { backgroundColor: colors.primary + '08', top: -scale(100), left: -scale(50) }]} />
      <View style={[styles.bgCircle, { backgroundColor: colors.tertiary + '05', bottom: -scale(50), right: -scale(100), width: scale(400), height: scale(400) }]} />

      <PageContainer scrollable={true} contentContainerStyle={styles.container}>
        <View style={styles.header}>
           <TouchableOpacity 
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.surfaceContainerLow }]}
           >
             <MaterialIcons name="arrow-back" size={scale(24)} color={colors.onSurface} />
           </TouchableOpacity>
           <View style={styles.headerTitles}>
             <Text style={[styles.overTitle, { color: colors.primary, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>ARCHIVE COLLECTION</Text>
             <Text style={[styles.title, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>Achievements</Text>
           </View>
        </View>

        <View style={[styles.statsRow, { backgroundColor: colors.surfaceContainerLow }]}>
           <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>2/12</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>COLLECTED</Text>
           </View>
           <View style={[styles.statDivider, { backgroundColor: colors.surfaceContainerHighest }]} />
           <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>16%</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>SYNC PROGRESS</Text>
           </View>
        </View>

        <View style={styles.badgesGrid}>
           {ACHIEVEMENTS.map(renderBadge)}
        </View>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: scale(60),
  },
  bgCircle: {
    position: 'absolute',
    width: scale(300),
    height: scale(300),
    borderRadius: scale(150),
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(20),
    marginBottom: scale(40),
    gap: scale(20),
  },
  backBtn: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitles: {
    flex: 1,
  },
  overTitle: {
    fontSize: responsiveFontSize(11),
    letterSpacing: 2,
    marginBottom: scale(4),
  },
  title: {
    fontSize: responsiveFontSize(32),
  },
  statsRow: {
    flexDirection: 'row',
    padding: scale(24),
    borderRadius: scale(24),
    marginBottom: scale(40),
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: responsiveFontSize(20),
    marginBottom: scale(4),
  },
  statLabel: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 1,
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    height: scale(32),
  },
  badgesGrid: {
    gap: scale(16),
  },
  badgeCard: {
    flexDirection: 'row',
    padding: scale(20),
    borderRadius: scale(28),
    alignItems: 'center',
    gap: scale(20),
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    opacity: 0.4,
  },
  badgeIconWrapper: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: scale(24),
    opacity: 0.2,
    zIndex: -1,
  },
  badgeInfo: {
    flex: 1,
    zIndex: 2,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  badgeRarity: {
    fontSize: responsiveFontSize(10),
    letterSpacing: 1,
  },
  badgeDate: {
    fontSize: responsiveFontSize(9),
    opacity: 0.5,
  },
  badgeTitle: {
    fontSize: responsiveFontSize(18),
    marginBottom: scale(6),
  },
  badgeDesc: {
    fontSize: responsiveFontSize(13),
    lineHeight: responsiveFontSize(18),
    opacity: 0.7,
  },
  lockIndicator: {
    position: 'absolute',
    right: scale(20),
    bottom: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    opacity: 0.5,
  },
  lockText: {
    fontSize: responsiveFontSize(9),
    letterSpacing: 1,
  },
});

export default AchievementsScreen;
