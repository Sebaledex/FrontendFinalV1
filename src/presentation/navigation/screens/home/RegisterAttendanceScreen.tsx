import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useAuthStore } from '../../../store/auth/useAuthStore';
// Asegúrate de corregir la ruta

const RegisterAttendanceScreen = () => {
  const { user, createRegister } = useAuthStore();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  const handleCreateRegister = async () => {
    console.log(`Creating register with name ${name} in city ${city}`);
    const created = await createRegister(name, city);
    if (created) {
      console.log('Register created successfully');
      // Realizar cualquier acción adicional después de crear el registro
    } else {
      console.log('Failed to create register');
      // Manejar el error o mostrar un mensaje al usuario
    }
  };

  return (
    <View>
      <Text>Name:</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>City:</Text>
      <TextInput value={city} onChangeText={setCity} />
      <Button title="Create Register" onPress={handleCreateRegister} />
    </View>
  );
};

export default RegisterAttendanceScreen;
