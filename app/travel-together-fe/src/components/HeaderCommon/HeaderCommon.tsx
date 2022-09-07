import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
interface dataConfig {
  title?: string;
  leftIcon?: any;
  rightIcon?: any;
  rightNavigation?: string;
  leftNavigation?: string;
  typeLib?: string;
}
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import Color from "../../utilites/Color";
import { useNavigation } from "@react-navigation/native";

const HeaderCommon = (dataConfig: dataConfig) => {
  const navigation = useNavigation<any>();

  const { title, leftIcon, rightIcon, rightNavigation, leftNavigation } =
    dataConfig;

  const navigationRight = () => {
    navigation.navigate(rightNavigation);
  };
  const navigationLeft = () => {
    navigation.navigate(leftNavigation);
  };
  return (
    <View style={headerStyles.header}>
      <TouchableOpacity
        style={{ width: 50, alignItems: "flex-start" }}
        onPress={() => navigationLeft()}
      >
        <Feather name={leftIcon} size={24} color={Color.text_grey} />
      </TouchableOpacity>
      <Text style={headerStyles.headerText}>{title}</Text>
      <TouchableOpacity
        style={{ width: 50, alignItems: "flex-end" }}
        onPress={() => navigationRight()}
      >
        <Entypo name={rightIcon} size={24} color={Color.text_grey} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderCommon;

export const headerStyles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#ffffff",
    borderWidth: 0.3,
    borderColor: "transparent",
    borderBottomColor: "#DDDDDD",
  },
  headerText: {
    color: Color.black,
    fontSize: 17,
    fontWeight: "500",
  },
});
