import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import SettingScreen from './SettingScreen';
import MapScreen from './MapScreen';

const Tab = createBottomTabNavigator();

export default function App() {

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const theme = isDarkTheme ? DarkTheme : DefaultTheme;

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

      return <Ionicons name={iconName} size={size} color={focused ? (isDarkTheme ? 'silver' : 'blue') : (isDarkTheme ? 'purple' : 'turquoise')} />

    }
  });


  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator screenOptions={screenOptions} >
        <Tab.Screen name={'Home'} options={{
          headerShown: false, tabBarStyle: {
            backgroundColor: isDarkTheme ? 'black' : 'white',
          },
          tabBarLabelStyle: {
            color: isDarkTheme ? 'white' : 'silver',
            fontSize: 14,
            fontWeight: 'bold',
          },
        }}>
          {() => (
            <HomeScreen isDarkTheme={isDarkTheme} />
          )}
        </Tab.Screen>

        <Tab.Screen name={'Map'} component={MapScreen} options={{
          headerShown: false, tabBarStyle: {
            backgroundColor: isDarkTheme ? 'black' : 'white',
          },
          tabBarLabelStyle: {
            color: isDarkTheme ? 'white' : 'silver',
            fontSize: 14,
            fontWeight: 'bold',
          },
        }} />
        <Tab.Screen
          name="Settings"
          options={{
            headerShown: false, tabBarStyle: {
              backgroundColor: isDarkTheme ? 'black' : 'white',
            },
            tabBarLabelStyle: {
              color: isDarkTheme ? 'white' : 'silver',
              fontSize: 14,
              fontWeight: 'bold',
            },
          }}
        >
          {() => (
            <SettingScreen toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}