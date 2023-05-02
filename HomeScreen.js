import React from 'react';
import { StyleSheet, View, Text, Button, Image } from 'react-native';
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        GROCERIES NEAR ME
      </Text>
      <Image
        style={styles.image}
        source={{uri: 'https://cdn.pixabay.com/photo/2013/07/12/14/53/cart-148964_960_720.png'}}
      />
      <Text style={styles.text}>
        Hi there! Do you need food or other groceries but don't know where the closest stores are? I can help you! Please click the Map button to begin your search.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'turquoise',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    color: 'white',
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30,
  }
});