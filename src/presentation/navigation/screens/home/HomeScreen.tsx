import React from 'react';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> {}

export const HomeScreen = ({ navigation }: Props) => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout(); // Asegúrate de cerrar sesión correctamente
    navigation.navigate('LoginScreen');
  };

  const handleNavigate = (screenName: keyof RootStackParams) => {
    navigation.navigate(screenName); // Navegar a la vista indicada
  };

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 30 }}>
      {/* Vista Agregar Servicio */}
      <Layout style={{ marginBottom: 30 }}>
        <Text category='h5'>Agregar Servicio</Text>
        <Button onPress={() => handleNavigate('CrearServicios')}>Ir a Agregar Servicio</Button>
      </Layout>

      {/* Vista Ver Servicios */}
      <Layout style={{ marginBottom: 30 }}>
        <Text category='h5'>Ver Servicios</Text>
        <Button onPress={() => handleNavigate('VerServicios')}>Ir a Ver Servicios</Button>
      </Layout>

      {/* Nueva Vista Register Attendance */}
      <Layout style={{ marginBottom: 30 }}>
        <Text category='h5'>Registrar Asistencia</Text>
        <Button onPress={() => handleNavigate('RegisterAttendanceScreen')}>Ir a Registrar Asistencia</Button>
      </Layout>

      {/* Botón de Cerrar Sesión */}
      <Button
        style={{ marginTop: 'auto' }} // Colocar al final de la pantalla
        accessoryLeft={<Icon name='log-out-outline' />}
        onPress={handleLogout}
      >
        Cerrar sesión
      </Button>
    </Layout>
  );
};
