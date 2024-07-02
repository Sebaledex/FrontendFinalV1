import React, { useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button, Layout, Text } from '@ui-kitten/components';
import { MyIcon } from '../../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../StackNavigator';
import Geolocation, { GeolocationResponse, GeolocationError } from '@react-native-community/geolocation';

interface Props extends StackScreenProps<RootStackParams, 'GPSView'> {}

export const GPSView = ({ navigation }: Props) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else {
      getCurrentLocation();
    }
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de Acceso a la Ubicación',
          message: 'Esta aplicación necesita acceder a tu ubicación',
          buttonNeutral: 'Preguntar Luego',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert('Permiso Denegado', 'No se puede acceder a la ubicación');
      }
    } catch (err) {
      console.warn(err);
      setErrorMsg('Error al solicitar el permiso de ubicación');
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        console.log('Latitud:', latitude, 'Longitud:', longitude);
      },
      (error: GeolocationError) => {
        Alert.alert('Error al obtener la ubicación', error.message);
        setErrorMsg(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Layout style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
          >
            {location && (
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="Ubicación Actual"
                description="Aquí estás ahora"
              />
            )}
          </MapView>
        ) : (
          <Text category="h5" style={styles.loadingText}>
            {errorMsg ? errorMsg : 'Obteniendo ubicación...'}
          </Text>
        )}
      </View>
      <Button style={styles.button} onPress={handleBack} accessoryLeft={<MyIcon name="arrow-back-outline" />}>
        Volver
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    margin: 20,
  },
});

export default GPSView;
