import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PageContainer from '../../components/PageContainer/PageContainer';
import { responsiveFontSize, scale } from '../../constants/responsive';
import { useApp } from '../../contexts/AppContext';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { userProfile, userProgress, updateUserProfile, streakData } = useApp();
  const colors = getThemeColors(isDark);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userProfile?.name || '');
  const [localAvatar, setLocalAvatar] = useState(userProfile?.avatar || '');

  const archivistLevel = Math.floor((userProgress?.totalXP || 0) / 1000) + 1;
  const nextLevelXP = archivistLevel * 1000;
  const levelProgress = ((userProgress?.totalXP || 0) % 1000) / 1000;

  type MenuItem = {
    icon: React.ComponentProps<typeof MaterialIcons>['name'];
    label: string;
    description?: string;
    onPress?: () => void;
    destructive?: boolean;
  };

  const actions: MenuItem[] = [
    { 
      icon: 'settings', 
      label: 'Core Configuration',
      description: 'System preferences & security',
      onPress: () => router.push('/settings')
    },
    { 
      icon: 'verified-user', 
      label: 'Archivist Credentials',
      description: 'Manage data & privacy',
      onPress: () => router.push('/credentials' as any)
    },
    { 
      icon: 'help-outline', 
      label: 'Transmission Help',
      description: 'Support & documentation',
      onPress: () => router.push('/help-support')
    },
    { 
      icon: 'logout', 
      label: 'Deactivate Session', 
      description: 'Sign out of this console',
      destructive: true,
      onPress: () => Alert.alert('Sign Out', 'Are you sure you want to sign out?')
    },
  ];

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setLocalAvatar(selectedImage.uri);
        if (updateUserProfile) {
          updateUserProfile({ ...userProfile, avatar: selectedImage.uri });
        }
      }
    } catch (error) {
       Alert.alert('Error', 'Failed to pick an image.');
    }
  };

  const handleSaveName = () => {
    if (editedName.trim() && updateUserProfile) {
      updateUserProfile({ ...userProfile, name: editedName.trim() });
      setIsEditingName(false);
    }
  };

  return (
    <PageContainer contentContainerStyle={{ paddingVertical: scale(32), paddingBottom: scale(100) }}>
      {/* Identity Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.headerTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_800ExtraBold' }]}>
            Identity{"\n"}Node
          </Text>
          <View style={[styles.levelBadge, { backgroundColor: colors.surfaceContainerHighest }]}>
             <Text style={[styles.levelText, { color: colors.primary, fontFamily: 'PlusJakartaSans_700Bold' }]}>LVL {archivistLevel}</Text>
          </View>
        </View>
        <Text style={[styles.headerSubtitle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_600SemiBold' }]}>
          Senior Archivist • Sector 7G
        </Text>
      </View>

      {/* Profiler Card - Asymmetric Layout */}
      <View style={[styles.profileCard, { backgroundColor: colors.surfaceContainerLow }]}>
        <View style={styles.cardMain}>
          <View style={styles.avatarSection}>
              <View style={styles.avatarGlowWrapper}>
                <LinearGradient
                   colors={[colors.primary, 'transparent']}
                   style={styles.avatarGlow}
                />
                <TouchableOpacity onPress={pickImage} style={[styles.avatarContainer, { backgroundColor: colors.surfaceContainer }]}>
                   {localAvatar ? (
                     <Image source={{ uri: localAvatar }} style={styles.avatarImage} />
                   ) : (
                     <MaterialIcons name="person" size={scale(48)} color={colors.onSurfaceVariant} />
                   )}
                   <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                     <MaterialIcons name="edit" size={scale(12)} color="#FFF" />
                   </View>
                </TouchableOpacity>
              </View>
          </View>
          
          <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.identitySection}>
             <Text style={[styles.name, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                {userProfile?.name || 'Inquisitor'}
             </Text>
             <Text style={[styles.handle, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
                @archivist_{userProfile?.id?.slice(0, 4) || 'node'}
             </Text>
             
             {/* Mini Level Tracker */}
             <View style={styles.miniTracker}>
                <View style={styles.trackerHeader}>
                   <Text style={[styles.trackerLabel, { color: colors.onSurfaceVariant }]}>{userProgress?.totalXP || 0} / {nextLevelXP} XP</Text>
                </View>
                <View style={[styles.progressBarBase, { backgroundColor: colors.surfaceContainerHighest }]}>
                   <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        backgroundColor: colors.primary, 
                        width: `${levelProgress * 100}%` 
                      }
                    ]} 
                   />
                </View>
             </View>
          </TouchableOpacity>
        </View>

        <View style={styles.cardStats}>
           <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>{userProgress?.topicsCompleted || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>TOPICS</Text>
           </View>
           <View style={[styles.statDivider, { backgroundColor: colors.onSurfaceVariant + '20' }]} />
           <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>{streakData?.currentStreak || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>STREAK</Text>
           </View>
           <View style={[styles.statDivider, { backgroundColor: colors.onSurfaceVariant + '20' }]} />
           <TouchableOpacity 
            onPress={() => router.push('/achievements' as any)}
            style={styles.statItem}
           >
              <Text style={[styles.statValue, { color: colors.tertiary, fontFamily: 'PlusJakartaSans_700Bold' }]}>2/12</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_700Bold' }]}>BADGES</Text>
           </TouchableOpacity>
        </View>
      </View>

      {/* Artifact Vault - Immersive Section */}
      <View style={styles.artifactVault}>
         <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>Artifact Vault</Text>
         <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => router.push('/achievements' as any)}
          style={[styles.vaultCard, { backgroundColor: colors.surfaceContainerLow }]}
         >
            <LinearGradient
               colors={[colors.tertiary + '15', 'transparent']}
               style={styles.vaultGlow}
            />
            <View style={[styles.vaultIcon, { backgroundColor: colors.tertiary + '10' }]}>
               <MaterialIcons name="auto-awesome" size={scale(28)} color={colors.tertiary} />
            </View>
            <View style={styles.vaultInfo}>
                <Text style={[styles.vaultTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>Achievements Cabinet</Text>
                <Text style={[styles.vaultDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
                  View your collection of earned artifacts and core proficiency badges.
                </Text>
            </View>
            <MaterialIcons name="arrow-forward" size={scale(20)} color={colors.tertiary} />
         </TouchableOpacity>
      </View>

      {/* Action Center - Tonal Stacking */}
      <View style={styles.actionCenter}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>System Directives</Text>
        <View style={styles.actionGrid}>
          {actions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={action.onPress}
              style={[styles.actionItem, { backgroundColor: colors.surfaceContainerLow }]}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.destructive ? '#FF3B3010' : colors.surfaceContainerHighest }]}>
                 <MaterialIcons 
                    name={action.icon} 
                    size={scale(20)} 
                    color={action.destructive ? '#FF3B30' : colors.primary} 
                 />
              </View>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionLabel, { color: action.destructive ? '#FF3B30' : colors.onSurface, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                  {action.label}
                </Text>
                <Text style={[styles.actionDesc, { color: colors.onSurfaceVariant, fontFamily: 'Manrope_500Medium' }]}>
                  {action.description}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={scale(20)} color={colors.onSurfaceVariant} opacity={0.5} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Name Edit Modal */}
      <Modal visible={isEditingName} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surfaceContainerHigh }]}>
            <Text style={[styles.modalTitle, { color: colors.onSurface, fontFamily: 'PlusJakartaSans_700Bold' }]}>Rename Node</Text>
            <TextInput
              style={[styles.nameInput, { color: colors.onSurface, backgroundColor: colors.surfaceContainerLow, borderColor: colors.primary + '30' }]}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter designator"
              placeholderTextColor={colors.onSurfaceVariant}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setIsEditingName(false)}>
                <Text style={[styles.modalBtnText, { color: colors.onSurfaceVariant }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleSaveName}>
                <Text style={[styles.modalBtnText, { color: '#FFF' }]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: scale(40),
    paddingHorizontal: scale(4),
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(12),
  },
  headerTitle: {
    fontSize: responsiveFontSize(42),
    lineHeight: responsiveFontSize(46),
    letterSpacing: -1.5,
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(14),
    opacity: 0.7,
  },
  levelBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(10),
  },
  levelText: {
    fontSize: responsiveFontSize(12),
    letterSpacing: 1,
  },
  profileCard: {
    borderRadius: scale(32),
    padding: scale(24),
    marginBottom: scale(40),
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(32),
  },
  avatarSection: {
    marginRight: scale(20),
  },
  avatarGlowWrapper: {
    position: 'relative',
    width: scale(96),
    height: scale(96),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: scale(48),
    opacity: 0.2,
  },
  avatarContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  identitySection: {
    flex: 1,
  },
  name: {
    fontSize: responsiveFontSize(22),
    marginBottom: scale(4),
  },
  handle: {
    fontSize: responsiveFontSize(13),
    opacity: 0.6,
    marginBottom: scale(16),
  },
  miniTracker: {
    width: '100%',
  },
  trackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(8),
  },
  trackerLabel: {
    fontSize: responsiveFontSize(10),
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.5,
  },
  progressBarBase: {
    height: scale(4),
    borderRadius: scale(2),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: scale(2),
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: scale(24),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: responsiveFontSize(18),
    marginBottom: scale(2),
  },
  statLabel: {
    fontSize: responsiveFontSize(9),
    opacity: 0.5,
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: scale(24),
  },
  actionCenter: {
    gap: scale(20),
    marginTop: scale(40),
  },
  artifactVault: {
    marginBottom: scale(40),
  },
  vaultCard: {
    padding: scale(24),
    borderRadius: scale(28),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(20),
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  vaultGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  vaultIcon: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaultInfo: {
    flex: 1,
  },
  vaultTitle: {
    fontSize: responsiveFontSize(18),
    marginBottom: scale(4),
  },
  vaultDesc: {
    fontSize: responsiveFontSize(12),
    lineHeight: responsiveFontSize(18),
    opacity: 0.6,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    paddingHorizontal: scale(4),
  },
  actionGrid: {
    gap: scale(12),
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(20),
  },
  actionIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: responsiveFontSize(15),
    marginBottom: scale(2),
  },
  actionDesc: {
    fontSize: responsiveFontSize(11),
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(32),
  },
  modalContent: {
    width: '100%',
    borderRadius: scale(24),
    padding: scale(24),
  },
  modalTitle: {
    fontSize: responsiveFontSize(20),
    marginBottom: scale(24),
    textAlign: 'center',
  },
  nameInput: {
    padding: scale(16),
    borderRadius: scale(12),
    fontSize: responsiveFontSize(16),
    marginBottom: scale(24),
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: scale(12),
  },
  modalBtn: {
    flex: 1,
    padding: scale(16),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: responsiveFontSize(14),
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});