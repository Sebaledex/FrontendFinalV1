import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useServiceStore } from '../../../store/useServiceStore';
import { ServiceResponse } from '../../../../infrastucture/service.response';
import { MessageResponse } from '../../../../infrastucture/message.response';

const AnswerMessages = () => {
  const { getByUser, seeMessage, answerMessage } = useServiceStore();
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getByUser();
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [getByUser]);

  const handleSeeMessages = async (serviceId: string) => {
    try {
      const messages = await seeMessage(serviceId);
      if (messages) {
        setMessages(messages);
        setSelectedServiceId(serviceId);
      } else {
        Alert.alert('Error', 'No se pudieron obtener los mensajes anteriores');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Ha ocurrido un error al obtener los mensajes anteriores');
    }
  };

  const handleRespondMessage = async () => {
    if (!selectedServiceId || !responseText) {
      Alert.alert('Error', 'Por favor, selecciona un servicio y proporciona una respuesta válida');
      return;
    }

    try {
      const success = await answerMessage(selectedServiceId, responseText);
      if (success) {
        console.log('Mensaje respondido exitosamente');
        const updatedMessages = await seeMessage(selectedServiceId);
        if (updatedMessages) {
          setMessages(updatedMessages);
        }
        setResponseText('');
      } else {
        console.error('Error al responder mensaje');
      }
    } catch (error) {
      console.error('Error responding message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios Ofrecidos</Text>
      {services.length > 0 ? (
        <FlatList
          data={services}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>{item.nombre}</Text>
              <Text style={styles.serviceDescription}>{item.descripcion}</Text>
              <Text style={styles.servicePrice}>{`Precio: ${item.precio}`}</Text>
              <TouchableOpacity onPress={() => handleSeeMessages(item._id)}>
                <Text style={styles.messageButton}>Responder Preguntas</Text>
              </TouchableOpacity>
              {selectedServiceId === item._id && (
                <View style={styles.responseContainer}>
                  {messages.map((msg, index) => (
                    <View key={index} style={styles.messageItem}>
                      <Text style={styles.messageUser}>{msg.mensajeU}</Text>
                      <Text style={styles.messageResponse}>{msg.respuesta || ''}</Text>
                    </View>
                  ))}
                  <TextInput
                    placeholder="Escribe tu respuesta"
                    value={responseText}
                    onChangeText={setResponseText}
                    style={styles.responseTextInput}
                    multiline
                  />
                  <Button title="Responder" onPress={handleRespondMessage} />
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noServices}>No hay servicios disponibles para mostrar</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 14,
    marginBottom: 5,
  },
  messageButton: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  responseContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  messageItem: {
    marginBottom: 10,
  },
  messageUser: {
    fontWeight: 'bold',
  },
  messageResponse: {
    marginBottom: 5,
  },
  responseTextInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  noServices: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default AnswerMessages;
