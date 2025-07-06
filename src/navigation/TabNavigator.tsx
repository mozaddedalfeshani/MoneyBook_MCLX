/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
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
