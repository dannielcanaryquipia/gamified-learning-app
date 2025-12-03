import { Ionicons } from '@expo/vector-icons';
import { Tabs, useSegments } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon({ name, color, size }: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size: number;
}) {
  return <Ionicons name={name} size={size} color={color} style={{ marginBottom: -3 }} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const segments = useSegments();
  
  // Hide tab bar when viewing topics or lessons
  const isTabBarVisible = !segments.some(segment => 
    segment.startsWith('topics') || 
    segment.startsWith('lessons')
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'right', 'left']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: 4,
            display: isTabBarVisible ? 'flex' : 'none',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 4,
          },
          tabBarPosition: 'bottom',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
        }}
      >
        {/* Main tabs */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, size }) => <TabBarIcon name="home-outline" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, size }) => <TabBarIcon name="person-outline" color={color} size={size} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
