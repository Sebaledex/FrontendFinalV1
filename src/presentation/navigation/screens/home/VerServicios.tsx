import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TextInput, Button, Modal, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { ServiceResponse } from '../../../../infrastucture/service.response';
import { usePostulacionStore } from '../../../store/usePostulacionStore';
import { useServiceStore } from '../../../store/useServiceStore';
import { CommentResponse } from '../../../../infrastucture/comment.response'; // Asegúrate de importar la interfaz CommentResponse

export const VerServicios = () => {
  const { getall, getAvailableHours, getReviews } = useServiceStore();
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceResponse[]>([]);
  const [filter, setFilter] = useState<string>('none');
  const [order, setOrder] = useState<string>('asc');
  const [searchText, setSearchText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [comment, setComment] = useState<string>(''); 
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentResponse[]>([]); // Estado para almacenar comentarios
  const { create } = usePostulacionStore();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getall();
        setServices(data || []);
        setFilteredServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [getall]);

  useEffect(() => {
    applyFilter();
  }, [filter, order, searchText, services]);

  const applyFilter = () => {
    let filtered = [...services];

    if (searchText) {
      filtered = filtered.filter(service => service.descripcion.toLowerCase().includes(searchText.toLowerCase()));
    }

    switch (filter) {
      case 'price':
        filtered.sort((a, b) => order === 'asc' ? parseFloat(a.precio) - parseFloat(b.precio) : parseFloat(b.precio) - parseFloat(a.precio));
        break;
      case 'rating':
        filtered.sort((a, b) => order === 'asc' ? a.rating - b.rating : b.rating - a.rating);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => order === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre));
        break;
      default:
        break;
    }

    setFilteredServices(filtered);
  };

  const handleReserve = async (serviceId: string) => {
    setSelectedService(serviceId);
    setAvailableHours([]); 
    setSelectedHour(null); 
    setComment(''); 
    setModalVisible(true);
  };

  const handleDateChange = async (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date && selectedService) {
      setSelectedDate(date);
      const hours = await getAvailableHours(selectedService, date);
      setAvailableHours(hours);
    }
    setShowDatePicker(false);
  };

  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour);
  };

  const handleConfirmReservation = async () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Por favor seleccione una fecha para continuar.');
      return;
    }
    if (!selectedHour) {
      Alert.alert('Error', 'Por favor seleccione un horario para continuar.');
      return;
    }
    if (!comment) {
      Alert.alert('Error', 'Por favor agregue un comentario para continuar.');
      return;
    }
    if (selectedService) {
      console.log(`Reservar servicio ${selectedService} el ${selectedDate} a las ${selectedHour} con comentario: ${comment}`);
      const success = await create(selectedService, selectedDate, selectedHour, comment);
      if (success) {
        Alert.alert('Éxito', 'Reserva realizada con éxito');
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Error al realizar la reserva');
      }
    }
  };

  // Función para cargar comentarios
  const loadComments = async (serviceId: string) => {
    try {
      const reviews = await getReviews(serviceId); // Asumiendo que getReviews devuelve los comentarios para un servicio
      setComments(reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ver Servicios</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por descripción"
        value={searchText}
        onChangeText={setSearchText}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.filterText}>Filtro</Text>
        <Picker
          selectedValue={filter}
          style={styles.picker}
          onValueChange={(itemValue: React.SetStateAction<string>) => setFilter(itemValue)}
        >
          <Picker.Item label="Sin filtro" value="none" />
          <Picker.Item label="Precio" value="price" />
          <Picker.Item label="Rating" value="rating" />
          <Picker.Item label="Alfabéticamente" value="alphabetical" />
        </Picker>
        <Picker
          selectedValue={order}
          style={styles.picker}
          onValueChange={(itemValue: React.SetStateAction<string>) => setOrder(itemValue)}
        >
          <Picker.Item label="Ascendente" value="asc" />
          <Picker.Item label="Descendente" value="desc" />
        </Picker>
      </View>
      {filteredServices.length > 0 ? (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.serviceItem}>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>Servicio: {item.nombre}</Text>
                <Text style={styles.serviceDescription}>Descripción: {item.descripcion}</Text>
                <Text style={styles.servicePrice}>Precio: {item.precio}</Text>
                <Text style={styles.serviceContact}>Contacto: {item.contacto}</Text>
                <Text style={styles.serviceRating}>Rating: {item.rating}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.reserveButton]}
                  onPress={() => handleReserve(item._id)}
                >
                  <Text style={styles.buttonText}>Reservar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.commentsButton]}
                  onPress={() => loadComments(item._id)}
                >
                  <Text style={styles.buttonText}>Comentarios</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noServices}>No hay servicios disponibles</Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccione una fecha</Text>
            <Button title="Seleccionar fecha" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            {availableHours.length > 0 && (
              <View style={styles.availableHours}>
                <Text style={styles.modalTitle}>Horarios disponibles:</Text>
                {availableHours.map(hour => (
                  <TouchableOpacity
                    key={hour}
                    style={[styles.availableHour, selectedHour === hour && styles.selectedHour]}
                    onPress={() => handleHourSelect(hour)}
                  >
                    <Text>{hour}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {selectedHour && (
              <>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Agregar un mensaje (máx 150 caracteres)"
                  value={comment}
                  onChangeText={setComment}
                  maxLength={150}
                />
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmReservation}
                >
                  <Text style={styles.confirmButtonText}>Tomar</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Mostrar comentarios */}
      {comments.length > 0 && (
        <Modal
          visible={comments.length > 0}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Comentarios</Text>
              <FlatList
                data={comments}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.commentItem}>
                    <Text style={styles.commentText}>{item.comentario}</Text>
                    <Text style={styles.commentRating}>Rating: {item.rating}</Text>
                  </View>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setComments([])}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterText: {
    fontSize: 16,
  },
  picker: {
    width: '45%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  serviceItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  serviceDetails: {
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
  },
  servicePrice: {
    fontSize: 14,
  },
  serviceContact: {
    fontSize: 14,
  },
  serviceRating: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  reserveButton: {
    backgroundColor: '#2196F3', // Color azul para el botón "Reservar"
  },
  commentsButton: {
    backgroundColor: '#2196F3', // Color azul para el botón "Comentarios"
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff', // Color blanco para el texto de los botones
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  availableHours: {
    marginTop: 10,
  },
  availableHour: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedHour: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  commentItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  commentDate: {
    fontSize: 12,
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 5,
  },
  commentRating: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  noServices: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});
