import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useLocationStore } from '../../../store/useLocationStore';
import { Location } from '../../../../infrastucture/interfaces/location';
import { LoadingScreen } from '../loading/LoadingScreen';
// Ajusta la ruta según tu proyecto

const GPSView = () => {
  const { lastKnownLocation, getLocation } = useLocationStore();
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [selectingLocation, setSelectingLocation] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    if (lastKnownLocation === null) {
      getLocation();
    }
  }, []);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    if (selectingLocation === 'start') {
      setStartLocation({ latitude, longitude });
      setSelectingLocation(null);
    } else if (selectingLocation === 'end') {
      setEndLocation({ latitude, longitude });
      setSelectingLocation(null);
    }
  };

  const handleSetStartLocation = () => {
    setSelectingLocation('start');
    Alert.alert("Seleccionar Ubicación", "Toca el mapa para seleccionar tu ubicación.");
  };

  const handleSetEndLocation = () => {
    setSelectingLocation('end');
    Alert.alert("Seleccionar Destino", "Toca el mapa para seleccionar tu destino.");
  };

  if (lastKnownLocation === null) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lastKnownLocation.latitude,
          longitude: lastKnownLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {startLocation && (
          <Marker
            coordinate={startLocation}
            title="Tu Ubicación"
            pinColor="blue"
          />
        )}

        {endLocation && (
          <Marker
            coordinate={endLocation}
            title="Destino"
            pinColor="red"
          />
        )}

        {startLocation && endLocation && (
          <MapViewDirections
            origin={startLocation}
            destination={endLocation}
            apikey="AIzaSyBY8DYLuWedzLTyIuheuMUfjG6OtTfYalo" // Reemplaza con tu clave de API
            strokeWidth={3}
            strokeColor="hotpink"
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Tu Ubicación" onPress={handleSetStartLocation} />
        <Button title="Destino" onPress={handleSetEndLocation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingBottom: 20,
  },
});

export default GPSView;
