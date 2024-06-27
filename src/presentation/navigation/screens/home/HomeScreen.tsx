import React from 'react';
import { Button, Icon, Layout, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { useRegisterStore } from '../../../store/useRegisterStore';
import { Alert } from 'react-native';
import { useUserStore } from '../../../store/useUserStore';

export const HomeScreen = ({ navigation }: Props) => {
  const { user } = useAuthStore();
  const { logout } = useAuthStore();
  const { createRegister, checkOut, status } = useRegisterStore();
  const { getAll } = useUserStore();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('LoginScreen');
  };

  const handleNavigate = (screenName: string) => {
    navigation.navigate(screenName); // Navegar a la vista indicada
  };

  const renderSettingsAction = () => (
    <TopNavigationAction icon={renderSettingsIcon} onPress={() => handleNavigate('UpdateInfo')} />
  );

  const renderSettingsIcon = (props: any) => (
    <Icon {...props} name='settings-outline' />
  );

  const handleCheckIn = async () => {
    const latitude = 8; // ACA METER LAS COORDENADAS
    const longitude = -6;
    const success = await createRegister(latitude, longitude);
    if (success) {
      Alert.alert('Éxito', 'Registro de entrada creado con éxito');
    } else {
      Alert.alert('Error', 'Error al crear el registro');
    }
  };

  const handleCheckOut = async () => {
    const latitude = 10; // ACA METER LAS COORDENADAS
    const longitude = -1;
    const time = new Date();
    const success = await checkOut(time, latitude, longitude);
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
