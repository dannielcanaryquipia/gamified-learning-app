import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PageContainer from '../../components/PageContainer/PageContainer';
import Card from '../../components/Card/Card';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  rank: number;
  avatar?: string;
  isMe?: boolean;
}

const mockLeaderboard: LeaderboardUser[] = [
  { id: '1', name: 'Zayden Nexus', xp: 12450, rank: 1 },
  { id: '2', name: 'Lyra Void', xp: 11200, rank: 2 },
  { id: '3', name: 'Nova Prime', xp: 10800, rank: 3 },
  { id: '4', name: 'Atlas Sky', xp: 9500, rank: 4 },
  { id: '5', name: 'Cipher Ghost', xp: 8200, rank: 5 },
  { id: '6', name: 'Pixel Learner', xp: 7800, rank: 6, isMe: true },
  { id: '7', name: 'Astra Flow', xp: 7500, rank: 7 },
  { id: '8', name: 'Vector Neo', xp: 6900, rank: 8 },
];

const LeaderboardScreen = () => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const renderTopRanker = (user: LeaderboardUser, size: 'lg' | 'md' | 'sm') => {
    const isFirst = user.rank === 1;
    const isSecond = user.rank === 2;
    const avatarSize = size === 'lg' ? scale(80) : size === 'md' ? scale(64) : scale(56);
    
    return (
      <View style={[styles.topRankerContainer, size === 'lg' && styles.firstPlace]}>
        <View style={styles.avatarWrapper}>
          <LinearGradient
            colors={isFirst ? ['#FFD700', '#FFA500'] : isSecond ? ['#C0C0C0', '#808080'] : ['#CD7F32', '#8B4513']}
            style={[styles.avatarGlow, { width: avatarSize + 8, height: avatarSize + 8, borderRadius: (avatarSize + 8) / 2 }]}
          />
          <View style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, backgroundColor: colors.surfaceContainerHighest }]}>
             <MaterialIcons name="person" size={avatarSize * 0.6} color={colors.onSurfaceVariant} />
          </View>
          <View style={[styles.rankBadge, { backgroundColor: colors.surfaceContainerHighest }]}>
            <Text style={[styles.rankBadgeText, { color: isFirst ? colors.tertiary : colors.onSurface }]}>{user.rank}</Text>
          </View>
        </View>
        <Text style={[styles.topRankerName, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={[styles.topRankerXP, { color: colors.primary, fontFamily: 'Manrope_700Bold' }]}>
          {user.xp.toLocaleString()} XP
        </Text>
      </View>
    );
  };

  return (
    <PageContainer contentContainerStyle={{ paddingVertical: scale(32), paddingBottom: scale(100) }}>
      {/* Editorial Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
          Global{"\n"}Archive Rank
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
          Compete with explorers across the sector.
        </Text>
      </View>

      {/* Top 3 Podium - Weighted Layout */}
      <View style={styles.podiumContainer}>
        <LinearGradient
          colors={[isDark ? 'rgba(139, 172, 255, 0.1)' : 'rgba(0, 108, 251, 0.05)', 'transparent']}
          style={styles.podiumGlow}
        />
        <View style={styles.podium}>
          {renderTopRanker(mockLeaderboard[1], 'md')}
          {renderTopRanker(mockLeaderboard[0], 'lg')}
          {renderTopRanker(mockLeaderboard[2], 'sm')}
        </View>
      </View>

      {/* Rank List - Tonal Stacking */}
      <View style={styles.rankList}>
        {mockLeaderboard.slice(3).map((user) => (
          <View 
            key={user.id} 
            style={[
              styles.rankItem, 
              { backgroundColor: user.isMe ? colors.surfaceContainerHighest : colors.surfaceContainerLow },
              user.isMe && styles.myRankItem
            ]}
          >
            <Text style={[styles.rankNumber, { color: colors.onSurfaceVariant, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {user.rank < 10 ? `0${user.rank}` : user.rank}
            </Text>
            <View style={[styles.smallAvatar, { backgroundColor: colors.surfaceContainer }]}>
               <MaterialIcons name="person" size={scale(20)} color={colors.onSurfaceVariant} />
            </View>
            <View style={styles.rankInfo}>
              <Text style={[styles.rankName, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                {user.name} {user.isMe && '(You)'}
              </Text>
              <Text style={[styles.rankStatus, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
                Expert Archivist
              </Text>
            </View>
            <View style={styles.rankXPContainer}>
               <Text style={[styles.rankXP, { color: colors.primary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                 {user.xp.toLocaleString()}
               </Text>
               <Text style={[styles.rankXPLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>XP</Text>
            </View>
          </View>
        ))}
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: scale(40),
    paddingHorizontal: scale(4),
  },
  headerTitle: {
    fontSize: responsiveFontSize(42),
    lineHeight: responsiveFontSize(46),
    letterSpacing: -1.5,
    marginBottom: scale(12),
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(14),
    opacity: 0.7,
    maxWidth: '80%',
    lineHeight: responsiveFontSize(20),
  },
  podiumContainer: {
    position: 'relative',
    marginBottom: scale(48),
    paddingVertical: scale(20),
  },
  podiumGlow: {
    position: 'absolute',
    top: -scale(40),
    left: -scale(20),
    right: -scale(20),
    bottom: -scale(20),
    borderRadius: scale(40),
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: scale(12),
  },
  topRankerContainer: {
    alignItems: 'center',
    flex: 1,
  },
  firstPlace: {
    transform: [{ translateY: -scale(20) }],
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(12),
  },
  avatarGlow: {
    position: 'absolute',
    opacity: 0.3,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -scale(6),
    right: -scale(6),
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 4px 8px rgba(0,0,0,0.3)' },
      default: { elevation: 4 }
    })
  },
  rankBadgeText: {
    fontSize: responsiveFontSize(12),
    fontWeight: '800',
  },
  topRankerName: {
    fontSize: responsiveFontSize(14),
    marginBottom: scale(2),
    textAlign: 'center',
  },
  topRankerXP: {
    fontSize: responsiveFontSize(12),
    opacity: 0.9,
  },
  rankList: {
    gap: scale(12),
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(20),
  },
  myRankItem: {
    borderWidth: 1,
    borderColor: 'rgba(139, 172, 255, 0.2)',
  },
  rankNumber: {
    fontSize: responsiveFontSize(14),
    width: scale(32),
    opacity: 0.5,
  },
  smallAvatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: responsiveFontSize(15),
    marginBottom: scale(2),
  },
  rankStatus: {
    fontSize: responsiveFontSize(11),
    opacity: 0.6,
  },
  rankXPContainer: {
    alignItems: 'flex-end',
  },
  rankXP: {
    fontSize: responsiveFontSize(16),
  },
  rankXPLabel: {
    fontSize: responsiveFontSize(9),
    opacity: 0.5,
  },
});

export default LeaderboardScreen;
