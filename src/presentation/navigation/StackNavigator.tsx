import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from './screens/auth/LoginScreen';
import { LoadingScreen } from './screens/loading/LoadingScreen';
import { HomeScreen } from './screens/home/HomeScreen';
import { RegisterScreen } from './screens/auth/RegisterScreen';
import { ServiceScreen } from './screens/service/ServiceScreen';
import { CrearServicios } from './screens/home/CrearServicios';
import { VerServicios } from './screens/home/VerServicios';
import { ChangePassword } from './screens/auth/ChangePassword';
import { ListarServicios } from './screens/home/ListarServicios';
import { EditarServicio } from './screens/home/EditarServicio';
import EditarFormularioServicioScreen from './screens/home/EditarFormularioServicioScreen';
import { GPSView } from './screens/home/GPSView';


export type RootStackParams = {
  LoadingScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  HomeScreen: undefined;
  CrearServicios: undefined;
  VerServicios: undefined;
  ChangePassword: undefined;
  ServiceScreen: { productId: string };
  ListarServicios: undefined;
  EditarServicio: undefined;
  EditarFormularioServicio: { serviceId: string };
  GPSView: undefined;

};

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
        // cardStyleInterpolator: fadeAnimation,
      }}
    >
      <Stack.Screen
        name="LoadingScreen"
        component={LoadingScreen}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
      <Stack.Screen
        name="CrearServicios"
        component={CrearServicios}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
      <Stack.Screen
        name="VerServicios"
        component={VerServicios}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
      <Stack.Screen
        name="ListarServicios"
        component={ListarServicios}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
      <Stack.Screen
        name="EditarServicio"
        component={EditarServicio}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
      <Stack.Screen
        name="ServiceScreen"
        component={ServiceScreen}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
      <Stack.Screen
        name="EditarFormularioServicio"
        component={EditarFormularioServicioScreen}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
      <Stack.Screen
        name="GPSView"
        component={GPSView}
        options={{ cardStyleInterpolator: fadeAnimation }}
      />
    </Stack.Navigator>
  );
};

const fadeAnimation = ({ current }: { current: any }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});
