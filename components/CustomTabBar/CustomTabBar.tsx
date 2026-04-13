import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, getThemeColors } from '../../contexts/ThemeContext';
import { useResponsive } from '../../constants/responsive';

/**
 * A completely custom, floating, pill-shaped tab bar component.
 * Provides full control over layout, scaling, and responsiveness.
 */
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const { width: screenWidth, isTablet, isDesktop, scale, isPortrait } = useResponsive();
  const insets = useSafeAreaInsets();
  const isWide = isTablet || isDesktop;

  const tabBarWidth = isWide 
    ? Math.min(320, screenWidth * 0.3) // Much smaller on desktop
    : screenWidth * 0.85; 

  const tabBarHeight = isWide ? 60 : scale(76);
  const iconSize = isWide ? 22 : scale(24);
  const wrapperWidth = isWide ? 44 : scale(56);
  const wrapperHeight = isWide ? 28 : scale(32);
  const labelSize = isWide ? 10 : scale(11);

  return (
    <View style={[
      styles.container,
      {
        width: tabBarWidth,
        backgroundColor: isDark ? 'rgba(30, 30, 30, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        left: '50%',
        marginLeft: -(tabBarWidth / 2),
        height: tabBarHeight,
        borderRadius: tabBarHeight / 2,
        bottom: Math.max(insets.bottom, isWide ? 30 : scale(20)),
        ...Platform.select({
          web: {
            boxShadow: isDark 
              ? '0px 12px 32px rgba(0, 0, 0, 0.7)' 
              : '0px 8px 32px rgba(0, 0, 0, 0.15)',
          },
          default: {
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
          },
        }),
      }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Icon configuration
        let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home-outline';
        let label = 'Home';
        
        if (route.name === 'index') {
            iconName = isFocused ? 'home-sharp' : 'home-outline';
            label = 'Home';
        } else if (route.name === 'missions') {
            iconName = isFocused ? 'rocket-sharp' : 'rocket-outline';
            label = 'Missions';
        } else if (route.name === 'leaderboard') {
            iconName = isFocused ? 'trophy-sharp' : 'trophy-outline';
            label = 'Ranks';
        } else if (route.name === 'profile') {
            iconName = isFocused ? 'person-sharp' : 'person-outline';
            label = 'Profile';
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconWrapper,
              { width: wrapperWidth, height: wrapperHeight, borderRadius: wrapperHeight / 2 },
              isFocused && { backgroundColor: `${colors.primary}15` }
            ]}>
              <Ionicons 
                name={iconName} 
                size={iconSize} 
                color={isFocused ? colors.primary : colors.placeholder} 
              />
            </View>
            <Text style={[
              styles.label,
              { color: isFocused ? colors.primary : colors.placeholder, fontSize: labelSize }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    zIndex: 1000,
    borderWidth: 0,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontWeight: '700',
  },
});

export default CustomTabBar;
