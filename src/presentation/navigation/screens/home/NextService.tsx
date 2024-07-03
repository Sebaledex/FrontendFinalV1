import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Button } from 'react-native';
import { usePostulacionStore } from '../../../store/usePostulacionStore';
import { useServiceStore } from '../../../store/useServiceStore';
import { PostulacionResponse } from '../../../../infrastucture/postulacion.response';

export const NextService = () => {
  const { getbyuser } = usePostulacionStore();
  const { getbyServiceId } = useServiceStore();
  const [postulaciones, setPostulaciones] = useState<PostulacionResponse[]>([]);
  const [serviceNames, setServiceNames] = useState<{ [key: string]: string }>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

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

  const handleReserve = (serviceId: string) => {
    setSelectedService(serviceId);
    setModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
              <View style={styles.postulacionDetails}>
                <Text style={styles.postulacionName}>Tu servicio: {serviceNames[item.servicioId] || 'Cargando...'}</Text>
                <Text style={styles.postulacionMessage}>llegara a las: {item.horarioSolicitado}</Text>
                <Text style={styles.postulacionMessage}>del dia: {formatDate(item.fechaSolicitada)}</Text>
              </View>
              <Button
                title="Chatear"
                onPress={() => handleReserve(item._id)}
              />
            </View>
          )}
        />
      ) : (
        <Text style={styles.noPostulaciones}>No hay reservas disponibles</Text>
      )}

      {modalVisible && (
        <View style={styles.modalContainer}>
          <Text>Modal para reservar servicio</Text>
          <Button
            title="Cerrar"
            onPress={() => setModalVisible(false)}
          />
        </View>
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
  },
});
