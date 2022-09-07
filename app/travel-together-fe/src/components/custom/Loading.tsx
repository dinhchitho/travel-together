import { View, ActivityIndicator } from "react-native";
import { globalStyles } from "../../globalStyles";

interface IProps {}

const Loading = (props: IProps) => {
  return (
    <View style={globalStyles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Loading;
