import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { Alert, useWindowDimensions } from "react-native";
import { ScrollView, State } from "react-native-gesture-handler";
import { MyIcon } from "../../../components/ui/MyIcon";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams, StackNavigator } from "../../StackNavigator";
import { API_URL } from "@env";
import { useState } from "react";
import { useAuthStore } from "../../../store/auth/useAuthStore";
import parseErrorStack from "react-native/Libraries/Core/Devtools/parseErrorStack";
import { HomeScreen } from "../home/HomeScreen";



interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> {}



export const LoginScreen = ({ navigation }:Props) => {

    const { login } = useAuthStore();
    const [form, setForm] = useState({
        username: '',
        password: '',
      });

    const {height} = useWindowDimensions();

    const onLogin = async() => {
        //console.log(form.password)
        if ( form.username.length === 0 || form.password.length === 0 ) {
            console.log("No tiene letras 0")
          return;
        }
        const wasSuccessful = await login(form.username, form.password);
    
        if ( wasSuccessful ) 
            navigation.navigate('HomeScreen');
        return;
        
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
    
      }

    //console.log({ apiurl: API_URL, stage: State})


    return (
        <Layout style={{ flex:1 }}>
            <ScrollView style={{ marginHorizontal: 40 }}>

                <Layout style={{paddingTop: height * 0.35}}>
                    <Text category="h1">Ingresar</Text>
                    <Text category="p2">Por favor, ingrese para continuar</Text>
                </Layout> 

                {/* Inputs */}
                <Layout style={{marginTop: 20}}>
                    <Input
                        placeholder="Usuario"
                        autoCapitalize="none"
                        value={form.username}
                        onChangeText={ (username) => setForm({ ...form, username })}
                        accessoryLeft={ <MyIcon name="person-add-outline" />}
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
                    accessoryRight={ <MyIcon name="arrow-forward-outline" white /> }
                    onPress={onLogin}>Ingresar
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
                    <Text>¿No tienes cuenta?</Text>
                    <Text 
                        status="primary" 
                        category="s1"
                        onPress={() => navigation.navigate('RegisterScreen')}
                    >
                    {' '}
                    crea una{' '}
                    </Text>
                    
                </Layout>
                {/* Información para cambiar contraseña */}
                <Layout style={{height: 50}} />

                <Layout
                    style={{
                    alignItems: 'flex-end',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <Text>¿Olvidaste tu contraseña?</Text>
                    <Text 
                        status="primary" 
                        category="s1"
                        onPress={() => navigation.navigate('ChangePassword')}
                    >
                    {' '}
                    Cambiar contraseña{' '}
                    </Text>
                    
                </Layout>


            </ScrollView>
        </Layout>







    )
}