import {StyleSheet} from 'react-native';
import {Icon, useTheme} from '@ui-kitten/components';

interface Props {
  name: string;
  color?: string;
  white?: boolean;
}

export const MyIcon2 = ({name, color, white = false}: Props) => {

  const theme = useTheme();
  
  if ( white )  {
    color = theme['text-basic-color'];
  } else if ( !color ) {
    color = theme['color-info-100'];
  } else {
    color = theme['color-info-100'];
  }


  return <Icon style={styles.icon} fill={ color } name={ name } />;
};

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});