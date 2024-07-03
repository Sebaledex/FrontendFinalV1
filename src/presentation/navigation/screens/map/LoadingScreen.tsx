import { Props } from "@ui-kitten/components/devsupport/services/props/props.service";
import { ActivityIndicator, View } from "react-native";







export const LoadingScreen = ({ navigation }: Props) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={30} color='black' />
          
        </View>
      )


}




export default LoadingScreen;
