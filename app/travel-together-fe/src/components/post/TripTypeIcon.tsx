import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import Color from '../../utilites/Color';

interface IProps {
  name?: string;
}

const TripTypeIcon = (props: IProps) => {
  const { name } = props;

  switch (name) {
    case 'Any type':
      return (
        <>
          <FontAwesome name='map-signs' size={24} color={Color.text_grey} />
        </>
      );
    case 'Beach holiday':
      return (
        <>
          <MaterialIcons
            name='beach-access'
            size={24}
            color={Color.text_grey}
          />
        </>
      );
    case 'Active leisure':
      return (
        <>
          <MaterialCommunityIcons
            name='ski-water'
            size={24}
            color={Color.text_grey}
          />
        </>
      );
    case 'Night life':
      return (
        <>
          <MaterialIcons name='nightlife' size={24} color={Color.text_grey} />
        </>
      );
    case 'Winter sport':
      return (
        <>
          <FontAwesome5 name='skiing' size={24} color={Color.text_grey} />
        </>
      );
    case 'Road trip':
      return (
        <>
          <FontAwesome5 name='car' size={24} color={Color.text_grey} />
        </>
      );
    case 'Sight seeing':
      return (
        <>
          <MaterialCommunityIcons
            name='eiffel-tower'
            size={24}
            color={Color.text_grey}
          />
        </>
      );
    case 'Weekend break':
      return (
        <>
          <MaterialIcons name='weekend' size={24} color={Color.text_grey} />
        </>
      );
    case 'Business trip':
      return (
        <>
          <FontAwesome5
            name='business-time'
            size={24}
            color={Color.text_grey}
          />
        </>
      );
    case 'gender':
      return (
        <>
          <FontAwesome5 name='transgender' size={24} color='black' />
        </>
      );
    default:
      return <></>;
  }
};

export default TripTypeIcon;
