import React, { useState, useEffect } from "react";
import { Layout, Text, Input, Button, Spinner } from "@ui-kitten/components";
import { Alert, ScrollView, useWindowDimensions } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { MyIcon } from "../../../components/ui/MyIcon";
import { RootStackParams } from "../../StackNavigator";
import { useAuthStore } from "../../../store/auth/useAuthStore";

interface Props extends StackScreenProps<RootStackParams, "LoginScreen"> {}

export const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [otherButtonsEnabled, setOtherButtonsEnabled] = useState<boolean>(true); // Estado para habilitar/deshabilitar otros botones

  const { height } = useWindowDimensions();

  // Agregar useEffect para limpiar los campos del formulario cuando la pantalla gana foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setForm({ username: '', password: '' });
    });

    return unsubscribe;
  }, [navigation]);

  const onLogin = async () => {
    try {
      setLoading(true);
      setOtherButtonsEnabled(false); // Deshabilitar los otros botones al iniciar sesión
      if (form.username.length === 0 || form.password.length === 0) {
        Alert.alert("Error", "Ingrese información");
        setLoading(false); // Asegurarse de detener la carga y habilitar los botones
        setOtherButtonsEnabled(true);
        return;
      }

      const wasSuccessful = await login(form.username, form.password);
      if (wasSuccessful) {
        navigation.navigate("HomeScreen");
        return;
      }
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ha ocurrido un error al iniciar sesión");
    } finally {
      setLoading(false);
      setOtherButtonsEnabled(true); // Habilitar los otros botones al finalizar la operación de inicio de sesión
    }
  };

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView style={{ marginHorizontal: 40 }}>
        <Layout style={{ paddingTop: height * 0.35 }}>
          <Text category="h1">Ingresar</Text>
          <Text category="p2">Por favor, ingrese para continuar</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={{ marginTop: 20 }}>
          <Input
            placeholder="Usuario"
            autoCapitalize="none"
            value={form.username}
            onChangeText={(username) => setForm({ ...form, username })}
            accessoryLeft={<MyIcon name="person-add-outline" />}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Contraseña"
            autoCapitalize="none"
            value={form.password}
            onChangeText={(password) => setForm({ ...form, password })}
            secureTextEntry
            accessoryLeft={<MyIcon name="lock-outline" />}
            style={{ marginBottom: 10 }}
          />
        </Layout>

        {/* Space */}
        <Layout style={{ height: 10 }} />

        {/* Button */}
        <Layout>
          <Button
            accessoryRight={
              loading ? () => <Spinner size="small" status="control" /> : <MyIcon name="arrow-forward-outline" white />
            }
            onPress={onLogin}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Ingresar"}
          </Button>
        </Layout>

        {/* Información para crear cuenta */}
        <Layout style={{ height: 50 }} />

        <Layout
          style={{
            alignItems: "flex-end",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text>¿No tienes cuenta?</Text>
          <Text
            status="primary"
            category="s1"
            onPress={() => otherButtonsEnabled && navigation.navigate("RegisterScreen")} // Agregar lógica de habilitación/deshabilitación
          >
            {" "}
            crea una{" "}
          </Text>
        </Layout>

        {/* Información para cambiar contraseña */}
        <Layout style={{ height: 50 }} />
        <Layout
          style={{
            alignItems: "flex-end",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text>¿Olvidaste tu contraseña?</Text>
          <Text
            status="primary"
            category="s1"
            onPress={() => otherButtonsEnabled && navigation.navigate("ChangePassword")} // Agregar lógica de habilitación/deshabilitación
          >
            {" "}
            Cambiar contraseña{" "}
          </Text>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
