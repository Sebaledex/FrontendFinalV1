import {Button, Input, Layout, Text, Spinner} from '@ui-kitten/components';
import {Alert, useWindowDimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { MyIcon } from '../../../components/ui/MyIcon';
import { RootStackParams } from '../../StackNavigator';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { useState } from 'react';
import * as yup from 'yup';


interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> {}

export const RegisterScreen = ({ navigation }:Props) => {
  const { login } = useAuthStore();
  const { signup } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const {height} = useWindowDimensions();
  const [form, setForm] = useState({
      name: '',
      username: '',
      email: '',
      password: '',
    });
    
    const emailSchema = yup.string().email();

    const validateEmail = async (email: string) => {
      try {
        await emailSchema.validate(email);
        return true;
      } catch (error) {
        return false;
      }
    };

  const onSignup = async() => {
    if ( form.username.length === 0 || 
      form.password.length === 0 || 
      form.email.length === 0 || 
      form.name.length === 0 ) {
      Alert.alert("Error", "Ingrese información");
        return;
      }
    if (!(await validateEmail(form.email))) {
        Alert.alert('Error', 'Ingrese un correo electrónico válido');
        return;
      }
    setLoading(true); 
    const wasSuccessful = await signup(form.name, form.username, form.email, form.password);
    if ( wasSuccessful ) {
      const wasSuccessful2 = await login(form.username, form.password);
      if (wasSuccessful2) {
        navigation.navigate("HomeScreen");
        return;
      }
      setLoading(false);
      return;
    }
    setLoading(false);
    Alert.alert('Error', 'Usuario o email ya se encuentran registrados');

  }
  return (
    <Layout style={{flex: 1}}>
      <ScrollView style={{marginHorizontal: 40}}>
        <Layout style={{paddingTop: height * 0.30}}>
          <Text category="h1">Crear cuenta</Text>
          <Text category="p2">Por favor, crea una cuenta para continuar</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={{marginTop: 20}}>
          <Input
            placeholder="Nombre"
            accessoryLeft={ <MyIcon name="person-outline" />}
            value={form.name}
            onChangeText={ (name) => setForm({ ...form, name })}
            style={{marginBottom: 10}}
          />
          <Input
            placeholder="Username"
            accessoryLeft={ <MyIcon name="person-add-outline" />}
            value={form.username}
            onChangeText={ (username) => setForm({ ...form, username })}
            style={{marginBottom: 10}}
          />
          <Input
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={ (email) => setForm({ ...form, email })}            
            accessoryLeft={ <MyIcon name="email-outline" />}
            style={{marginBottom: 10}}
          />
          <Input
            placeholder="Contraseña"
            autoCapitalize="none"
            value={form.password}
            onChangeText={ (password) => setForm({ ...form, password })}               
            secureTextEntry
            accessoryLeft={ <MyIcon name="lock-outline" />}
            style={{marginBottom: 10}}
          />
        </Layout>

        {/* Space */}
        <Layout style={{height: 10}} />

        {/* Button */}
        <Layout>
          <Button
            accessoryRight={
              loading ? () => <Spinner size="small" status="control" /> : <MyIcon name="arrow-forward-outline" white />
            }
            onPress={onSignup}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Registrar"}
          </Button>
        </Layout>

        {/* Información para crear cuenta */}
        <Layout style={{height: 50}} />

        <Layout
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text>¿Ya tienes cuenta?</Text>
          <Text 
            status="primary" 
            category="s1"
            onPress={() => navigation.goBack()}
          >
            {' '}
            ingresar{' '}
          </Text>
        </Layout>
      </ScrollView>
    </Layout>
  );
};