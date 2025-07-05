import { Button, Image, StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

function App() {
  function alert(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={styles.container}>
      <Text>This is the text things</Text>
      <Image
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFYqoKTu_o3Zns2yExbst2Co84Gpc2Q1RJbA&s',
        }}
        style={styles.image}
      />
      <Button title="Click Me" onPress={() => alert('Button Pressed!')} />
      <FontAwesome5 name="tachometer" size={50} color="#000" />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});
