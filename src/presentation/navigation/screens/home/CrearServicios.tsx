import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Alert, ScrollView } from 'react-native';

export const CrearServicios = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [contacto, setContacto] = useState('');

  const handleCrearServicio = () => {
    if (nombre.length === 0 || descripcion.length === 0 || precio.length === 0 || contacto.length === 0) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }
    // Aquí puedes realizar la lógica para crear el servicio
    // Por ejemplo, puedes enviar una solicitud a tu API para crear el servicio
    // Luego puedes manejar el éxito o el error de acuerdo a tu lógica
    console.log('Crear servicio:', nombre, descripcion, precio, contacto);
  };

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView style={{ marginHorizontal: 40, marginTop: 40 }}>
        <Layout style={{ paddingTop: 20 }}>
          <Text category="h1">Crear Servicios</Text>
          <Text category="p2">Ingrese los detalles del servicio</Text>
        </Layout>

        {/* Inputs */}
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

        {/* Space */}
        <Layout style={{ height: 10 }} />

        {/* Button */}
        <Layout>
          <Button onPress={handleCrearServicio}>Crear Servicio</Button>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
