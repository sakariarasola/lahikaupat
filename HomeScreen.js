import React from 'react';
import { StyleSheet, View, Text, Button, Image } from 'react-native';
export default function HomeScreen({ isDarkTheme }) {
  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? 'purple' : 'turquoise' }]}>
      <Text style={[styles.header, { color: isDarkTheme ? 'silver' : 'black' }]}>
        GROCERIES NEAR ME
      </Text>
      <Image
        style={styles.image}
        source={{ uri: 'https://cdn.pixabay.com/photo/2013/07/12/14/53/cart-148964_960_720.png' }}
      />
      <Text style={[styles.text, { color: isDarkTheme ? 'silver' : 'white' }]}>
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
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});