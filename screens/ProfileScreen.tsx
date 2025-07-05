import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <FontAwesome5 name="user" size={80} color="#007bff" />
      <Text style={styles.subtitle}>Your Profile Information</Text>
      <Text>Name: John Doe</Text>
      <Text>Email: john@example.com</Text>
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
