/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: 58 + insets.bottom, // Base height + safe area
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10), // At least 10px, or safe area
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
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
