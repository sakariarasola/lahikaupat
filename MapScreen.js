import { Alert, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import MapView, { Marker, } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useRef, useCallback, } from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { Icon } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import _ from 'lodash';
import { API_KEY } from '@env';

export default function MapScreen({ isDarkTheme }) {
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
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);
    const [mode, setMode] = useState('DRIVING');
    const mapRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedStoreDetails, setSelectedStoreDetails] = useState(null);

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

    const fetchNearbyStores = useCallback(_.debounce(async () => {
        if (!location || !isRegionChanged.current) return;

        const latitude = region.latitude;
        const longitude = region.longitude;
        const radius = 2000; //testiluku
        const type = 'grocery_or_supermarket';
        const apiKey = process.env.API_KEY;

        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&mode=${mode}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        setStores(data.results);
    }, 1000), [location, isRegionChanged.current, region.latitude, region.longitude, mode]);

    useEffect(() => {
        fetchNearbyStores();

        return () => {
            fetchNearbyStores.cancel();
        };
    }, [fetchNearbyStores]);



    const handleRegionChangeComplete = useCallback((newRegion) => {
        isRegionChanged.current = true;
        setRegion(newRegion);
    }, []);

    const handleMarkerPress = useCallback(async (store) => {
        setSelectedStore(store);
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${store.place_id}&fields=opening_hours&key=${API_KEY}`);
            const data = await response.json();
            if (data.result) {
                if (data.result.opening_hours) {
                    console.log(store.name, data.result.opening_hours.open_now);
                } else {
                    console.warn('No opening hours available for:', store.name);
                }
                setSelectedStoreDetails(data.result);
            } else {
                console.warn('No results found for:', store.name);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);




    const handleRoutePress = useCallback(() => {
        if (!selectedStore || !location) return;

        const origin = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };

        const destination = {
            latitude: selectedStore.geometry.location.lat,
            longitude: selectedStore.geometry.location.lng,
        };

        const coordinates = [origin, destination];
        const options = {
            edgePadding: {
                top: 50,
                right: 50,
                bottom: 200,
                left: 50,
            },
        };

        mapRef.current.fitToCoordinates(coordinates, options);
    }, [location, selectedStore, mapRef]);

    const clearRouteSelection = useCallback(() => {
        if (!selectedStore) return;
        setSelectedStore(null);
    }, [selectedStore]);

    const traceRouteOnReady = useCallback((args) => {
        if (args) {
            setDistance(args.distance);
            setDuration(args.duration);
        }
    }, []);

    const handleModeChange = (modeName) => {
        if (typeof modeName === 'string') {
            setMode(modeName.toUpperCase());
        }
    };


    return (
        <View style={styles.container}>
            <SegmentedControl
                values={['Store', 'Location']}
                selectedIndex={selectedIndex}
                onChange={(event) => {
                    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                }}
            />
            <MapView
                style={{ width: '100%', height: '100%' }}
                region={region}
                onRegionChangeComplete={handleRegionChangeComplete}
                onPress={clearRouteSelection}
                ref={mapRef}

            >

                {selectedStore && location && (
                    <MapViewDirections
                        origin={{ latitude: location?.coords.latitude, longitude: location?.coords.longitude }}
                        destination={{ latitude: selectedStore?.geometry?.location?.lat, longitude: selectedStore?.geometry?.location?.lng }}
                        apikey={API_KEY}
                        strokeColor='blue'
                        strokeWidth={5}
                        onReady={traceRouteOnReady}
                        mode={mode}
                    />
                )}
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="You are here"
                    >
                        <Icon
                            name="person" type='ionicon' color="purple"
                        />
                    </Marker>
                )}
                {stores.map((store, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: store.geometry.location.lat,
                            longitude: store.geometry.location.lng,
                        }}
                        title={store.name}
                        description={selectedStoreDetails && selectedStoreDetails.opening_hours && selectedStoreDetails.opening_hours.open_now ? 'Open' : 'Closed'}
                        onPress={() => handleMarkerPress(store)}
                        pinColor='turquoise'
                    />

                ))}
            </MapView>
            {selectedStore && (
                <View style={styles.directionsContainer}>
                    <Text style={styles.directionsText}>Route to this store: {selectedStore.name}</Text>
                    <TouchableOpacity style={styles.directionsButton} onPress={handleRoutePress}>
                        <Text style={styles.directionsButtonText}>Show route</Text>
                    </TouchableOpacity>
                    {distance && duration ? (
                        <View>
                            <Text style={styles.directionsText}>Distance: {distance.toFixed(2)} km / {(distance * 0.621371).toFixed(2)} mi</Text>
                            <Text style={styles.directionsText}>Duration: {Math.ceil(duration)} minutes</Text>
                        </View>
                    ) : null}
                </View>
            )}
            <Picker
                selectedValue={mode}
                onValueChange={handleModeChange}
                style={styles.modeSelection}
                dropdownIconColor={'black'}
            >
                <Picker.Item label="Driving" value="DRIVING" />
                {/*<Picker.Item label="Transit" value="TRANSIT" />*/}
                <Picker.Item label="Walking" value="WALKING" />
                <Picker.Item label="Bicycling" value="BICYCLING" />
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    directionsContainer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        backgroundColor: 'turquoise',
        padding: 16,
    },
    directionsText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
        color: 'white',
    },
    directionsButton: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,
        marginVertical: 5,
    },
    directionsButtonText: {
        color: 'turquoise',
        fontWeight: 'bold',
    },
    modeSelection: {
        width: "50%",
        position: "absolute",
        top: 25,
        zIndex: 1,
        backgroundColor: 'turquoise',
        opacity: 0.75,
        color: 'black',
        borderRadius: 5,
    },
});