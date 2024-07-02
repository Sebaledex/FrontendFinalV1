import React, { useEffect, useState } from 'react';
import { Layout, Text, Button, List, ListItem, useStyleSheet } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../StackNavigator';
import { StyleSheet } from 'react-native';
import { useServiceStore } from '../../../store/auth/useServiceStore';
import { ServiceResponse } from '../../../../infrastucture/service.response';


type Props = StackScreenProps<RootStackParams, 'Reportes'>;

export const Reportes = ({ navigation }: Props) => {
  const [services, setServices,] = useState<ServiceResponse[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
       // const data = await getServicesByUser(); // Asumiendo que tienes una función para obtener servicios por usuario
        //setServices( || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const renderItem = ({ item }: { item: ServiceResponse }) => (
    <ListItem
      title={item.nombre}
      description={`Descripción: ${item.descripcion}, Precio: ${item.precio}`}
      onPress={() => {/* Define qué hacer al hacer clic en un servicio si es necesario */}}
    />
  );

  return (
    <Layout style={styles.container}>
      <Text category='h1'>Mis Servicios</Text>
      {services.length > 0 ? (
        <List
          data={services}
          renderItem={renderItem}
        />
      ) : (
        <Text>No hay servicios disponibles</Text>
      )}
      <Button onPress={() => navigation.navigate('HomeScreen')}>Volver a Inicio</Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

