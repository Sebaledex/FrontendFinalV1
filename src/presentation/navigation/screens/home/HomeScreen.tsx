import React, { useEffect, useState } from 'react';
import { Button, Icon, Layout, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { useRegisterStore } from '../../../store/useRegisterStore';
import { useUserStore } from '../../../store/useUserStore';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';

export const HomeScreen = ({ navigation }: Props) => {
  const { user, logout } = useAuthStore();
  const { createRegister, checkOut, status } = useRegisterStore();
  const { getAll } = useUserStore();
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

  const handleLogout = async () => {
    await logout();
    navigation.navigate('LoginScreen');
  };

  const handleNavigate = (screenName: string) => {
    navigation.navigate(screenName);
  };

  const renderSettingsAction = () => (
    <TopNavigationAction icon={renderSettingsIcon} onPress={() => handleNavigate('UpdateInfo')} />
  );

  const renderSettingsIcon = (props: any) => (
    <Icon {...props} name='settings-outline' />
  );

  const handleCheckIn = async () => {
    const { latitude, longitude } = location;
    if (!latitude || !longitude) {
      Alert.alert('Error', 'No se pudo obtener la ubicación actual');
      return;
    }

    const success = await createRegister(parseFloat(latitude), parseFloat(longitude));
    if (success) {
      Alert.alert('Éxito', 'Registro de entrada creado con éxito');
    } else {
      Alert.alert('Error', 'Error al crear el registro');
    }
  };

  const handleCheckOut = async () => {
    const { latitude, longitude } = location;
    if (!latitude || !longitude) {
      Alert.alert('Error', 'No se pudo obtener la ubicación actual');
      return;
    }

    const time = new Date();
    const success = await checkOut(time, parseFloat(latitude), parseFloat(longitude));
    if (success) {
      Alert.alert('Éxito', 'Registro de salida creado con éxito');
    } else {
      Alert.alert('Error', 'Error al crear el registro');
    }
  };

  const isAdmin = user?.rol1 === 'admin';
  const isUser = user?.rol1 === 'user';
  const isWorking = status === 'working';

  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        alignment='center'
        title='Home'
        accessoryLeft={renderSettingsAction}
      />
      <Layout style={{ flex: 1, padding: 20 }}>
        <Layout style={{ alignItems: 'center', marginVertical: 20 }}>
          <Text category='h1'>Bienvenido, {user?.name ?? ''}</Text>
        </Layout>

        {(isAdmin || isUser) && !isWorking && (
          <Layout style={{ marginVertical: 20, alignItems: 'center' }}>
            <Text category='h5'>Marcar entrada</Text>
            <Button onPress={handleCheckIn} style={{ marginTop: 10 }}>Marcar Entrada</Button>
          </Layout>
        )}

        {(isAdmin || isUser) && isWorking && (
          <Layout style={{ marginVertical: 20, alignItems: 'center' }}>
            <Text category='h5'>Marcar salida</Text>
            <Button onPress={handleCheckOut} style={{ marginTop: 10 }}>Marcar Salida</Button>
          </Layout>
        )}

        {(isAdmin || isUser) && (
          <Layout style={{ marginVertical: 20, alignItems: 'center' }}>
            <Text category='h5'>Reporte Semanal</Text>
            <Button onPress={() => handleNavigate('WeeklyResumeScreen')} style={{ marginTop: 10 }}>Reporte Semanal</Button>
          </Layout>
        )}

        {isAdmin && (
          <Layout style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
            <Button onPress={() => navigation.navigate('SearchUserScreen')}>Reporte por Usuario</Button>
            <Button onPress={() => navigation.navigate('DashboardScreen')}>Dashboard</Button>
          </Layout>
        )}

        {isAdmin && (
          <Layout style={{ alignItems: 'center', marginVertical: 20 }}>
            <Button onPress={() => handleNavigate('ChangeUserRoleScreen')} style={{ marginTop: 10 }}>Cambiar Rol Usuario</Button>
          </Layout>
        )}

        <Layout style={{ alignItems: 'center', marginVertical: 20 }}>
          <Button onPress={() => handleNavigate('LocationScreen')} style={{ marginTop: 10 }}>Location Screen</Button>
        </Layout>

        <Layout style={{ alignItems: 'center', marginTop: 'auto' }}>
          <Button
            accessoryLeft={<Icon name='log-out-outline' />}
            onPress={handleLogout}
          >
            Cerrar sesión
          </Button>
        </Layout>


      </Layout>
    </Layout>
  );
};
