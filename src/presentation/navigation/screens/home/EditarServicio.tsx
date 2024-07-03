import React, { useEffect, useState } from 'react';
import { Button, Input, Layout, List, ListItem, Text, Avatar } from '@ui-kitten/components';
import { Alert } from 'react-native';
import { ServiceResponse } from '../../../../infrastucture/service.response';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { Service } from '../../../../domain/entities/service.entity';
import { useServiceStore } from '../../../store/useServiceStore';

export const EditarServicio = () => {
  const [servicios, setServicios] = useState<ServiceResponse[]>([]);
  const [mensaje, setMensaje] = useState<string>('');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceData, setNewServiceData] = useState<Service>({
    nombre: '',
    descripcion: '',
    precio: '',
    contacto: '',
    fotos: []
  });
  const [firstImage, setFirstImage] = useState<string | null>(null); // Estado para la primera imagen
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
        contacto: serviceToEdit.contacto || '',
        fotos: serviceToEdit.fotos || [] // Asegurarse de inicializar las fotos correctamente
      });

      // Mostrar la primera imagen si existe
      if (serviceToEdit.fotos && serviceToEdit.fotos.length > 0) {
        setFirstImage(serviceToEdit.fotos[0]);
      } else {
        setFirstImage(null); // No hay imágenes
      }
    }
  };

  const cancelEditing = () => {
    setEditingServiceId(null);
    setNewServiceData({
      nombre: '',
      descripcion: '',
      precio: '',
      contacto: '',
      fotos: []
    });
    setFirstImage(null);
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
        <Layout style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <Input
            label="Nombre"
            value={newServiceData.nombre}
            onChangeText={value => setNewServiceData({ ...newServiceData, nombre: value })}
            style={{ marginBottom: 10 }}
          />
          <Input
            label="Descripción"
            value={newServiceData.descripcion}
            onChangeText={value => setNewServiceData({ ...newServiceData, descripcion: value })}
            style={{ marginBottom: 10 }}
          />
          <Input
            label="Precio"
            value={newServiceData.precio}
            onChangeText={value => setNewServiceData({ ...newServiceData, precio: value })}
            style={{ marginBottom: 10 }}
          />
          <Input
            label="Contacto"
            value={newServiceData.contacto}
            onChangeText={value => setNewServiceData({ ...newServiceData, contacto: value })}
            style={{ marginBottom: 10 }}
          />
          {firstImage && (
            <Avatar
              source={{ uri: firstImage }}
              size="giant" // Tamaño grande
              style={{ width: 200, height: 200, borderRadius: 10, marginRight: 10 }}// Borde redondeado
            />
          )}
          <Button onPress={() => handleUpdateService(item._id)} style={{ marginBottom: 10 }}>Actualizar Datos</Button>
          <Button onPress={cancelEditing} appearance="outline">Cancelar</Button>
        </Layout>
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
