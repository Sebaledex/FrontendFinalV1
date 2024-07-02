import React from 'react';
import { View, Text } from 'react-native';

const EditarFormularioServicioScreen = ({ route }: { route: any }) => {
  const { serviceId } = route.params;

  return (
    <View>
      <Text>Editing service with ID: {serviceId}</Text>
      {/* Aquí colocarías tu formulario de edición */}
    </View>
  );
};

export default EditarFormularioServicioScreen;