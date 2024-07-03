import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { usePostulacionStore } from '../../../store/usePostulacionStore';
import { useServiceStore } from '../../../store/useServiceStore';
import { PostulacionResponse } from '../../../../infrastucture/postulacion.response';

export const NextService = () => {
  const { getbyuser } = usePostulacionStore();
  const { getbyServiceId, sendMessage, seeMessage } = useServiceStore();
  const [postulaciones, setPostulaciones] = useState<PostulacionResponse[]>([]);
  const [serviceNames, setServiceNames] = useState<{ [key: string]: string }>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messagesToShow, setMessagesToShow] = useState<string[]>([]);
  const [isViewingMessages, setIsViewingMessages] = useState<boolean>(false);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const data = await getbyuser();
        if (data) {
          const filteredData = data.filter(postulacion => {
            const postulacionDateTime = new Date(postulacion.fechaSolicitada);
            return postulacionDateTime > new Date();
          });

          setPostulaciones(filteredData);
          const serviceIds = filteredData.map(postulacion => postulacion.servicioId);
          await fetchServiceNames(serviceIds);
        } else {
          setPostulaciones([]);
        }
      } catch (error) {
        console.error('Error fetching postulaciones:', error);
      }
    };

    const fetchServiceNames = async (serviceIds: string[]) => {
      const names: { [key: string]: string } = {};
      for (const id of serviceIds) {
        const service = await getbyServiceId(id);
        if (service) {
          names[id] = service.nombre;
        }
      }
      setServiceNames(names);
    };

    fetchPostulaciones();
  }, [getbyuser, getbyServiceId]);

  const handleMessage = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsViewingMessages(false);
    setModalVisible(true);
  };

  const handleSeeMessages = async (serviceId: string) => {
    try {
      const messages = await seeMessage(serviceId);
      console.log('messages:', messages);
      if (messages) {
        const formattedMessages = messages.map(msg => {
          if (msg.respuesta) {
            return `${msg.mensajeU}\nRespuesta: ${msg.respuesta}`;
          } else {
            return `${msg.mensajeU}\n`;
          }
        });
        setMessagesToShow(formattedMessages);
        setSelectedService(serviceId);
        setIsViewingMessages(true);
        setModalVisible(true);
      } else {
        Alert.alert('Error', 'No se pudieron obtener los mensajes anteriores');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Ha ocurrido un error al obtener los mensajes anteriores');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSendMessage = async () => {
    if (!selectedService || !message.trim()) {
      Alert.alert('Error', 'Por favor, ingresa un mensaje válido.');
      return;
    }

    try {
      const success = await sendMessage(selectedService, message);
      if (success) {
        setModalVisible(false);
        setMessage('');
        Alert.alert('Éxito', 'Mensaje enviado con éxito');
      } else {
        Alert.alert('Error', 'No se pudo enviar el mensaje');
      }
    } catch (error) {
      console.error('Error sending message:', error); // Loguea el error para depuración
      Alert.alert('Error', 'Ha ocurrido un error al enviar el mensaje');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ver Reservas</Text>
      {postulaciones.length > 0 ? (
        <FlatList
          data={postulaciones}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.postulacionItem}>
              <Text style={styles.postulacionName}>Tu servicio: {serviceNames[item.servicioId] || 'Cargando...'}</Text>
              <Text style={styles.postulacionMessage}>Llegará a las: {item.horarioSolicitado}</Text>
              <Text style={styles.postulacionMessage}>Del día: {formatDate(item.fechaSolicitada)}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.sendMessageButton]}
                  onPress={() => handleMessage(item.servicioId)}
                >
                  <Text style={styles.buttonText}>Enviar mensaje</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.seeMessagesButton]}
                  onPress={() => handleSeeMessages(item.servicioId)}
                >
                  <Text style={styles.buttonText}>Ver mensajes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noPostulaciones}>No hay reservas disponibles</Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isViewingMessages ? (
              <>
                <Text style={styles.modalTitle}>Mensajes</Text>
                <FlatList
                  data={messagesToShow}
                  renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                      <Text style={styles.messageText}>{item}</Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Enviar Mensaje al Dueño</Text>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Escribe tu mensaje aquí..."
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.sendMessageButton]}
                    onPress={handleSendMessage}
                  >
                    <Text style={styles.buttonText}>Enviar Mensaje</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    textAlign: 'center',
    marginBottom: 20,
  },
  postulacionItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
  },
  postulacionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postulacionMessage: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  sendMessageButton: {
    backgroundColor: '#2196F3',
  },
  seeMessagesButton: {
    backgroundColor: '#2196F3', // Mismo color para ambos botones
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  noPostulaciones: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    minHeight: 100,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageText: {
    fontSize: 14,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#f44336', // Color de botón cancelar
  },
});

export default NextService;
