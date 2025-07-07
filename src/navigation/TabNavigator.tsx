/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../contexts';

// Import our screen components
import HomeNavigator from './HomeNavigator';
import TableViewNavigator from './TableViewNavigator';
import SettingsNavigator from './SettingsNavigator';

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { colors, currentTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor:
            currentTheme === 'light' ? colors.white : colors.background,
          backdropFilter: 'blur(10px)',
          borderTopWidth: 0, // Remove top border
          height: 70, // Fixed height without safe area
          paddingTop: 5, // Add top padding
          paddingBottom: 10, // Fixed bottom padding
          paddingLeft: 0,
          paddingRight: 0,
          marginHorizontal: 16,
          marginBottom: insets.bottom + 16, // Margin from bottom edge
          marginTop: 0,
          borderRadius: 16,
          shadowColor: currentTheme === 'light' ? '#000' : colors.shadowPrimary,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: currentTheme === 'light' ? 0.15 : 0.25,
          shadowRadius: 12,
          elevation: 8,
          position: 'absolute', // Make it floating
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
          marginTop: 1,
          marginBottom: 1,
        },
        tabBarIconStyle: {
          marginTop: 6,
          marginBottom: 3,
        },
        headerShown: false,
        // Add keyboard handling
        tabBarHideOnKeyboard: Platform.OS === 'android', // Hide tab bar on Android when keyboard appears
        tabBarKeyboardHidesTabBar: true, // This helps with keyboard behavior
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color, size }) => {
            let iconName: string = 'home';
            return <AntDesign name={iconName} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={TableViewNavigator}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialIcons
                name="account-balance-wallet"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => {
            let iconName = 'setting';
            return <AntDesign name={iconName} size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
