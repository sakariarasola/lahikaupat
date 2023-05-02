import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
export default function SettingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Known bugs:{"\n"}
            - Wrong marker information when moving the map{"\n"}
            - The map doesn't initially fit to coordinates when pressing a marker, only after pressing the transport mode button
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
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: '50%',
    flexDirection: 'row',
  }
});