import React from 'react';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { StyleSheet, ViewStyle } from 'react-native';
import GPSView from './GPSView';

export const HomeScreen = ({ navigation }: Props) => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    navigation.navigate('LoginScreen');
  };

  const handleNavigate = (screenName: string) => {
    navigation.navigate(screenName); // Navigate to the specified screen
  };

  return (
    <Layout style={styles.container}>
      {/* Create Service View */}
      <Layout style={styles.section}>
        <Text category='h5'>Crear Servicios</Text>
        <Button style={styles.button} onPress={() => navigation.navigate('CrearServicios')}>
          Ir a Crear Servicio
        </Button>
      </Layout>

      {/* Edit Service View */}
      <Layout style={styles.section}>
        <Text category='h5'>Editar Servicio</Text>
        <Button style={styles.button} onPress={() => navigation.navigate('EditarServicio') }>
          Ir a Editar Servicio
        </Button>
      </Layout>

      {/* List Services View */}
      <Layout style={styles.section}>
        <Text category='h5'>Listar Servicios</Text>
        <Button style={styles.button} onPress={() =>navigation.navigate('ListarServicios') }>
          Ir a Listar Servicios
        </Button>
      </Layout>

      {/* GPS View */}
      <Layout style={styles.section}>
        <Text category='h5'>GPS View</Text>
        <Button style={styles.button} onPress={() => navigation.navigate('GPSView') }>
          Ir a GPS View
        </Button>
      </Layout>

      {/* My Services Button */}
      <Layout style={styles.section}>
        <Text category='h5'>Mis Servicios</Text>
        <Button style={styles.button} onPress={() => handleNavigate('Reportes')}>
          Reporte de Servicios
        </Button>
      </Layout>

      {/* search service */}
      <Layout style={styles.section}>
        <Text category='h5'>Buscar Servicios</Text>
        <Button style={styles.button} onPress={() => handleNavigate('VerServicios')}>
          Buscar Servicios
        </Button>
      </Layout>


      {/* Logout Button */}
      <Button
        style={[styles.button, { marginTop: 'auto' }]} // Place at the bottom of the screen
        accessoryLeft={<Icon name='log-out-outline' />}
        onPress={handleLogout}
      >
        Cerrar sesión
      </Button>
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
    width: 200, // Fixed width for all buttons
  },
});

export default HomeScreen;
