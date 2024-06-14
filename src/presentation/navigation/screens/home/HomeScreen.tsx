import React, { useEffect, useState } from 'react';
import { Button, Icon, Layout, Text ,TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { StorageAdapter } from '../../../../config/adapters/storage-adapter';
import { Alert } from 'react-native';

export const HomeScreen = ({ navigation }: Props) => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    navigation.navigate('LoginScreen');
  };

  const handleNavigate = (screenName: string) => {
    navigation.navigate(screenName); // Navegar a la vista indicada
  };
  const renderSettingsAction = () => (
    
    <TopNavigationAction icon={renderSettingsIcon} onPress={() => handleNavigate('UpdateInfo')} />
  );

  const renderSettingsIcon = (props: any) => (
    <Icon {...props} name='settings-outline' />
  );

  const [userRol, setRol] = useState<string | null>(null);
  useEffect(() => {
    const fetchRol = async () => {
      try {
        const rol = await StorageAdapter.getItem("rol1");
        setRol(rol);
        console.log('ROL de usuario:', rol);
      } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
      }
    };

    fetchRol();
  }, []); 
  const onUpdate = async () => {
    if (!userRol) {
      Alert.alert('Error', 'ROL de usuario no proporcionado');
      return;
    }
  };
  const isAdmin = userRol === 'admin';
  const isUser = userRol === 'user';
  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        alignment='center'
        title='Home'
        accessoryLeft={renderSettingsAction}
      />
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 30 }}>
        {(isAdmin || isUser) && (
          <Layout style={{ marginBottom: 30 }}>
            <Text category='h5'>Marcar entrada</Text>
            <Button onPress={() => navigation.navigate('CrearServicios')}>Marcar Entrada</Button>
          </Layout>
        )}

        {(isAdmin || isUser) && (
          <Layout style={{ marginBottom: 30 }}>
            <Text category='h5'>Marcar salida</Text>
            <Button onPress={() => handleNavigate('RegisterAttendanceScreen')}>marcar salida</Button>
          </Layout>
        )}

        {isAdmin && (
          <Layout style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 'auto', paddingVertical: 30 }}>
            <Button onPress={() => navigation.navigate('SomeAdminScreen1')}>Admin Button 1</Button>
            <Button onPress={() => navigation.navigate('SomeAdminScreen2')}>Admin Button 2</Button>
          </Layout>
        )}

        <Button
          style={{ marginTop: 'auto' }} // Colocar al final de la pantalla
          accessoryLeft={<Icon name='log-out-outline' />}
          onPress={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Layout>
    </Layout>
  );
};