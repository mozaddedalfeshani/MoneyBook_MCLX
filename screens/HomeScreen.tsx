import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeCard from '../components/Cards/HomeCard';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomeCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});
