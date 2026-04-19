import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PageContainer from '../../components/PageContainer/PageContainer';
import { scale, responsiveFontSize } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  rank: number;
  level: number;
  streak: number;
  isCurrentUser: boolean;
}

const LeaderboardScreen = () => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const { userProgress, userProfile, streakData } = useApp();

  // Create smart mock leaderboard with real user data embedded
  const userXP = userProgress?.totalXP || 0;
  const userName = userProfile?.name || 'You';
  const userStreak = streakData?.currentStreak || 0;

  const generateLeaderboard = (): LeaderboardEntry[] => {
    const mockPlayers: LeaderboardEntry[] = [
      { id: 'p1', name: 'NovaArchivist', avatar: '🌟', xp: 2450, rank: 1, level: 15, streak: 42, isCurrentUser: false },
      { id: 'p2', name: 'QuantumCoder', avatar: '⚡', xp: 2100, rank: 2, level: 13, streak: 28, isCurrentUser: false },
      { id: 'p3', name: 'DataSherpa', avatar: '🔮', xp: 1850, rank: 3, level: 12, streak: 19, isCurrentUser: false },
      { id: 'p4', name: 'ByteWarden', avatar: '🛡️', xp: 1600, rank: 4, level: 10, streak: 15, isCurrentUser: false },
      { id: 'p5', name: 'NeuralPulse', avatar: '🧠', xp: 1300, rank: 5, level: 9, streak: 12, isCurrentUser: false },
      { id: 'p6', name: 'CipherNode', avatar: '🔑', xp: 950, rank: 6, level: 7, streak: 8, isCurrentUser: false },
      { id: 'p7', name: 'ArchiveKeeper', avatar: '📜', xp: 720, rank: 7, level: 6, streak: 5, isCurrentUser: false },
      { id: 'p8', name: 'GridHacker', avatar: '🖥️', xp: 480, rank: 8, level: 4, streak: 3, isCurrentUser: false },
      { id: 'p9', name: 'PixelGhost', avatar: '👻', xp: 200, rank: 9, level: 2, streak: 1, isCurrentUser: false },
      { id: 'p10', name: 'SignalDrift', avatar: '📡', xp: 50, rank: 10, level: 1, streak: 0, isCurrentUser: false },
    ];

    const userLevel = Math.floor(userXP / 100) + 1;
    const userEntry: LeaderboardEntry = {
      id: 'user',
      name: userName,
      avatar: '🚀',
      xp: userXP,
      rank: 0,
      level: userLevel,
      streak: userStreak,
      isCurrentUser: true,
    };

    // Insert user in correct rank position
    const all = [...mockPlayers, userEntry];
    all.sort((a, b) => b.xp - a.xp);
    all.forEach((entry, idx) => { entry.rank = idx + 1; });
    return all;
  };

  const leaderboard = generateLeaderboard();
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const userRank = leaderboard.find(e => e.isCurrentUser);

  const crownColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <PageContainer contentContainerStyle={{ paddingVertical: scale(32), paddingBottom: scale(120) }}>
      {/* Atmospheric Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[isDark ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255, 184, 0, 0.08)', 'transparent']}
          style={styles.headerGlow}
        />
        <Text style={[styles.headerTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
          Galactic{"\n"}Rankings
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
          Your position among cosmic scholars. Earn XP to climb the ranks.
        </Text>
      </View>

      {/* Top 3 Podium */}
      <View style={styles.podium}>
        {[1, 0, 2].map((podiumIndex) => {
          const entry = top3[podiumIndex];
          if (!entry) return null;
          const isFirst = podiumIndex === 0;
          return (
            <View key={entry.id} style={[styles.podiumSlot, isFirst && styles.podiumFirst]}>
              <View style={[
                styles.podiumAvatar,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  borderColor: entry.isCurrentUser ? colors.primary : crownColors[podiumIndex],
                  borderWidth: 2,
                },
                isFirst && styles.podiumAvatarFirst
              ]}>
                <Text style={[styles.podiumEmoji, isFirst && { fontSize: responsiveFontSize(32) }]}>
                  {entry.avatar}
                </Text>
              </View>
              <View style={[styles.crownBadge, { backgroundColor: crownColors[podiumIndex] }]}>
                <Text style={[styles.crownText, { fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>{entry.rank}</Text>
              </View>
              <Text 
                style={[styles.podiumName, { color: entry.isCurrentUser ? colors.primary : colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}
                numberOfLines={1}
              >
                {entry.isCurrentUser ? 'You' : entry.name}
              </Text>
              <Text style={[styles.podiumXp, { color: colors.tertiary, fontFamily: 'Manrope_800ExtraBold' }]}>
                {entry.xp.toLocaleString()} XP
              </Text>
            </View>
          );
        })}
      </View>

      {/* User Rank Card */}
      {userRank && userRank.rank > 3 && (
        <View style={[styles.yourRankCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <View style={styles.yourRankLeft}>
            <Text style={[styles.yourRankNumber, { color: colors.primary, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
              #{userRank.rank}
            </Text>
            <View>
              <Text style={[styles.yourRankName, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                Your Position
              </Text>
              <Text style={[styles.yourRankXp, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
                {userRank.xp.toLocaleString()} XP • Level {userRank.level}
              </Text>
            </View>
          </View>
          <MaterialIcons name="keyboard-arrow-up" size={scale(20)} color={colors.primary} />
        </View>
      )}

      {/* Remaining Rankings */}
      <View style={styles.rankList}>
        {rest.map((entry) => (
          <View
            key={entry.id}
            style={[
              styles.rankItem,
              { backgroundColor: entry.isCurrentUser ? colors.primary + '0A' : colors.surfaceContainerLow },
              entry.isCurrentUser && { borderWidth: 1, borderColor: colors.primary + '30' },
            ]}
          >
            <Text style={[styles.rankNumber, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_800ExtraBold' }]}>
              {entry.rank}
            </Text>

            <View style={[styles.rankAvatar, { backgroundColor: colors.surfaceContainerHighest }]}>
              <Text style={styles.rankEmoji}>{entry.avatar}</Text>
            </View>

            <View style={styles.rankInfo}>
              <Text style={[
                styles.rankName,
                { color: entry.isCurrentUser ? colors.primary : colors.onSurface, fontFamily: 'PlusJakartaSans_600SemiBold' }
              ]}>
                {entry.isCurrentUser ? `${entry.name} (You)` : entry.name}
              </Text>
              <View style={styles.rankMeta}>
                <Text style={[styles.rankMetaText, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
                  Lvl {entry.level}
                </Text>
                {entry.streak > 0 && (
                  <View style={styles.streakBadge}>
                    <MaterialIcons name="whatshot" size={scale(12)} color={colors.tertiary} />
                    <Text style={[styles.streakText, { color: colors.tertiary, fontFamily: 'Manrope_700Bold' }]}>
                      {entry.streak}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={[styles.rankXp, { color: colors.tertiary, fontFamily: 'Manrope_800ExtraBold' }]}>
              {entry.xp.toLocaleString()}
            </Text>
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
    position: 'relative',
  },
  headerGlow: {
    position: 'absolute',
    top: -scale(80),
    left: -scale(50),
    right: -scale(50),
    height: scale(300),
    opacity: 0.8,
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
    maxWidth: '85%',
    lineHeight: responsiveFontSize(20),
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: scale(32),
    gap: scale(8),
    paddingHorizontal: scale(8),
  },
  podiumSlot: {
    alignItems: 'center',
    flex: 1,
  },
  podiumFirst: {
    marginBottom: scale(20),
  },
  podiumAvatar: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  podiumAvatarFirst: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(24),
  },
  podiumEmoji: {
    fontSize: responsiveFontSize(24),
  },
  crownBadge: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -scale(16),
    marginBottom: scale(8),
  },
  crownText: {
    fontSize: responsiveFontSize(11),
    color: '#FFF',
  },
  podiumName: {
    fontSize: responsiveFontSize(12),
    marginBottom: scale(2),
    textAlign: 'center',
    maxWidth: scale(100),
  },
  podiumXp: {
    fontSize: responsiveFontSize(11),
  },
  yourRankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(20),
    borderRadius: scale(24),
    borderWidth: 1,
    marginBottom: scale(24),
  },
  yourRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  yourRankNumber: {
    fontSize: responsiveFontSize(28),
  },
  yourRankName: {
    fontSize: responsiveFontSize(15),
    marginBottom: scale(2),
  },
  yourRankXp: {
    fontSize: responsiveFontSize(12),
    opacity: 0.6,
  },
  rankList: {
    gap: scale(8),
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(14),
    borderRadius: scale(20),
    gap: scale(14),
  },
  rankNumber: {
    fontSize: responsiveFontSize(14),
    width: scale(28),
    textAlign: 'center',
    opacity: 0.5,
  },
  rankAvatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankEmoji: {
    fontSize: responsiveFontSize(18),
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: responsiveFontSize(14),
    marginBottom: scale(2),
  },
  rankMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  rankMetaText: {
    fontSize: responsiveFontSize(11),
    opacity: 0.5,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(2),
  },
  streakText: {
    fontSize: responsiveFontSize(10),
  },
  rankXp: {
    fontSize: responsiveFontSize(13),
  },
});

export default LeaderboardScreen;
