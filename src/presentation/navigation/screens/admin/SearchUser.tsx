import React, { useEffect, useState } from 'react';
import { Button, Layout, Text, List, ListItem, Select, SelectItem, IndexPath, Datepicker } from '@ui-kitten/components';
import { useRegisterStore } from '../../../store/useRegisterStore';
import { RegisterResponse } from '../../../../infrastucture/interfaces/register.response';
import { RootStackParams } from '../../StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUserStore } from '../../../store/useUserStore';

const getWeekEnd = (startDate: Date) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return endDate;
};

interface Props extends StackScreenProps<RootStackParams, "SearchUserScreen"> {}

export const SearchUserScreen = ({ navigation }: Props) => {
  const [userId, setUserId] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(getWeekEnd(new Date()));
  const [records, setRecords] = useState<RegisterResponse[]>([]);
  const { findRegisterById2, editAttendanceCheckIn, editAttendanceCheckOut } = useRegisterStore();
  const [selectedRecord, setSelectedRecord] = useState<RegisterResponse | null>(null);
  const { getAll } = useUserStore();
  const [users, setUsers] = useState<Array<{ _id: string, name: string, username: string }>>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<IndexPath | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tipo, setTipo] = useState<'checkIn' | 'checkOut'>('checkIn');

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
    setEndDate(getWeekEnd(nextDate));
  };

  const handleSearchRecords = async () => {
    if (!userId) {
      Alert.alert('Error', 'ID de usuario no proporcionado');
      console.log('User ID no proporcionado');
      return;
    }
    console.log('Buscando registros de', startDate, 'a', endDate, 'del usuario con id:', userId);
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
    } catch (error) {
      console.error('Error al buscar registros:', error);
      Alert.alert('Error', 'Hubo un error al buscar los registros');
    }
  };

  const handleEditRecord = (record: RegisterResponse, tipo: 'checkIn' | 'checkOut') => {
    setSelectedRecord(record);
    setTipo(tipo);
    setSelectedDate(tipo === 'checkIn' ? record.checkIn : record.checkOut);
    setShowDatePicker(true);
    console.log('Editando', tipo === 'checkIn' ? 'entrada' : 'salida', 'del registro:', record._id);
  };

  const handleUpdateRecord = async (updatedRecord: RegisterResponse, date: Date) => {
    if (!updatedRecord) return;

    try {
      let success = false;
      if (tipo === 'checkIn') {
        updatedRecord.checkIn.setHours(date.getHours(), date.getMinutes());
        success = await editAttendanceCheckIn(updatedRecord._id, updatedRecord.checkIn);
        console.log('se logró editar asistencia de checkIn:', success);
        if (success) {
          Alert.alert('Éxito', `Se ha actualizado la entrada correctamente.`);
        } else {
          Alert.alert('Error', `No se pudo actualizar la entrada.`);
        }
      } else {
        updatedRecord.checkOut.setHours(date.getHours(), date.getMinutes());
        success = await editAttendanceCheckOut(updatedRecord._id, updatedRecord.checkOut);
        console.log('se logró editar asistencia de checkOut:', success);
        if (success) {
          Alert.alert('Éxito', `Se ha actualizado la salida correctamente.`);
        } else {
          Alert.alert('Error', `No se pudo actualizar la salida.`);
        }
      }

      if (success) {
        setSelectedRecord(null);
        setSelectedDate(new Date());
        handleSearchRecords();
      }
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      Alert.alert('Error', 'Hubo un error al actualizar el registro.');
    }
    setShowDatePicker(false);
  };

  const handleSelectedUser = (index: IndexPath) => {
    setSelectedUserIndex(index);
    const selectedUser = users[index.row];
    if (selectedUser) {
      setUserId(selectedUser._id);
    }
  };

  const onChangeDate = async (event: any, date: Date | undefined) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    if (date) {
      setShowDatePicker(Platform.OS === 'ios');
      setSelectedDate(date);
      console.log('Fecha seleccionada:', date);

      if (selectedRecord) {
        await handleUpdateRecord({ ...selectedRecord }, date);
      }
    }
  };

  return (
    <Layout style={{ flex: 1, padding: 20 }}>
      <Text category='h1' style={{ marginBottom: 20 }}>Reporte Semanal</Text>

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

      <Datepicker
        label='Fecha de Inicio'
        date={startDate}
        onSelect={handleStartDateChange}
        style={{ marginBottom: 20 }}
      />

      <Datepicker
        label='Fecha de Fin'
        date={endDate}
        disabled={true}
        style={{ marginBottom: 20 }}
      />

      <Button onPress={handleSearchRecords} style={{ marginBottom: 20 }}>Buscar Registros</Button>

      <List
        data={records}
        renderItem={({ item }) => (
          <ListItem
            title={`Entrada: ${item.checkIn.toLocaleString()}`}
            description={`Salida: ${item.checkOut.toLocaleString()}`}
            accessoryRight={() => (
              <Layout style={{ flexDirection: 'row' }}>
                <Button size='small' onPress={() => handleEditRecord(item, 'checkIn')}>Editar Entrada</Button>
                <Button size='small' onPress={() => handleEditRecord(item, 'checkOut')}>Editar Salida</Button>
              </Layout>
            )}
          />
        )}
      />

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )}
    </Layout>
  );
};
