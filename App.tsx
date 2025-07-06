import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './src/navigation';
import { ThemeProvider } from './src/contexts';

function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
