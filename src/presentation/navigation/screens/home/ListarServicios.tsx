import React, { useEffect, useState } from 'react';
import { Button, Layout, List, ListItem, Text } from '@ui-kitten/components';
import { Alert } from 'react-native';
import { ServiceResponse } from '../../../../infrastucture/service.response';
import { useServiceStore } from '../../../store/auth/useServiceStore';
import { useAuthStore } from '../../../store/auth/useAuthStore';

export const ListarServicios = () => {
  const [servicios, setServicios] = useState<ServiceResponse[]>([]);
  const [mensaje, setMensaje] = useState<string>('');
  const { getByUser, deleteService } = useServiceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchServicios = async () => {
      if (user && user.id) {
        const resp = await getByUser();
        if (resp && resp.length > 0) {
          setServicios(resp);
        } else {
          setMensaje('No tienes servicios para eliminar.');
        }
      }
    };

    fetchServicios();
  }, [user]);

  const handleEliminarServicio = async (serviceId: string) => {
    const result = await deleteService(serviceId);
    if (result && result.status === 200) {
      Alert.alert('Éxito', 'Servicio eliminado exitosamente');
      const nuevosServicios = servicios.filter(service => service._id !== serviceId);
      setServicios(nuevosServicios);
      if (nuevosServicios.length === 0) {
        setMensaje('No tienes servicios para eliminar.');
      }
    } else {
      Alert.alert('Error', 'No se pudo eliminar el servicio');
    }
  };

  const renderItem = ({ item }: { item: ServiceResponse }) => (
    <ListItem
      title={item.nombre}
      description={item.descripcion}
      accessoryRight={() => (
        <Button onPress={() => handleEliminarServicio(item._id)}>Eliminar</Button>
      )}
    />
  );

  return (
    <Layout style={{ flex: 1 }}>
      <Layout style={{ padding: 20 }}>
        <Text category="h1">Eliminar servicios</Text>
      </Layout>
      {mensaje ? (
        <Layout style={{ padding: 20 }}>
          <Text category="s1">{mensaje}</Text>
        </Layout>
      ) : (
        <List
          data={servicios}
          renderItem={renderItem}
        />
      )}
    </Layout>
  );
};