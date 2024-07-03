import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Alert, ScrollView, Image } from 'react-native';
import { useServiceStore } from '../../../store/useServiceStore';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

export const CrearServicios = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [contacto, setContacto] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const { createService } = useServiceStore();

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
          setFoto(uri);
        } else {
          setFoto(null);
        }
      }
    });
  };

  const handleCrearServicio = async () => {
    // Validar que el precio sea un número
    if (nombre.length === 0 || descripcion.length === 0 || !/^(\d+\.?\d*|\.\d+)$/.test(precio) || contacto.length === 0 || !foto) {
      Alert.alert('Error', 'Por favor, completa todos los campos correctamente y sube una foto');
      return;
    }
  
    const newService = {
      nombre,
      descripcion,
      precio,
      contacto,
      fotos: [foto],
      user_id: '', // El ID del usuario se asignará en el backend
      rating: 0 // Valor predeterminado del rating si no se proporciona
    };
  
    const result = await createService(newService);
  
    if (result) {
      Alert.alert('Éxito', 'Servicio creado exitosamente');
    } else {
      Alert.alert('Error', 'No se pudo crear el servicio');
    }
  };

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView style={{ marginHorizontal: 40, marginTop: 40 }}>
        <Layout style={{ paddingTop: 20 }}>
          <Text category="h1">Crear Servicios</Text>
          <Text category="p2">Ingrese los detalles del servicio</Text>
        </Layout>

        <Layout style={{ marginTop: 20 }}>
          <Input
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Descripción del servicio"
            value={descripcion}
            onChangeText={setDescripcion}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Precio"
            value={precio}
            onChangeText={setPrecio}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Contacto"
            value={contacto}
            onChangeText={setContacto}
            style={{ marginBottom: 10 }}
          />
          <Button onPress={handleSelectImage}>Subir Foto</Button>
          {foto && (
            <Image source={{ uri: foto }} style={{ width: 100, height: 100, marginTop: 10 }} />
          )}
        </Layout>

        <Layout style={{ height: 10 }} />

        <Layout>
          <Button onPress={handleCrearServicio}>Crear Servicio</Button>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
