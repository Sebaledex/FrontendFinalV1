import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Alert, ScrollView } from 'react-native';
import { MyIcon } from '../../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../StackNavigator';
import { useAuthStore } from '../../../store/auth/useAuthStore';

interface Props extends StackScreenProps<RootStackParams, 'ChangePassword'> {}

export const ChangePassword = ({ navigation }: Props) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { /* Aquí coloca cualquier función necesaria de tu store de autenticación */ } = useAuthStore();

  const handleChangePassword = () => {
    if (currentPassword.length === 0 || newPassword.length === 0 || confirmPassword.length === 0) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }
    // Aquí puedes realizar la lógica para cambiar la contraseña
    // Por ejemplo, puedes llamar a una función de tu store de autenticación para cambiar la contraseña
    // o enviar una solicitud a tu API para cambiar la contraseña
    // Luego puedes manejar el éxito o el error de acuerdo a tu lógica
    console.log('Cambiar contraseña:', currentPassword, newPassword);
  };

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView style={{ marginHorizontal: 40, marginTop: 40 }}>
        <Layout style={{ paddingTop: 20 }}>
          <Text category="h1">Cambiar Contraseña</Text>
          <Text category="p2">Ingrese la contraseña actual y la nueva contraseña</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={{ marginTop: 20 }}>
          <Input
            placeholder="Contraseña actual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            accessoryLeft={<MyIcon name="lock-outline" />}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            accessoryLeft={<MyIcon name="lock-outline" />}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            accessoryLeft={<MyIcon name="lock-outline" />}
            style={{ marginBottom: 10 }}
          />
        </Layout>

        {/* Space */}
        <Layout style={{ height: 10 }} />

        {/* Button */}
        <Layout>
          <Button onPress={handleChangePassword}>Cambiar Contraseña</Button>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
