import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import { useTheme } from '../contexts';

export type HomeStackParamList = {
  HomeMain: undefined;
  Calculator: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
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
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerShown: false, // HomeScreen has its own header
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
