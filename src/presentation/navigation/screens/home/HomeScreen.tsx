import React, { useState, useEffect } from 'react';
import { Button, Layout, Text, Icon } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { useServiceStore } from '../../../store/auth/useServiceStore';
import { ServiceResponse } from '../../../../infrastucture/service.response';

export const HomeScreen = ({ navigation }: Props) => {
  const { topServices } = useServiceStore();
  const [services, setTopServices] = useState<ServiceResponse[] | null>(null); // Estado para almacenar los servicios principales

  useEffect(() => {
    const fetchTopServices = async () => {
      try {
        const data = await topServices();
        setTopServices(data || null); // Asegúrate de manejar el caso de null si no hay datos
        console.log('Servicios principales:', data);
      } catch (error) {
        console.error('Error fetching top services:', error);
      }
    };

    fetchTopServices();
  }, [topServices]); // Ejecutar cuando topServices cambie

  const handleNavigate = (screenName: string) => {
    navigation.navigate(screenName); // Navega a la pantalla especificada
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.section}>
        <Text category='h5'>Busqueda de Servicios</Text>
        <Button style={styles.button} onPress={() => handleNavigate('VerServicios')}>
          Buscar Servicios
        </Button>
      </Layout>

      {/* Muestra los servicios principales si están disponibles */}
      {services && (
        <Layout style={styles.section}>
          <Text category='h6'>Servicios Más Contratados :</Text>
          {services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.serviceName}>{service.nombre}</Text>
              <Text style={styles.serviceDescription}>{service.descripcion}</Text>
              <Text style={styles.serviceRating}>Rating: {service.rating}</Text>
            </View>
          ))}
        </Layout>
      )}

      {/* Botones con íconos en la parte inferior */}
      <Layout style={styles.bottomSection}>
        <Button
          style={styles.iconButton}
          onPress={() => handleNavigate('HomeScreen')}
          accessoryLeft={(props) => <Icon {...props} name='home-outline' />}
          appearance='ghost'
          size='small'
        >
          Inicio
        </Button>
        <Button
          style={styles.iconButton}
          onPress={() => handleNavigate('HomeScreenMine')}
          accessoryLeft={(props) => <Icon {...props} name='cube-outline' />}
          appearance='ghost'
          size='small'
        >
          Mis Servicios
        </Button>
        <Button
          style={styles.iconButton}
          onPress={() => handleNavigate('Pedidos')}
          accessoryLeft={(props) => <Icon {...props} name='bulb-outline' />}
          appearance='ghost'
          size='small'
        >
          Pedidos
        </Button>
        <Button
          style={styles.iconButton}
          onPress={() => handleNavigate('HomeScreenOther')}
          accessoryLeft={(props) => <Icon {...props} name='settings-2-outline' />}
          appearance='ghost'
          size='small'
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
    marginBottom: 20,
    alignItems: 'center',
  },
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
  },
  iconButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    marginBottom: 10,
  },
  serviceItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: '100%', // Asegúrate de que ocupe todo el ancho del padre
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  serviceRating: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default HomeScreen;
