import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Alert, ScrollView } from 'react-native';
import { useServiceStore } from '../../../store/auth/useServiceStore';


export const CrearServicios = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [contacto, setContacto] = useState('');
  const { createService } = useServiceStore();

  const handleCrearServicio = async () => {
    if (nombre.length === 0 || descripcion.length === 0 || precio.length === 0 || contacto.length === 0) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const newService = {
      nombre,
      descripcion,
      precio,
      contacto,
      user_id: '', // El ID del usuario se asignará en el backend
      rating: 0 // Default rating to 0 if not provided
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
        </Layout>

        <Layout style={{ height: 10 }} />

        <Layout>
          <Button onPress={handleCrearServicio}>Crear Servicio</Button>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
