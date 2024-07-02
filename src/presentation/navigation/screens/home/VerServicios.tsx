import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TextInput, Button, Modal, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useServiceStore } from '../../../store/auth/useServiceStore';
import { Picker } from '@react-native-picker/picker';
import { ServiceResponse } from '../../../../infrastucture/service.response';
import { usePostulacionStore } from '../../../store/usePostulacionStore';

export const VerServicios = () => {
  const { getall, getAvailableHours } = useServiceStore();
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
              <Button
                title="Reservar"
                onPress={() => handleReserve(item._id)}
              />
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterText: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    height: 50,
    flex: 1,
  },
  serviceItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDetails: {
    flex: 1,
    marginRight: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  servicePrice: {
    fontSize: 14,
    marginTop: 5,
  },
  serviceContact: {
    fontSize: 14,
    marginTop: 5,
  },
  serviceRating: {
    fontSize: 14,
    marginTop: 5,
  },
  noServices: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  availableHours: {
    width: '100%',
    marginTop: 20,
  },
  availableHour: {
    fontSize: 16,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedHour: {
    backgroundColor: '#e0e0e0',
  },
  commentInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 20,
    width: '100%',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
});
