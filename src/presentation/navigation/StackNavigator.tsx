import { StackCardStyleInterpolator, createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from './screens/auth/LoginScreen';
import { LoadingScreen } from './screens/loading/LoadingScreen';
import { HomeScreen } from './screens/home/HomeScreen';
import { RegisterScreen } from './screens/auth/RegisterScreen';
import { ChangePassword } from './screens/auth/ChangePassword';
import { UpdateInfo } from './screens/home/UpdateInfo';
import {WeeklyResumeScreen} from './screens/reports/WeeklyResume';
import {SearchUserScreen} from './screens/admin/SearchUser'
import DashboardScreen from './screens/admin/Dashboard';
import { ChangeUserRoleScreen } from './screens/home/ChangeUserRoleScreen';
import { LocationScreen } from './screens/home/LocationScreen';

export type RootStackParams = {
  LoadingScreen: undefined;
  LoginScreen: { userId: string; password: string; email: string; name: string; username: string; rol1: string; access_token: string };
  RegisterScreen: undefined;
  HomeScreen: undefined;
  ChangePassword: undefined;
  UpdateInfo: { userId: string };
  WeeklyResumeScreen:undefined;
  SearchUserScreen:{ userId: string };
  DashboardScreen: undefined;
  ChangeUserRoleScreen: undefined;
  LocationScreen: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export const StackNavigator = () => (
  <Stack.Navigator
    initialRouteName="LoginScreen"
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: fadeAnimation,
    }}
  > 
    <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="UpdateInfo" component={UpdateInfo} />
    <Stack.Screen name="WeeklyResumeScreen" component={WeeklyResumeScreen} />
    <Stack.Screen name="SearchUserScreen" component={SearchUserScreen} />
    <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
    <Stack.Screen name="ChangeUserRoleScreen" component={ChangeUserRoleScreen} />
    <Stack.Screen name="LocationScreen" component={LocationScreen} />

  </Stack.Navigator>
);
