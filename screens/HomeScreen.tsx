import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function HomeScreen() {
  const handleButtonPress = () => {
    // You can replace this with actual functionality later
    console.log('Button Pressed!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Home!</Text>
      <Text>This is the home screen</Text>
      <Image
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFYqoKTu_o3Zns2yExbst2Co84Gpc2Q1RJbA&s',
        }}
        style={styles.image}
      />
      <Button title="Click Me" onPress={handleButtonPress} />
      <FontAwesome5 name="tachometer" size={50} color="#000" />
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
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});
