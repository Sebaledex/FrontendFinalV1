import React, { useEffect, useState } from 'react';
import { Layout, Text, Button, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../StackNavigator';
import { StyleSheet, View } from 'react-native';
import { ServiceResponse } from '../../../../infrastucture/service.response';
import { useServiceStore } from '../../../store/useServiceStore';

type Props = StackScreenProps<RootStackParams, 'Reportes'>;

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const Reportes = ({ navigation }: Props) => {
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [selectedReportIndex, setSelectedReportIndex] = useState<IndexPath>(new IndexPath(0));
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<IndexPath>(new IndexPath(0));
  const [monthlySalesData, setMonthlySalesData] = useState<{ month: number; total: number }[]>([]);
  const [totalSalesData, setTotalSalesData] = useState<number | null>(null);
  const [annualSalesData, setAnnualSalesData] = useState<{ year: number; total: number }[]>([]);
  const [top5ServicesData, setTop5ServicesData] = useState<ServiceResponse[]>([]);
  const { getByUser, user, totalSales, monthlySales, annualSales, top5Services } = useServiceStore();

  const reportOptions = ['Total', 'Mensual', 'Anual', 'Top 5'];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getByUser();
        console.log('Datos obtenidos:', data);
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [user, getByUser]);

  const handleReportSelection = async () => {
    const selectedReport = reportOptions[selectedReportIndex.row].toLowerCase();
    const selectedServiceId = services[selectedServiceIndex.row]._id;

    switch (selectedReport) {
      case 'total':
        const totalData = await totalSales(selectedServiceId);
        console.log('Ventas totales:', totalData);
        setTotalSalesData(totalData); // Store the total sales data
        setMonthlySalesData([]); // Reset monthly sales data
        setAnnualSalesData([]); // Reset annual sales data
        setTop5ServicesData([]); // Reset top 5 services data
        break;
      case 'mensual':
        const data = await monthlySales(selectedServiceId);
        console.log('Ventas mensuales:', data);
        setMonthlySalesData(data || []);
        setTotalSalesData(null); // Reset total sales data
        setAnnualSalesData([]); // Reset annual sales data
        setTop5ServicesData([]); // Reset top 5 services data
        break;
      case 'anual':
        const annualData = await annualSales(selectedServiceId);
        console.log('Ventas anuales:', annualData);
        setMonthlySalesData([]); // Reset monthly sales data
        setTotalSalesData(null); // Reset total sales data
        setAnnualSalesData(annualData || []); // Set annual sales data
        setTop5ServicesData([]); // Reset top 5 services data
        break;
      case 'top 5':
        const top5Data = await top5Services();
        console.log('Top 5 servicios:', top5Data);
        setTop5ServicesData(top5Data || []); // Set top 5 services data
        setMonthlySalesData([]); // Reset monthly sales data
        setTotalSalesData(null); // Reset total sales data
        setAnnualSalesData([]); // Reset annual sales data
        break;
    }
  };

  const handleNavigateHome = () => {
    navigation.navigate('HomeScreen'); // Navigates to 'HomeScreen'
  };

  return (
    <Layout style={styles.container}>
      <Text category='h1'>Mis Servicios</Text>

      <Text category='s1' style={styles.label}>Seleccionar Tipo De Reporte</Text>
      <Select
        selectedIndex={selectedReportIndex}
        onSelect={index => setSelectedReportIndex(index as IndexPath)}
        value={reportOptions[selectedReportIndex.row]}
        style={styles.select}
      >
        {reportOptions.map((option, index) => (
          <SelectItem title={option} key={index} />
        ))}
      </Select>

      {selectedReportIndex.row !== 3 && (
        <>
          <Text category='s1' style={styles.label}>Seleccionar Servicio</Text>
          <Select
            selectedIndex={selectedServiceIndex}
            onSelect={index => setSelectedServiceIndex(index as IndexPath)}
            value={`${services[selectedServiceIndex.row]?.nombre} - ${services[selectedServiceIndex.row]?.descripcion}` || 'Seleccionar servicio'}
            style={styles.select}
          >
            {services.map((service, index) => (
              <SelectItem
                title={`${service.nombre} - ${service.descripcion}`}
                key={index}
              />
            ))}
          </Select>
        </>
      )}

      <Button style={styles.generateButton} onPress={handleReportSelection}>
        Generar Reporte
      </Button>

      {selectedReportIndex.row === 0 && totalSalesData !== null && (
        <View style={styles.resultContainer}>
          <Text category='s1' style={styles.resultText}>
            Ingresos totales obtenidos con este servicio:
          </Text>
          <Text category='s1' style={styles.resultValue}>
            {totalSalesData} pesos
          </Text>
        </View>
      )}

      {selectedReportIndex.row === 1 && monthlySalesData.length > 0 && (
        <View style={styles.resultContainer}>
          <Text category='s1' style={styles.resultText}>
            Ventas mensuales:
          </Text>
          {monthlySalesData.map((monthData, index) => (
            <Text key={index} category='s1' style={styles.resultValue}>
              {`Mes ${monthNames[monthData.month - 1]}: ${monthData.total} pesos`}
            </Text>
          ))}
        </View>
      )}

      {selectedReportIndex.row === 2 && annualSalesData.length > 0 && (
        <View style={styles.resultContainer}>
          <Text category='s1' style={styles.resultText}>
            Ventas anuales:
          </Text>
          {annualSalesData.map((yearData, index) => (
            <Text key={index} category='s1' style={styles.resultValue}>
              {`Año ${yearData.year}: ${yearData.total} pesos`}
            </Text>
          ))}
        </View>
      )}

      {selectedReportIndex.row === 3 && top5ServicesData.length > 0 && (
        <View style={styles.resultContainer}>
          <Text category='s1' style={styles.resultText}>
            Top 5 servicios más solicitados:
          </Text>
          {top5ServicesData.map((service, index) => (
            <Text key={index} category='s1' style={styles.resultValue}>
              {`${service.nombre}: ${service.contadorSolicitudes} veces`}
            </Text>
          ))}
        </View>
      )}

      <Button style={styles.exitButton} onPress={handleNavigateHome}>
        Salir
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  select: {
    marginBottom: 20,
    width: '100%',
  },
  generateButton: {
    marginBottom: 20,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 16,
    textAlign: 'center',
  },
  exitButton: {
    marginTop: 20,
  },
});

export default Reportes;
