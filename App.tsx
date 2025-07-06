import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TabNavigator } from './src/navigation';
import { ThemeProvider, useTheme } from './src/contexts';
import { StatusBar } from 'react-native';

function AppNavigator() {
  const { currentTheme, colors } = useTheme();

  // Create custom navigation theme based on app theme
  const navigationTheme = {
    ...(currentTheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(currentTheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.white,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <TabNavigator />
    </NavigationContainer>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
