import React, { useEffect, useState } from 'react';
import { Button, Input, Layout, List, ListItem, Text } from '@ui-kitten/components';
import { Alert } from 'react-native';
import { ServiceResponse } from '../../../../infrastucture/service.response';
import { useServiceStore } from '../../../store/auth/useServiceStore';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { Service } from '../../../../domain/entities/service.entity';

export const EditarServicio = () => {
  const [servicios, setServicios] = useState<ServiceResponse[]>([]);
  const [mensaje, setMensaje] = useState<string>('');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceData, setNewServiceData] = useState<Service>({
    nombre: '',
    descripcion: '',
    precio: '',
    contacto: ''
  });
  const { getByUser, updateService } = useServiceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchServicios = async () => {
      if (user && user.id) {
        const resp = await getByUser();
        if (resp && resp.length > 0) {
          setServicios(resp);
        } else {
          setMensaje('No tienes servicios para editar.');
        }
      }
    };

    fetchServicios();
  }, [user]);

  const toggleEditingMode = (serviceId: string) => {
    setEditingServiceId(serviceId);
    const serviceToEdit = servicios.find(service => service._id === serviceId);
    if (serviceToEdit) {
      setNewServiceData({
        nombre: serviceToEdit.nombre,
        descripcion: serviceToEdit.descripcion,
        precio: serviceToEdit.precio || '',
        contacto: serviceToEdit.contacto || ''
      });
    }
  };

  const cancelEditing = () => {
    setEditingServiceId(null);
    setNewServiceData({
      nombre: '',
      descripcion: '',
      precio: '',
      contacto: ''
    });
  };

  const handleUpdateService = async (serviceId: string) => {
    const resp = await updateService(serviceId, newServiceData);
    if (resp) {
      Alert.alert('Éxito', 'Datos del servicio actualizados exitosamente');
      setEditingServiceId(null);
      const updatedServicios = servicios.map(service =>
        service._id === serviceId ? { ...service, ...newServiceData } : service
      );
      setServicios(updatedServicios);
    } else {
      Alert.alert('Error', 'No se pudo actualizar el servicio');
    }
  };

  const renderItem = ({ item }: { item: ServiceResponse }) => {
    if (editingServiceId === item._id) {
      return (
        <ListItem>
          <Input
            label="Nombre"
            value={newServiceData.nombre}
            onChangeText={value => setNewServiceData({ ...newServiceData, nombre: value })}
          />
          <Input
            label="Descripción"
            value={newServiceData.descripcion}
            onChangeText={value => setNewServiceData({ ...newServiceData, descripcion: value })}
          />
          <Input
            label="Precio"
            value={newServiceData.precio}
            onChangeText={value => setNewServiceData({ ...newServiceData, precio: value })}
          />
          <Input
            label="Contacto"
            value={newServiceData.contacto}
            onChangeText={value => setNewServiceData({ ...newServiceData, contacto: value })}
          />
          <Button onPress={() => handleUpdateService(item._id)}>Actualizar Datos</Button>
          <Button onPress={cancelEditing}>Cancelar</Button>
        </ListItem>
      );
    } else {
      return (
        <ListItem
          title={item.nombre}
          description={item.descripcion}
          accessoryRight={() => (
            <Button onPress={() => toggleEditingMode(item._id)}>Editar</Button>
          )}
        />
      );
    }
  };

  return (
    <Layout style={{ flex: 1 }}>
      <Layout style={{ padding: 20 }}>
        <Text category="h1">Editar servicios</Text>
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
