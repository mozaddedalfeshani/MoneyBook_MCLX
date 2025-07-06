/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
          height: 80, // Increased height to show labels
          paddingTop: 5, // Add top padding
          paddingBottom: 0, // Add top padding
          paddingLeft: 0, // Add top padding
          paddingRight: 0, // Add top padding
          marginHorizontal: 14, // Add top padding
          marginBottom: 9, // Add top padding
          marginTop: 0, // Add top padding

          borderRadius: 16, // Slightly smaller radius
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 6, // Reduced shadow
          position: 'absolute', // Make it float
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
        name="Table View"
        component={TableViewNavigator}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialIcons name="table-view" size={size} color={color} />
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
