import React from 'react';
import { StackCardStyleInterpolator, createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from './screens/auth/LoginScreen';
import { LoadingScreen } from './screens/loading/LoadingScreen';
import { HomeScreen } from './screens/home/HomeScreen';
import { RegisterScreen } from './screens/auth/RegisterScreen';
import { ServiceScreen } from './screens/service/ServiceScreen';
import { CrearServicios } from './screens/home/CrearServicios';
import { VerServicios } from './screens/home/VerServicios';
import { ChangePassword } from './screens/auth/ChangePassword';
import { Reportes } from './screens/home/Reportes';
import GPSView from './screens/home/GPSView';
import { EditarServicio } from './screens/home/EditarServicio';
import { ListarServicios } from './screens/home/ListarServicios';


export type RootStackParams = {
    LoadingScreen: undefined;
    LoginScreen: undefined;
    RegisterScreen: undefined;
    HomeScreen: undefined;
    CrearServicios: undefined;
    VerServicios: undefined;
    ChangePassword: undefined;
    ServiceScreen: {productId: string};
    Reportes: undefined;
    GPSView: undefined;
    EditarServicio: undefined;
    ListarServicios: undefined;
  };


  const Stack = createStackNavigator<RootStackParams>();

  const fadeAnimation: StackCardStyleInterpolator = ({current}) => {
    return {
      cardStyle: {
        opacity: current.progress,
      },
    };
  };
  
  export const StackNavigator = () => {
    return (
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
          // cardStyleInterpolator: fadeAnimation,
        }}>
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="LoadingScreen"
          component={LoadingScreen}
        />
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="RegisterScreen"
          component={RegisterScreen}
        />
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="HomeScreen"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="CrearServicios"
          component={CrearServicios}
        />
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="VerServicios"
          component={VerServicios}
        />
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="ChangePassword"
          component={ChangePassword}
        />
        <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="Reportes"
          component={Reportes}
        />
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="GPSView"
          component={GPSView}
        />
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="EditarServicio"
          component={EditarServicio}
        />
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="ListarServicios"
          component={ListarServicios}
        />
      </Stack.Navigator>
    );
  };