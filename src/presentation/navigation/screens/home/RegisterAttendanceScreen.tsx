import React, { useState } from 'react';
import { Alert, useWindowDimensions, View } from 'react-native';
import { Layout, Text, Input, Button } from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../../components/ui/MyIcon';
import { useAuthStore } from '../../../store/auth/useAuthStore';

export const RegistrarAsistenciaScreen = () => {
  const { user, createRegister } = useAuthStore();
  const [form, setForm] = useState({ direccion: '', ciudad: '' });
  const { height } = useWindowDimensions();

  const handleCreateRegister = async () => {
    if (form.direccion.length === 0 || form.ciudad.length === 0) {
      Alert.alert('Error', 'Nombre y ciudad no pueden estar vacíos');
      return;
    }

    const created = await createRegister(form.direccion, form.ciudad);
    if (created) {
      Alert.alert('Éxito', 'Registro creado exitosamente');
    } else {
      Alert.alert('Error', 'Error al crear el registro');
    }
  };

  return (
    <Layout style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 20 }}>
        <Layout style={{ paddingTop: height * 0.25, alignItems: 'center' }}>
          <View style={{ width: 64, height: 64, marginBottom: 10 }}>
            <MyIcon name="calendar-outline" />
          </View>
          <Text category="h1">Asistencia</Text>
          <Text category="s1">Llena tus datos para marcar asistencia</Text>
        </Layout>

        <Layout style={{ marginTop: 20 }}>
          <Input
            placeholder="Dirección"
            value={form.direccion}
            onChangeText={(direccion) => setForm({ ...form, direccion })}
            accessoryLeft={<MyIcon name="home-outline" />}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Ciudad"
            value={form.ciudad}
            onChangeText={(ciudad) => setForm({ ...form, ciudad })}
            accessoryLeft={<MyIcon name="map-outline" />}
            style={{ marginBottom: 10 }}
          />
        </Layout>

        <Button
          style={{ marginTop: 20 }}
          accessoryRight={<MyIcon name="checkmark-circle-2-outline" />}
          onPress={handleCreateRegister}
        >
          Marcar Asistencia
        </Button>

      </ScrollView>
    </Layout>
  );
};

export default RegistrarAsistenciaScreen;
