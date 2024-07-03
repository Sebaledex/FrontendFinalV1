import React from 'react';
import { Button, Layout, Text, Icon } from '@ui-kitten/components';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { StyleSheet, ViewStyle } from 'react-native';

export const HomeScreenMine = ({ navigation }: Props) => {
  const handleNavigate = (screenName: string) => {
    navigation.navigate(screenName); // Navigate to the specified screen
  };

  return (
    <Layout style={styles.container}>
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
        <Button style={styles.button} onPress={() => handleNavigate('CargarImagen')}>
          Cargar imagenes
        </Button>        
      </Layout>

      {/* Botones con íconos en la parte inferior */}
      <Layout style={styles.bottomSection}>
        <Button
          style={styles.iconButton}
          onPress={() => handleNavigate('HomeScreen')}
          accessoryLeft={(props) => <Icon {...props} name='home-outline' />}
          appearance='ghost' // Añade esta línea para reducir el tamaño del texto
          size='small' // Ajusta el tamaño del ícono
        >
          Inicio
        </Button>
        <Button
          style={styles.iconButton}
          onPress={() => handleNavigate('HomeScreenMine')}
          accessoryLeft={(props) => <Icon {...props} name='cube-outline' />}
          appearance='ghost' // Añade esta línea para reducir el tamaño del texto
          size='small' // Ajusta el tamaño del ícono
        >
          Mis Servicios
        </Button>
        <Button
          style={styles.iconButton}
          onPress={() => handleNavigate('HomeServicesTaken')}
          accessoryLeft={(props) => <Icon {...props} name='bulb-outline' />}
          appearance='ghost' // Añade esta línea para reducir el tamaño del texto
          size='small' // Ajusta el tamaño del ícono
        >
          Pedidos
        </Button>
        <Button
          style={styles.iconButton}
          onPress={() => handleNavigate('HomeScreenOther')}
          accessoryLeft={(props) => <Icon {...props} name='settings-2-outline' />}
          appearance='ghost' // Añade esta línea para reducir el tamaño del texto
          size='small' // Ajusta el tamaño del ícono
        >
          Más Opciones
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
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  } as ViewStyle,
  iconButton: {
    flexDirection: 'column', // Alinear ícono y texto verticalmente
    alignItems: 'center', // Alinear ícono y texto al centro
    justifyContent: 'center', // Alinear ícono y texto al centro
    width: 100,
    marginBottom: 10,
  },
});

export default HomeScreenMine;
