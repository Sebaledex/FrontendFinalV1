import React, { useEffect, useState } from 'react';
import { Layout, Text, Button, List, ListItem, Avatar } from '@ui-kitten/components';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { Alert } from 'react-native';
import { ServiceResponse } from '../../../../infrastucture/service.response';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { useServiceStore } from '../../../store/useServiceStore';

const CargarImagen = () => {
  const [servicios, setServicios] = useState<ServiceResponse[]>([]);
  const [mensaje, setMensaje] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const handleSelectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setSelectedImage(uri);
        } else {
          setSelectedImage(null);
        }
      }
    });
  };

  const handleUpdateImage = async () => {
    if (!selectedServiceId) {
      Alert.alert('Error', 'No se ha seleccionado un servicio válido.');
      return;
    }

    if (!selectedImage) {
      Alert.alert('Error', 'Debes seleccionar una imagen antes de actualizar.');
      return;
    }

    const serviceToUpdate = servicios.find(service => service._id === selectedServiceId);
    if (!serviceToUpdate) {
      Alert.alert('Error', 'No se encontró el servicio seleccionado.');
      return;
    }

    const updatedService = {
      ...serviceToUpdate,
      fotos: [selectedImage], // Actualizar solo la foto
    };

    const resp = await updateService(selectedServiceId, updatedService);

    if (resp) {
      Alert.alert('Éxito', 'Imagen del servicio actualizada exitosamente');
      setSelectedServiceId(null);
      setSelectedImage(null);
      // Actualizar la lista de servicios si es necesario
      const updatedServicios = servicios.map(service =>
        service._id === selectedServiceId ? updatedService : service
      );
      setServicios(updatedServicios);
    } else {
      Alert.alert('Error', 'No se pudo actualizar la imagen del servicio');
    }
  };

  const renderItem = ({ item }: { item: ServiceResponse }) => (
    <ListItem
      title={item.nombre}
      description={item.descripcion}
      accessoryLeft={() => (
        <Avatar
          source={{ uri: item.fotos && item.fotos.length > 0 ? item.fotos[0] : undefined }}
          size="large"
          style={{ width: 80, height: 80 }}
        />
      )}
      accessoryRight={() => (
        <Button onPress={() => {
          setSelectedServiceId(item._id);
          setSelectedImage(item.fotos && item.fotos.length > 0 ? item.fotos[0] : null);
        }}>Actualizar Imagen</Button>
      )}
    />
  );

  return (
    <Layout style={{ flex: 1 }}>
      <Layout style={{ padding: 20 }}>
        <Text category="h1">Actualizar Imagen de Servicio</Text>
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
      {selectedServiceId && (
        <Layout style={{ padding: 20 }}>
          <Text category="h6">Selecciona una nueva imagen para {selectedServiceId}</Text>
          <Button onPress={handleSelectImage}>Seleccionar Imagen</Button>
          {selectedImage && (
            <Avatar
              source={{ uri: selectedImage }}
              size="giant"
              style={{ width: 200, height: 200, borderRadius: 10, marginTop: 20 }}
            />
          )}
          <Button onPress={handleUpdateImage} style={{ marginTop: 20 }}>Actualizar Imagen</Button>
        </Layout>
      )}
    </Layout>
  );
};

export default CargarImagen;
