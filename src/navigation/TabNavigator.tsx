/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../contexts';

// Import our screen components
import HomeScreen from '../screens/HomeScreen';
import TableViewNavigator from './TableViewNavigator';
import SettingsNavigator from './SettingsNavigator';

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.white,
          backdropFilter: 'blur(10px)',
          borderTopWidth: 0, // Remove top border
          height: 80 + insets.bottom, // Increased height to show labels + safe area
          paddingTop: 5, // Add top padding
          paddingBottom: Math.max(insets.bottom, 10), // Ensure proper bottom padding
          paddingLeft: 0,
          paddingRight: 0,
          marginHorizontal: 14,
          marginBottom: 0, // Remove bottom margin to prevent issues
          marginTop: 0,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 6,
          // Remove position: 'absolute' to fix keyboard behavior
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
        component={HomeScreen}
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
