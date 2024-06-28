import React, { useEffect, useState } from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { Alert, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { MyIcon } from '../../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'LocationScreen'> {}

export const LocationScreen = ({ navigation }: Props) => {
  const [location, setLocation] = useState({ latitude: '', longitude: '' });

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
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude: latitude.toString(), longitude: longitude.toString() });
        console.log('Latitud:', latitude, 'Longitud:', longitude);
      },
      (error) => {
        Alert.alert('Error al obtener la ubicación', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView style={{ marginHorizontal: 40, marginTop: 40 }}>
        <Layout style={{ paddingTop: 20 }}>
          <Text category="h1">Ubicación Actual</Text>
          <Text category="p2">Ver la ubicación actual</Text>
        </Layout>

        {/* Datos de Ubicación */}
        <Layout style={{ marginTop: 20 }}>
          <Text category="h5">Latitud:</Text>
          <Text category="p1">{location.latitude || 'Obteniendo...'}</Text>
          <Text category="h5" style={{ marginTop: 10 }}>Longitud:</Text>
          <Text category="p1">{location.longitude || 'Obteniendo...'}</Text>
        </Layout>

        {/* Space */}
        <Layout style={{ height: 10 }} />

        {/* Botón */}
        <Layout style={{ marginTop: 20 }}>
          <Button onPress={handleBack} accessoryLeft={<MyIcon name="arrow-back-outline" />}>
            Volver
          </Button>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
