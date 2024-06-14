import { StackCardStyleInterpolator, createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from './screens/auth/LoginScreen';
import { LoadingScreen } from './screens/loading/LoadingScreen';
import { HomeScreen } from './screens/home/HomeScreen';
import { RegisterScreen } from './screens/auth/RegisterScreen';
import { ServiceScreen } from './screens/service/ServiceScreen';
import { CrearServicios } from './screens/home/CrearServicios';
import { VerServicios } from './screens/home/VerServicios';
import { ChangePassword } from './screens/auth/ChangePassword';
import {UpdateInfo} from './screens/home/UpdateInfo';
import RegisterAttendanceScreen from './screens/home/RegisterAttendanceScreen';


export type RootStackParams = {
    LoadingScreen: undefined;
    LoginScreen: {userId: string, password: string, email: string, name: string, username: string, rol1: string, access_token: string};
    RegisterScreen: undefined;
    HomeScreen: undefined;
    CrearServicios: undefined;
    VerServicios: undefined;
    ChangePassword: undefined;
    ServiceScreen: {productId: string};
    UpdateInfo: { userId: string };
    RegisterAttendanceScreen: undefined;
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
        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="UpdateInfo"
          component={UpdateInfo}
/>
        <Stack.Screen name="ServiceScreen" component={ServiceScreen} />

        <Stack.Screen
          options={{cardStyleInterpolator: fadeAnimation}}
          name="RegisterAttendanceScreen"
          component={RegisterAttendanceScreen}
        />
      </Stack.Navigator>
    );
  };