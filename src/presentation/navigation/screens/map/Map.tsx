import MapView, { PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps'; 
import { Location } from '../../../../infrastucture/interfaces/location';
import { FAB } from '../../../components/ui/FAB';
import { useEffect, useRef, useState } from 'react';
import { useLocationStore } from '../../../store/useLocationStore';

interface Props {
    showsUserLocation?: boolean;
    initialLocation: Location;
  }

  export const Map = ({showsUserLocation = true, initialLocation}: Props) => {
    
    const mapRef = useRef<MapView>();
    const cameraLocation = useRef<Location>(initialLocation);
    const [isFollowingUser, setIsFollowingUser] = useState(true);
    const [isShowingPolyline, setIsShowingPolyline] = useState(true);


    const {getLocation, lastKnownLocation, watchLocation, clearWatchLocation, userLocationList} = useLocationStore();    

    const moveCameraToLocation = (location: Location) => {
        if (!mapRef.current) return;
        mapRef.current.animateCamera({center: location});
      };
    
      const moveToCurrentLocation = async () => {
        if (!lastKnownLocation){
            moveCameraToLocation(initialLocation);
        }
        const location = await getLocation();
        if( !location ) return;
        moveCameraToLocation(location);
        }    


        useEffect(() => {
            watchLocation();
        
            return () => {
              clearWatchLocation();
            };
          }, []);
        
          useEffect(() => {
            if (lastKnownLocation && isFollowingUser) {
              moveCameraToLocation(lastKnownLocation);
            }
          }, [lastKnownLocation, isFollowingUser]);

    return(
        <>
            <MapView
                ref={(map) => mapRef.current = map!}
                showsUserLocation={showsUserLocation}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{flex:1}}
                onTouchStart={() => setIsFollowingUser(false)}
                region={{
                    latitude: cameraLocation.current.latitude,
                    longitude: cameraLocation.current.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}>

                {isShowingPolyline && (
                    <Polyline
                        coordinates={userLocationList}
                        strokeColor="black"
                        strokeWidth={5}
                    />
                )}
            </MapView> 


            <FAB
                iconName={isShowingPolyline ? 'eye-outline' : 'eye-off-outline'}
                onPress={() => setIsShowingPolyline(!isShowingPolyline)}
                style={{
                bottom: 170,
                right: 20,
                }}
            />
            <FAB
                iconName={isFollowingUser ? 'person-done-outline' : 'person-delete-outline'}
                onPress={() => setIsFollowingUser(!isFollowingUser)}
                style={{
                bottom: 100,
                right: 20,
                }}
            />
            <FAB
                iconName='compass-outline'
                onPress={moveToCurrentLocation}
                style={{
                bottom: 30,
                right: 20,
                }}
            />         
        </>

    );
};

