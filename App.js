import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker,} from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import MapViewDirections from 'react-native-maps-directions';

export default function App() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 60.1713252,
    longitude: 24.9440963,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const isRegionChanged = useRef(false);

  useEffect(() => {
    async function getLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location');
        return;
      };
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      });
    }

    getLocation();
  }, []);

  useEffect(() => {
    async function fetchNearbyStores() {
      if (!location || !isRegionChanged.current) return;

      const latitude = region.latitude;
      const longitude = region.longitude;
      const radius = 2000; //testiluku
      const type = 'grocery_or_supermarket';
      const apiKey = 'AIzaSyAogHCCpAuSxLePGRwr18mXj6iNJwwBdlM';

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      setStores(data.results);
    }

    fetchNearbyStores();
  }, [region]);

  const handleRegionChangeComplete = (newRegion) => {
    isRegionChanged.current = true;
    setRegion(newRegion);
  };

  const handleMarkerPress = (store) => {
    setSelectedStore(store);
  }

  const handleRoutePress = () => {
    if (!selectedStore) return;

    setSelectedStore(null);
  }

  return (
    <View style={styles.container}>
      <MapView
        style={{ width: '100%', height: '100%' }}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {selectedStore && location && (
        <MapViewDirections
          origin={{ latitude: location?.coords.latitude, longitude: location?.coords.longitude }}
          destination={{ latitude: selectedStore?.geometry.location.lat, longitude: selectedStore?.geometry.location.lng }}
          apikey={'AIzaSyAogHCCpAuSxLePGRwr18mXj6iNJwwBdlM'}
        />
        )}
        {stores.map((store, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: store.geometry.location.lat,
              longitude: store.geometry.location.lng
            }}
            title={store.name}
            onPress={() => handleMarkerPress(store)}
          />
        ))}
      </MapView>
      {selectedStore && (
        <View style={styles.directionsContainer}>
          <Text style={styles.directionsText}>Route to this store? {selectedStore.name}</Text>
          <TouchableOpacity style={styles.directionsButton} onPress={handleRoutePress}>
            <Text style={styles.directionsButtonText}>Get route</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionsContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'white',
    padding: 16,
  },
  directionsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  directionsButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});