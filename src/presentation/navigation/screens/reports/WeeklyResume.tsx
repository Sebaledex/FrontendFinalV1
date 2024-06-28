import React, { useState } from 'react';
import { Button, Datepicker, Layout, Text, List, ListItem } from '@ui-kitten/components';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { useRegisterStore } from '../../../store/useRegisterStore';
import { RegisterResponse } from '../../../../infrastucture/interfaces/register.response';

const getWeekEnd = (startDate: Date) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // Sumar 6 días al inicio de la semana para obtener el fin de la semana
  return endDate;
};

export const WeeklyResumeScreen = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(getWeekEnd(new Date()));
  const [records, setRecords] = useState<RegisterResponse[]>([]);
  const { user } = useAuthStore();
  const { findRegisterById } = useRegisterStore();

  const handleStartDateChange = (nextDate: Date) => {
    setStartDate(nextDate);
    setEndDate(getWeekEnd(nextDate));
  };

  const handleSearchRecords = async () => {
    console.log('Buscando registros ', startDate, 'a', endDate, 'del usuario:', user?.id);
    const resp = await findRegisterById(startDate.toISOString(), endDate.toISOString());
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
  }
  

  return (
    <Layout style={{ flex: 1, padding: 20 }}>
      <Text category='h1' style={{ marginBottom: 20 }}>Reporte Semanal</Text>

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
          />
        )}
      />
</Layout>
);
};

