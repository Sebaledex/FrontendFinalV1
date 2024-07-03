import React, { useState, useEffect, useCallback } from 'react';
import { Button, Layout, Text, Icon, Avatar } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { useServiceStore } from '../../../store/useServiceStore';
import { useFocusEffect } from '@react-navigation/native';
import { ServiceResponse } from '../../../../infrastucture/service.response';

export const HomeScreen = ({ navigation }: Props) => {
  const { topServices } = useServiceStore();
  const [services, setTopServices] = useState<ServiceResponse[] | null>(null); // Estado para almacenar los servicios principales

  const fetchTopServices = async () => {
    try {
      const data = await topServices();
      setTopServices(data || null); // Asegúrate de manejar el caso de null si no hay datos
    } catch (error) {
      console.error('Error fetching top services:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTopServices();
    }, [])
  );

  const handleNavigate = (screenName: string) => {
    navigation.navigate(screenName); // Navega a la pantalla especificada
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.section}>
        <Text category='h5'>Búsqueda de Servicios</Text>
        <Button style={styles.button} onPress={() => handleNavigate('VerServicios')}>
          Buscar Servicios
        </Button>
      </Layout>

      {/* Muestra los servicios principales si están disponibles */}
      {services && services.length > 0 && (
        <Layout style={styles.section}>
          <Text category='h6'>Servicios Más Contratados:</Text>
          {services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Avatar
                source={{ uri: service.fotos && service.fotos.length > 0 ? service.fotos[0] : undefined }}
                size='large'
                style={styles.serviceImage}
              />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.nombre}</Text>
                <Text style={styles.serviceDescription}>{service.descripcion}</Text>
                <Text style={styles.serviceRating}>Rating: {service.rating}</Text>
              </View>
            </View>
          ))}
        </Layout>
      )}

      {/* Botones con íconos en la parte inferior */}
      <Layout style={styles.bottomSection}>
        <Button
          style={styles.iconButton}
          onPress={() => {
            fetchTopServices();
            handleNavigate('HomeScreen');
          }}
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
          onPress={() => handleNavigate('HomeServicesTaken')}
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
    flexDirection: 'row', // Alinea elementos en horizontal
    alignItems: 'center', // Alinea verticalmente al centro
    width: '100%', // Asegúrate de que ocupe todo el ancho del padre
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Para hacerla circular
    marginRight: 10,
  },
  serviceInfo: {
    flex: 1, // Ocupa el espacio disponible
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
