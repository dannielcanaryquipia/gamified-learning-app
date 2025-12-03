import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import StatusCard from '../../components/StatusCard/StatusCard';
import { scale } from '../../constants/responsive';
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

  // Define the type for menu items
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
      // Request permission first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your photo library to upload an image.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setLocalAvatar(selectedImage.uri);
        
        // Update the user profile with the new avatar
        if (updateUserProfile) {
          updateUserProfile({ 
            ...userProfile, 
            avatar: selectedImage.uri 
          });
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ 
                uri: localAvatar || 'https://via.placeholder.com/120?text=No+Image'
              }} 
              style={[
                styles.avatar, 
                { 
                  borderColor: colors.primary,
                  backgroundColor: isDark ? '#333' : '#f0f0f0'
                }
              ]} 
              onError={({ nativeEvent: { error } }) => {
                console.log('Image loading error:', error);
                // Set a default avatar if the image fails to load
                setLocalAvatar('https://via.placeholder.com/120?text=No+Image');
              }}
            />
            <TouchableOpacity 
              style={[
                styles.editButton, 
                { 
                  backgroundColor: colors.primary,
                  borderColor: colors.background
                }
              ]}
              onPress={pickImage}
            >
              <MaterialIcons name="edit" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={handleNamePress}>
            <View style={styles.nameContainer}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {userProfile?.name || 'Guest User'}
              </Text>
              <MaterialIcons 
                name="edit" 
                size={16} 
                color={colors.primary} 
                style={styles.editNameIcon}
              />
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
              icon={
                <MaterialIcons 
                  name={stat.icon as any} 
                  size={24} 
                  color={stat.color} 
                />
              }
            />
          ))}
        </View>

        {/* Menu Section */}
        <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.label}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && { 
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border || '#f0f0f0'
                }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuIconContainer}>
                  <MaterialIcons 
                    name={item.icon} 
                    size={24} 
                    color={item.iconColor || colors.primary} 
                  />
                </View>
                <Text style={[
                  styles.menuText, 
                  { color: item.labelStyle?.color || colors.text }
                ]}>
                  {item.label}
                </Text>
              </View>
              <MaterialIcons 
                name="keyboard-arrow-right" 
                size={24} 
                color={colors.text} 
                opacity={0.5}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Name Edit Modal */}
      <Modal
        visible={isEditingName}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsEditingName(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Name</Text>
            <TextInput
              style={[styles.nameInput, { 
                color: colors.text, 
                borderColor: colors.border || '#cccccc',
                backgroundColor: colors.background
              }]}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              placeholderTextColor={colors.text + '80'}
              autoFocus
              onSubmitEditing={handleSaveName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { borderColor: colors.border }]}
                onPress={() => setIsEditingName(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveName}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: scale(24),
    paddingBottom: scale(16),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(20),
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: scale(4),
    marginLeft: -scale(4),
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: scale(16),
    width: scale(120),
    height: scale(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    borderWidth: 3,
    resizeMode: 'cover',
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
    elevation: 3,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  userName: {
    fontSize: scale(24),
    fontWeight: 'bold',
    marginBottom: scale(4),
    textAlign: 'center',
  },
  userEmail: {
    fontSize: scale(14),
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: scale(16),
    marginBottom: scale(24),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: scale(12),
    borderRadius: 12,
    elevation: 2,
  },
  statValue: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginVertical: scale(4),
  },
  statLabel: {
    fontSize: scale(12),
    textAlign: 'center',
  },
  menuContainer: {
    margin: scale(16),
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
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
    fontSize: scale(16),
    marginLeft: scale(16),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editNameIcon: {
    marginLeft: scale(8),
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
    padding: scale(20),
    borderRadius: scale(12),
    elevation: 5,
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: scale(16),
    textAlign: 'center',
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: scale(12),
    fontSize: scale(16),
    marginBottom: scale(20),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: scale(12),
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: scale(5),
    borderWidth: 1,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});