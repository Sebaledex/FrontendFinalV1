import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Layout, Input, Button, Text } from '@ui-kitten/components';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [workedHours, setWorkedHours] = useState<number[]>([]);

  const fetchWorkedHours = async (id: string) => {
    // Simular una llamada a una API para obtener las horas trabajadas
    const simulatedData = id === '123' ? [8, 7, 9, 8, 7, 8, 9] : [5, 6, 7, 8, 9, 0, 0];
    setWorkedHours(simulatedData);
  };

  const handleInputChange = (id: string) => {
    setUserId(id);
    if (id) {
      fetchWorkedHours(id);
    } else {
      setWorkedHours([]);
    }
  };

  const clearGraph = () => {
    setUserId('');
    setWorkedHours([]);
  };

  return (
    <Layout style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
      <Input
        label='User ID'
        placeholder='Introduce el ID del usuario'
        value={userId}
        onChangeText={handleInputChange}
        style={styles.input}
      />
      {workedHours.length > 0 && (
        <BarChart
          data={{
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [
              {
                data: workedHours
              }
            ]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726'
            }
          }}
          yAxisLabel=""
          yAxisSuffix=""
          style={styles.chart}
          verticalLabelRotation={30}
        />
      )}
      <Button onPress={clearGraph} style={styles.button}>
        Limpiar Gráfico
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 20,
    width: '100%',
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
  },
  button: {
    marginTop: 20,
  },
});

export default DashboardScreen;
