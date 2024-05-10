import React from 'react';
import { Text, View } from 'react-native';

export const VerServicios = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Ver Servicios</Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>Aquí se mostrarán los servicios</Text>
    </View>
  );
};
