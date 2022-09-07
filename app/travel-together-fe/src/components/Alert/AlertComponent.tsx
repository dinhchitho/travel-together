import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import animationJson from "../../../assets/checking.json";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
interface dataAlert {
  title?: string;
  navigation?: string;
  message?: string;
  textButton?: string;
  route?: any;
}

const AlertComponent = (data: dataAlert) => {
  const useNavigate = useNavigation<any>();
  const { title, message, textButton, navigation } = data;

  const goToScreen = () => {
    useNavigate.navigate(navigation || data.navigation);
  };

  const [timeIcon, setTimeIcon] = useState<any>(1);
  useEffect(() => {
    setTimeout(() => {
      setTimeIcon(0);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        style={{
          marginTop: "-15%",
        }}
        source={animationJson}
        autoPlay
        loop={false}
        speed={timeIcon}
        resizeMode="contain"
      />
      <Text
        style={{
          marginTop: "100%",
          color: "#1DBF73",
          fontSize: 30,
        }}
      >
        {title || data.title}
      </Text>
      <Text
        style={{
          width: "75%",
          textAlign: "center",
          fontSize: 15,
        }}
      >
        {message || data.message}
      </Text>
      <TouchableOpacity onPress={goToScreen}>
        <Text style={styles.button}>{textButton || data.textButton}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AlertComponent;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    textAlign: "center",
  },
  button: {
    fontSize: 18,
    color: "white",
    width: 345,
    height: 50,
    marginTop: "40%",
    borderRadius: 3,
    backgroundColor: "#1DBF73",
    padding: 10,
    textAlign: "center",
  },
});
