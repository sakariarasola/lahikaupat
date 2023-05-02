import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from'@react-navigation/native';
import { createBottomTabNavigator } from'@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import SettingScreen from './SettingScreen';
import MapScreen from './MapScreen';

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    if (route.name === 'Home') {
      iconName = 'md-home';
    } else if (route.name === 'Map') {
      iconName = 'md-location';
    } else if (route.name === 'Settings') {
      iconName = 'md-settings'
    }

    return <Ionicons name={iconName} size={size} color={focused ? 'blue' : 'turquoise'} />
  }
});

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions} >
        <Tab.Screen name={'Home'} component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name={'Map'} component={MapScreen} options={{ headerShown: false }} />
        <Tab.Screen name={'Settings'} component={SettingScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}