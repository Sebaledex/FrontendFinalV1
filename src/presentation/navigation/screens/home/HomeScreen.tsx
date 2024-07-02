import React from 'react';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';

export const HomeScreen = ({ navigation }: Props) => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    navigation.navigate('LoginScreen');
  };

  const handleNavigate = (screenName: string) => {
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

      {/* Vista Listar Servicios */}
      <Layout style={{ marginBottom: 30 }}>
        <Text category='h5'>Listar Servicios</Text>
        <Button onPress={() => handleNavigate('ListarServicios')}>Ir a Listar Servicios</Button>
      </Layout>

      {/* Vista Editar Servicio */}
      <Layout style={{ marginBottom: 30 }}>
        <Text category='h5'>Editar Servicio</Text>
        <Button onPress={() => handleNavigate('EditarServicio')}>Ir a Editar Servicio</Button>
      </Layout>

      {/* Vista GPS */}
      <Layout style={{ marginBottom: 30 }}>
        <Text category='h5'>Ver GPS</Text>
        <Button onPress={() => handleNavigate('GPSView')}>Ir a Ver GPS</Button>
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
