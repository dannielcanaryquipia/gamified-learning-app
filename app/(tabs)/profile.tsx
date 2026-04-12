import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PageContainer from '../../components/PageContainer/PageContainer';
import StatusCard from '../../components/StatusCard/StatusCard';
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

  // Stats data
  const stats = [
    {
      label: 'Topic' + (userProgress?.topicsCompleted !== 1 ? 's' : ''),
      value: userProgress?.topicsCompleted || 0,
      icon: 'menu-book',
      color: colors.primary,
      bgColor: `${colors.primary}10`
    },
    {
      label: 'XP',
      value: userProgress?.totalXP || 0,
      icon: 'bolt',
      color: colors.secondary,
      bgColor: `${colors.secondary}10`
    },
    {
      label: 'Day Streak',
      value: `${streakData?.currentStreak || 0}${streakData?.currentStreak ? ' 🔥' : ''}`,
      icon: 'whatshot',
      color: '#FFC107',
      bgColor: '#FFC10710'
    },
  ];

  type MenuItem = {
    icon: React.ComponentProps<typeof MaterialIcons>['name'];
    label: string;
    labelStyle?: { color: string };
    iconColor?: string;
    onPress?: () => void;
  };

  const menuItems: MenuItem[] = [
    { 
      icon: 'settings', 
      label: 'Settings',
      onPress: () => router.push('/settings')
    },
    { 
      icon: 'help-outline', 
      label: 'Help & Support',
      onPress: () => router.push('/help-support')
    },
    { 
      icon: 'info-outline', 
      label: 'About',
      onPress: () => router.push('/about')
    },
    { 
      icon: 'logout', 
      label: 'Sign Out', 
      labelStyle: { color: '#FF3B30' },
      iconColor: '#FF3B30',
      onPress: () => Alert.alert('Sign Out', 'Are you sure you want to sign out?')
    },
  ];

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your photo library to upload an image.');
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
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      updateUserProfile({ ...userProfile, name: editedName.trim() });
      setIsEditingName(false);
    }
  };

  const handleNamePress = () => {
    setEditedName(userProfile?.name || '');
    setIsEditingName(true);
  };

  return (
    <PageContainer
      scrollable={true}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Section */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: localAvatar }} 
            style={[styles.avatar, { borderColor: colors.primary, backgroundColor: isDark ? '#333' : '#f0f0f0' }]}
          />
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.primary, borderColor: colors.background }]}
            onPress={pickImage}
          >
            <MaterialIcons name="edit" size={scale(16)} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={handleNamePress} style={styles.nameSection}>
          <View style={styles.nameContainer}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {userProfile?.name || 'Guest User'}
            </Text>
            <MaterialIcons name="edit" size={scale(18)} color={colors.primary} style={styles.editNameIcon} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {stats.map((stat) => (
          <StatusCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            color={stat.color}
            backgroundColor={stat.bgColor}
            icon={<MaterialIcons name={stat.icon as any} size={scale(24)} color={stat.color} />}
          />
        ))}
      </View>

      {/* Menu Section */}
      <View style={[styles.menuContainer, { backgroundColor: colors.card, borderTopColor: colors.border, borderBottomColor: colors.border }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={item.label}
            style={[styles.menuItem, index !== menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuIconContainer}>
                <MaterialIcons name={item.icon} size={scale(24)} color={item.iconColor || colors.primary} />
              </View>
              <Text style={[styles.menuText, { color: item.labelStyle?.color || colors.text }]}>
                {item.label}
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={scale(24)} color={colors.placeholder} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Name Edit Modal */}
      <Modal
        visible={isEditingName}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsEditingName(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsEditingName(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={[styles.modalContent, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Name</Text>
            <TextInput
              style={[styles.nameInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              placeholderTextColor={colors.placeholder}
              autoFocus
              onSubmitEditing={handleSaveName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { borderColor: colors.border }]}
                onPress={() => setIsEditingName(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.primary, borderBlockColor: colors.primary }]}
                onPress={handleSaveName}
              >
                <Text style={[styles.modalButtonText, { color: '#FFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: scale(24),
  },
  headerTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: scale(32),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: scale(16),
  },
  avatar: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    borderWidth: 3,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      },
      default: {
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
    }),
  },
  nameSection: {
    paddingHorizontal: scale(16),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editNameIcon: {
    marginLeft: scale(8),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(32),
    gap: scale(12),
  },
  menuContainer: {
    borderRadius: scale(16),
    overflow: 'hidden',
    borderWidth: 1,
  },
  menuItem: {
    padding: scale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: scale(32),
    alignItems: 'center',
  },
  menuText: {
    fontSize: responsiveFontSize(16),
    marginLeft: scale(12),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  modalContent: {
    width: '100%',
    maxWidth: scale(400),
    padding: scale(24),
    borderRadius: scale(20),
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
      },
      default: {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  modalTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    marginBottom: scale(20),
    textAlign: 'center',
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: scale(12),
    padding: scale(14),
    fontSize: responsiveFontSize(16),
    marginBottom: scale(24),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(12),
  },
  modalButton: {
    flex: 1,
    padding: scale(14),
    borderRadius: scale(12),
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
  },
});