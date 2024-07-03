import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { Map } from './Map';
import { useLocationStore } from '../../../store/useLocationStore';
import { useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

export const MapScreen = ({ navigation }: Props) => {


    const { lastKnownLocation, getLocation } = useLocationStore();
    
    useEffect(() => {
        if ( lastKnownLocation === null ) {
          getLocation();
        }
      }, [])
      
     
    
    if ( lastKnownLocation === null ) {
        return (<LoadingScreen/>)
      }


  return (

    <View style={styles.container}>
        <Map 
        initialLocation={ lastKnownLocation }
        />

   </View>
      
  )
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
    },
   });

export default MapScreen;
