import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const HomeCard = () => {
  return (
    <View style={styles.cardbox}>
      {/* here a card will show about how much money i have  */}
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Your Balance</Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>
        $1,234.56
      </Text>
      <Text style={{ fontSize: 16, color: '#666', marginTop: 5 }}>
        Last updated: 2 hours ago
      </Text>
    </View>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  cardbox: {
    width: '95%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
        marginVertical: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        
  },
});
