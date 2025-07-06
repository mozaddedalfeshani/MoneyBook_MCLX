import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="truck-loading" size={80} color="#28a745" />
      <Text>Settings</Text>
      <Text>Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 15,
    color: '#666',
  },
});
