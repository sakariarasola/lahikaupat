import React from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';

export default function SettingScreen({ toggleTheme, isDarkTheme }) {

  return (
    <View style={[styles.container, isDarkTheme && styles.darkContainer]}>
      <View style={styles.setting}>
        <Text style={[styles.settingText, isDarkTheme && styles.darkText]}>Dark Mode</Text>
        <Switch value={isDarkTheme} onValueChange={toggleTheme} trackColor={{false: 'black', true: 'silver'}} thumbColor={isDarkTheme ? 'green' : 'red'}/>
      </View>
      <Text style={[styles.text, isDarkTheme && styles.darkText]}>Known issues:{"\n"}
        - Wrong marker information when moving the map{"\n"}
        - All stores are not shown on map (API issue?){"\n"}
        - Map view keeps resetting its direction after panning the map{"\n"}
        - Possible wrong store open/closed status initially, tap a store twice to show correct status{"\n"}
        - No support for dark mode in Map screen{"\n"}
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
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: '50%',
    flexDirection: 'row',
    color: 'black',
    paddingHorizontal: 10,
  }, setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    width: '100%',
    zIndex: 1,
    paddingHorizontal: 10,
  },
  settingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 10,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  darkText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: '50%',
    flexDirection: 'row',
    color: 'silver',
    paddingHorizontal: 10,
  },

});