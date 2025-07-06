import React from 'react';
import { View, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SettingsScreenStyles } from '../styles/screens/settingsScreen';

export default function SettingsScreen() {
  return (
    <View style={SettingsScreenStyles.container}>
      <Text style={SettingsScreenStyles.title}>Settings Screen</Text>
      <FontAwesome5 name="cog" size={80} color="#28a745" />
      <Text style={SettingsScreenStyles.subtitle}>App Settings</Text>
      <Text>• Notifications</Text>
      <Text>• Privacy</Text>
      <Text>• Account</Text>
      <Text>• About</Text>
    </View>
  );
}
