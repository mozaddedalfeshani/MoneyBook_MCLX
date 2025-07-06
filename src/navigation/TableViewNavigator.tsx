import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TableViewScreen from '../screens/TableViewScreen';
import AccountDetailScreen from '../screens/AccountDetailScreen';
import { useTheme } from '../contexts';

export type TableViewStackParamList = {
  TableViewMain: undefined;
  AccountDetail: {
    accountId: string;
    accountName: string;
  };
};

const Stack = createStackNavigator<TableViewStackParamList>();

export default function TableViewNavigator() {
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
        name="TableViewMain"
        component={TableViewScreen}
        options={{
          headerShown: false, // TableViewScreen has its own header
        }}
      />
      <Stack.Screen
        name="AccountDetail"
        component={AccountDetailScreen}
        options={{
          headerShown: true,
          title: 'Account Details',
        }}
      />
    </Stack.Navigator>
  );
}
