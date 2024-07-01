import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TextInput } from 'react-native';
import { ServiceResponse } from '../../../../infrastucture/service.response';
import { useServiceStore } from '../../../store/auth/useServiceStore';
import { Picker } from '@react-native-picker/picker';

export const VerServicios = () => {
  const { getall } = useServiceStore();
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceResponse[]>([]);
  const [filter, setFilter] = useState<string>('none');
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getall();
        setServices(data||[]);
        setFilteredServices(data||[]);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [getall]);

  useEffect(() => {
    applyFilter();
  }, [filter, searchText, services]);

  const applyFilter = () => {
    let filtered = [...services];
    
    if (searchText) {
      filtered = filtered.filter(service => service.descripcion.toLowerCase().includes(searchText.toLowerCase()));
    }

    switch (filter) {
      case 'price':
        filtered.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default:
        break;
    }

    setFilteredServices(filtered);
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
      {filteredServices.length > 0 ? (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>{item.nombre}</Text>
              <Text style={styles.serviceDescription}>{item.descripcion}</Text>
              <Text style={styles.servicePrice}>Precio: {item.precio}</Text>
              <Text style={styles.serviceContact}>Contacto: {item.contacto}</Text>
              
            </View>
          )}
        />
      ) : (
        <Text style={styles.noServices}>No hay servicios disponibles</Text>
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  serviceItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
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
});
