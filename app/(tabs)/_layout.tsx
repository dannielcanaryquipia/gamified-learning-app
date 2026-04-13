import { Tabs, useSegments } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import CustomTabBar from '../../components/CustomTabBar/CustomTabBar';

export default function TabLayout() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const segments = useSegments();
  
  // Hide tab bar when viewing topics or lessons
  const isTabBarVisible = !segments.some((segment: string) => 
    segment.startsWith('topics') || 
    segment.startsWith('lessons')
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[isDark ? 'rgba(139, 172, 255, 0.12)' : 'rgba(0, 108, 251, 0.08)', 'transparent']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          zIndex: 1,
        }}
        pointerEvents="none"
      />
      <Tabs
        tabBar={(props: any) => isTabBarVisible ? <CustomTabBar {...props} /> : null}
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
          name="missions"
          options={{
            title: 'Missions',
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Rankings',
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
