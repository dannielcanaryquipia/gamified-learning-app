import { Tabs, useSegments } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import CustomTabBar from '../../components/CustomTabBar/CustomTabBar';

export default function TabLayout() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const segments = useSegments();
  
  // Hide tab bar when viewing topics or lessons
  const isTabBarVisible = !segments.some(segment => 
    segment.startsWith('topics') || 
    segment.startsWith('lessons')
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        tabBar={(props) => isTabBarVisible ? <CustomTabBar {...props} /> : null}
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Main tabs */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Tabs>
    </View>
  );
}
