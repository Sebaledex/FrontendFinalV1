import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Button, TextInput, Alert, TouchableOpacity, Modal } from 'react-native';
import { usePostulacionStore } from '../../../store/usePostulacionStore';
import { useServiceStore } from '../../../store/useServiceStore';
import { PostulacionResponse } from '../../../../infrastucture/postulacion.response';

export const PastService = () => {
  const { getbyuser } = usePostulacionStore();
  const { getbyServiceId, doReview } = useServiceStore();
  const [postulaciones, setPostulaciones] = useState<PostulacionResponse[]>([]);
  const [serviceNames, setServiceNames] = useState<{ [key: string]: string }>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0); // Estado para el rating
  const [comentario, setComentario] = useState<string>(''); // Estado para el comentario

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const data = await getbyuser();
        if (data) {
          const filteredData = data.filter(postulacion => {
            const postulacionDateTime = new Date(postulacion.fechaSolicitada);
            postulacionDateTime.setHours(parseInt(postulacion.horarioSolicitado.split(':')[0]));
            postulacionDateTime.setMinutes(parseInt(postulacion.horarioSolicitado.split(':')[1]));
            return postulacionDateTime < new Date();
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

  const handleReserve = (serviceId: string) => {
    setSelectedService(serviceId);
    setModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const submitReview = async () => {
    if (!selectedService || rating < 0 || rating > 5 || comentario.trim() === '') {
      Alert.alert('Error', 'Por favor, ingresa una calificación válida (0-5) y un comentario.');
      return;
    }

    const success = await doReview(selectedService, rating, comentario);
    if (success) {
      setModalVisible(false);
      setRating(0); // Reiniciar rating después de enviar la reseña
      setComentario(''); // Reiniciar comentario después de enviar la reseña
      Alert.alert('Éxito', 'Reseña enviada con éxito');
    } else {
      Alert.alert('Error', 'Ha ocurrido un error al enviar la reseña');
    }
  };

  const handleRatingChange = (text: string) => {
    let value = parseInt(text);
    if (isNaN(value)) {
      value = 0;
    }
    setRating(Math.max(0, Math.min(5, value)));
  };

  const renderCommentModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Deja tu calificación</Text>
          <TextInput
            style={styles.input}
            placeholder="Rating (0-5)"
            keyboardType="numeric"
            value={rating.toString()}
            onChangeText={handleRatingChange}
          />
          <TextInput
            style={[styles.input, styles.commentInput]}
            placeholder="Comentario"
            multiline
            value={comentario}
            onChangeText={(text) => setComentario(text)}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={submitReview}
            >
              <Text style={styles.buttonText}>Enviar Reseña</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ver Servicios Pasados</Text>
      {postulaciones.length > 0 ? (
        <FlatList
          data={postulaciones}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.postulacionItem}>
              <View style={styles.postulacionDetails}>
                <Text style={styles.postulacionName}>Tu servicio: {serviceNames[item.servicioId] || 'Cargando...'}</Text>
                <Text style={styles.postulacionMessage}>Llegó a las: {item.horarioSolicitado}</Text>
                <Text style={styles.postulacionMessage}>Del día: {formatDate(item.fechaSolicitada)}</Text>
              </View>
              <Button
                title="Calificar"
                onPress={() => handleReserve(item.servicioId)}
              />
            </View>
          )}
        />
      ) : (
        <Text style={styles.noPostulaciones}>No hay servicios pasados disponibles</Text>
      )}

      {modalVisible && renderCommentModal()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postulacionDetails: {
    flex: 1,
    marginRight: 10,
  },
  postulacionName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postulacionMessage: {
    fontSize: 14,
    marginTop: 5,
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  commentInput: {
    height: 100, // Ajustar altura del campo de comentario
    textAlignVertical: 'top', // Alinear texto al principio del campo
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%', // Ajustar ancho de los botones
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
});
