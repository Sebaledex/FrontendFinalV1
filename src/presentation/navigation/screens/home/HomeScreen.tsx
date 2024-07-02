import React from 'react';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { StyleSheet, ViewStyle } from 'react-native';

export const HomeScreen = ({ navigation }: Props) => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    logout();
    navigation.navigate('LoginScreen');
  };

  const handleNavigate = (screenName: string) => {
    navigation.navigate(screenName); // Navigate to the specified screen
  };

  return (
    <Layout style={styles.container}>
      {/* Mis Servicios Section */}
      <Layout style={styles.section}>
        <Text category='h5'>Administrar Mis Servicios</Text>
        <Button style={styles.button} onPress={() => handleNavigate('CrearServicios')}>
          Crear Servicios
        </Button>
        <Button style={styles.button} onPress={() => handleNavigate('EditarServicio')}>
          Editar Servicio
        </Button>
        <Button style={styles.button} onPress={() => handleNavigate('ListarServicios')}>
          Eliminar Servicios
        </Button>
        <Button style={styles.button} onPress={() => handleNavigate('Reportes')}>
          Reportes de Servicios
        </Button>
      </Layout>

      {/* Home Section */}
      <Layout style={styles.section}>
        <Text category='h5'>Busqueda de Servicios</Text>
        <Button style={styles.button} onPress={() => handleNavigate('VerServicios')}>
          Buscar Servicios
        </Button>
      </Layout>

      {/* GPS and Logout Section */}
      <Layout style={styles.section}>
        <Text category='h5'>Otras Funcionalidades</Text>
        <Button style={styles.button} onPress={() => handleNavigate('GPSView')}>
          GPS View
        </Button>
        <Button
          style={styles.button}
          accessoryLeft={<Icon name='log-out-outline' />}
          onPress={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  section: {
    marginBottom: 30,
    alignItems: 'center',
  } as ViewStyle,
  button: {
    width: 200,
    marginBottom: 10,
  },
});

export default HomeScreen;
