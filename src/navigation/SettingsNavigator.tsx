import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/SettingsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import { useTheme } from '../contexts';

export type SettingsStackParamList = {
  SettingsMain: undefined;
  History: undefined;
  Calculator: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{
          headerShown: false, // SettingsScreen has its own header
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          headerShown: true,
          title: 'Transaction History',
        }}
      />
      <Stack.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          headerShown: false, // CalculatorScreen has its own header
        }}
      />
    </Stack.Navigator>
  );
}
