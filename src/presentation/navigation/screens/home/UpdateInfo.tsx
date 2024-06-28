import React, { useEffect, useState } from 'react';
import { Layout, Text, Input, Button, Spinner } from '@ui-kitten/components';
import { Alert, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../StackNavigator';
import * as yup from 'yup';
import { patch } from '../../../../actions/update';
import { StorageAdapter } from '../../../../config/adapters/storage-adapter';

interface Props extends StackScreenProps<RootStackParams, 'UpdateInfo'> {}

export const UpdateInfo = ({ navigation, route }: Props) => {
  const { height } = useWindowDimensions();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await StorageAdapter.getItem("user_id");
        setUserId(id);
        console.log('ID de usuario:', id);
      } catch (error) {
        console.error('Error al obtener el user ID:', error);
      }
    };

    fetchUserId();
  }, []); 
  
  const onUpdate = async () => {
    if (!userId) {
      Alert.alert('Error', 'ID de usuario no proporcionado');
      return;
    }

    const schema = yup.object().shape({
      email: yup.string().email('Formato de correo electrónico inválido'),
    });

    try {
      await schema.validate({ email: form.email });
    } catch (error: any) {
      Alert.alert('Error', error.message);
      return;
    }

    if (form.username.length === 0 && form.email.length === 0 && form.name.length === 0) {
      Alert.alert('Error', 'Debe ingresar al menos un dato');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        ...(form.name && { name: form.name }),
        ...(form.username && { username: form.username }),
        ...(form.email && { email: form.email }),
      };
      if (!userId) {
        Alert.alert('Error', 'ID de usuario no proporcionado');
        return;
      }
      const response = await patch(userId, updateData);
      if (response) {
        Alert.alert('Éxito', 'Datos actualizados correctamente');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Hubo un problema al actualizar los datos');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al conectar con el servidor');
    }

    setLoading(false);
  };

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView style={{ marginHorizontal: 40 }}>
        <Layout style={{ paddingTop: height * 0.30 }}>
          <Text category="h1">Actualizar datos de cuenta</Text>
          <Text category="p2">Por favor, rellene los campos que desea actualizar</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={{ marginTop: 20 }}>
          <Input
            placeholder="Nombre"
            accessoryLeft={<MyIcon name="person-outline" />}
            value={form.name}
            onChangeText={(name) => setForm({ ...form, name })}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Username"
            accessoryLeft={<MyIcon name="person-add-outline" />}
            value={form.username}
            onChangeText={(username) => setForm({ ...form, username })}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(email) => setForm({ ...form, email })}
            accessoryLeft={<MyIcon name="email-outline" />}
            style={{ marginBottom: 10 }}
          />
        </Layout>

        {/* Space */}
        <Layout style={{ height: 10 }} />

        {/* Button */}
        <Layout>
          <Button
            accessoryRight={
              loading ? () => <Spinner size="small" status="control" /> : <MyIcon name="arrow-forward-outline" white />
            }
            onPress={onUpdate}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </Button>
        </Layout>

        {/* Información para crear cuenta */}
        <Layout style={{ height: 50 }} />

        <Layout
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Text>¿No desea hacer cambios?</Text>
          <Text status="primary" category="s1" onPress={() => navigation.goBack()}>
            {' '}
            volver{' '}
          </Text>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
