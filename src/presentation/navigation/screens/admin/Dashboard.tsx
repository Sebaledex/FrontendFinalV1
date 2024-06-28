import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native';
import { Layout, Button, Text, Select, IndexPath, SelectItem, Datepicker, Toggle } from '@ui-kitten/components';
import { BarChart } from 'react-native-chart-kit';
import { useRegisterStore } from '../../../store/useRegisterStore';
import { useUserStore } from '../../../store/useUserStore';
import { RegisterResponse } from '../../../../infrastucture/interfaces/register.response';

const screenWidth = Dimensions.get('window').width;

const getWeekEnd = (startDate: Date) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 5); // Cambiar a 4 para obtener solo lunes a viernes
  return endDate;
};

const getYearEnd = (startDate: Date) => {
  return new Date(startDate.getFullYear(), 11, 31);
};

const DashboardScreen: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(getWeekEnd(new Date()));
  const [records, setRecords] = useState<RegisterResponse[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<IndexPath | null>(null);
  const [workedHours, setWorkedHours] = useState<number[]>([]);
  const [viewType, setViewType] = useState<'weekly' | 'annual'>('weekly');
  const { getAll } = useUserStore();
  const [users, setUsers] = useState<Array<{ _id: string, name: string, username: string }>>([]);
  const { findRegisterById2 } = useRegisterStore();

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAll();
      if (allUsers) {
        setUsers(allUsers);
      }
    };
    fetchUsers();
  }, []);

  const handleStartDateChange = (nextDate: Date) => {
    setStartDate(nextDate);
    setEndDate(viewType === 'weekly' ? getWeekEnd(nextDate) : getYearEnd(nextDate));
  };

  const handleSelectedUser = (index: IndexPath) => {
    setSelectedUserIndex(index);
    const selectedUser = users[index.row];
    if (selectedUser) {
      setUserId(selectedUser._id);
      fetchWorkedHours(selectedUser._id, viewType);
    }
  };

  const handleSearchRecords = async () => {
    if (!userId) {
      Alert.alert('Error', 'ID de usuario no proporcionado');
      return;
    }
    try {
      const resp = await findRegisterById2(startDate.toISOString(), endDate.toISOString(), userId);
      if (!resp) {
        console.log('Error al buscar registros');
        return;
      }
      const formattedRecords = resp.map((item) => ({
        ...item,
        checkIn: new Date(item.checkIn),
        checkOut: new Date(item.checkOut),
      }));
      setRecords(formattedRecords);
      calculateWorkedHours(formattedRecords);
    } catch (error) {
      console.error('Error al buscar registros:', error);
      Alert.alert('Error', 'Hubo un error al buscar los registros');
    }
  };

  const calculateWorkedHours = (records: RegisterResponse[]) => {
    const hours: number[] = [];
    if (viewType === 'weekly') {
      for (let i = 0; i < 5; i++) { // Solo de lunes a viernes
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        const dayRecords = records.filter(record => {
          const checkInDate = new Date(record.checkIn);
          return checkInDate.getDate() === day.getDate() && checkInDate.getMonth() === day.getMonth() && checkInDate.getFullYear() === day.getFullYear();
        });
        const totalHours = dayRecords.reduce((sum, record) => sum + (record.checkOut.getTime() - record.checkIn.getTime()) / (1000 * 60 * 60), 0);
        hours.push(totalHours);
      }
    } else {
      for (let i = 0; i < 12; i++) {
        const monthRecords = records.filter(record => {
          const checkInDate = new Date(record.checkIn);
          return checkInDate.getMonth() === i && checkInDate.getFullYear() === startDate.getFullYear();
        });
        const totalHours = monthRecords.reduce((sum, record) => sum + (record.checkOut.getTime() - record.checkIn.getTime()) / (1000 * 60 * 60), 0);
        hours.push(totalHours);
      }
    }
    setWorkedHours(hours);
  };

  const fetchWorkedHours = async (id: string, viewType: 'weekly' | 'annual') => {
    const start = viewType === 'weekly' ? startDate : new Date(startDate.getFullYear(), 0, 1);
    const end = viewType === 'weekly' ? endDate : new Date(startDate.getFullYear(), 11, 31);
    const resp = await findRegisterById2(start.toISOString(), end.toISOString(), id);
    if (!resp) {
      console.log('Error al buscar registros');
      return;
    }
    const formattedRecords = resp.map((item) => ({
      ...item,
      checkIn: new Date(item.checkIn),
      checkOut: new Date(item.checkOut),
    }));
    setRecords(formattedRecords);
    calculateWorkedHours(formattedRecords);
  };

  const clearGraph = () => {
    setUserId('');
    setWorkedHours([]);
  };

  const getFormattedLabels = () => {
    if (viewType === 'weekly') {
      return ['Lun ' + startDate.getDate(), 'Mar ' + (startDate.getDate() + 1), 'Mié ' + (startDate.getDate() + 2), 'Jue ' + (startDate.getDate() + 3), 'Vie ' + (startDate.getDate() + 4)];
    } else {
      return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
  };

  const filterMondays = (date: Date) => {
    return date.getDay() === 1; // Devuelve true solo para los lunes (getDay() devuelve 1 para lunes, 2 para martes, etc.)
  };

  return (
    <Layout style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>

      <Select
        label='Seleccione el Usuario'
        value={selectedUserIndex !== null && users[selectedUserIndex.row] ? users[selectedUserIndex.row].name : 'Seleccione un usuario'}
        selectedIndex={selectedUserIndex || []}
        onSelect={(index) => handleSelectedUser(index as IndexPath)}
        style={{ marginBottom: 20 }}
      >
        {users.map((user) => (
          <SelectItem key={user._id} title={user.name} />
        ))}
      </Select>

      <Toggle
        style={styles.toggle}
        checked={viewType === 'annual'}
        onChange={(isChecked) => {
          const newViewType = isChecked ? 'annual' : 'weekly';
          setViewType(newViewType);
          setEndDate(isChecked ? getYearEnd(startDate) : getWeekEnd(startDate));
          if (userId) {
            fetchWorkedHours(userId, newViewType);
          } else {
            setWorkedHours([]);
          }
        }}
      >
        {viewType === 'annual' ? 'Vista Anual' : 'Vista Semanal'}
      </Toggle>

      <Datepicker
        label='Fecha de Inicio'
        date={startDate}
        onSelect={handleStartDateChange}
        filter={filterMondays} // Aplicamos el filtro para limitar a los lunes
        style={{ marginBottom: 20 }}
      />

      <Datepicker
        label='Fecha de Fin'
        date={endDate}
        disabled={true}
        style={{ marginBottom: 20 }}
      />

      <Button onPress={handleSearchRecords} style={{ marginBottom: 20 }}>Buscar Registros</Button>

      <ScrollView horizontal={true} style={{ marginVertical: 20 }}>
        {workedHours.length > 0 && (
          <BarChart
            data={{
              labels: getFormattedLabels(),
              datasets: [
                {
                  data: workedHours.map((hours) => Math.round(hours)), // Redondear las horas a números enteros
                },
              ],
            }}
            width={screenWidth * 1.5} // Ancho extendido para desplazamiento horizontal
            height={220}
            yAxisLabel=""
            fromZero={true}
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(26, 132, 198, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForLabels: {
                fontSize: 12,
                fontWeight: 'bold',
              },
              propsForBackgroundLines: {
                color: (opacity = 0.5) => `rgba(26, 132, 198, ${opacity})`,
              },
            }}
            verticalLabelRotation={0}
            showValuesOnTopOfBars
          />
        )}
      </ScrollView>

      <Button onPress={clearGraph} style={styles.button}>
        Limpiar Gráfico
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  toggle: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  button: {
    marginTop: 20,
  },
});

export default DashboardScreen;
