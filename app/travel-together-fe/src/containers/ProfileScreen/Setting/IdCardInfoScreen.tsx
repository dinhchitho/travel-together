import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import HeaderCommon from "../../../components/HeaderCommon/HeaderCommon";
import {
  SETTING_SCREEN,
  VERIFY_ACCOUNT_SCREEN,
} from "../../../utilites/routerName";

import { AntDesign } from "@expo/vector-icons";
import Color from "../../../utilites/Color";
import { WINDOW_HEGIHT } from "../../../utilites/Dimensions";
import { BASE_URL } from "../../../utilites";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { onUpdateLocalGuideCurrentUser } from "../../../redux";

interface IProps {
  route: any;
}

const IdCardInfoScreen = (props: IProps) => {
  const navigation = useNavigation<any>();

  const params = props.route.params;

  // call redux
  const dispatch = useDispatch();

  const IDCardInfo: any = {
    Name: params.name,
    Identify_card: params.id,
    Date_of_birth: params.dob,
    National: params.nationality,
    Issued: params.doe,
    Place_of_origin: params.home,
    Place_of_residence: params.address,
  };

  const capitalizeFirstLetter = (string: string) => {
    let strCapitalizaFirstLetter = "";
    string.split(" ").forEach((element: string) => {
      strCapitalizaFirstLetter = strCapitalizaFirstLetter.concat(
        `${
          element.toLowerCase().charAt(0).toUpperCase() +
          element.toLowerCase().slice(1)
        } `
      );
    });
    return strCapitalizaFirstLetter.slice(0, -1);
  };

  const updateIdentifyCardUserInfo = async () => {
    try {
      const response = await axios.post(`${BASE_URL}user/become-localguide`, {
        ...params,
        name: capitalizeFirstLetter(params.name),
      });
      if (response && response.data.success) {
        dispatch<any>(onUpdateLocalGuideCurrentUser(true));
        navigation.navigate(SETTING_SCREEN);
      }
    } catch (error) {
      console.log("error :", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <HeaderCommon
          title="Verify account"
          leftIcon={"arrow-left"}
          leftNavigation={VERIFY_ACCOUNT_SCREEN}
        ></HeaderCommon>
        <View style={styles.genderWrapper}>
          <View>
            <View style={{ paddingHorizontal: 21 }}>
              <Text style={{ color: "#9C9C9C" }}>Gender</Text>
              <View style={styles.genderCheck}>
                <View style={styles.genderIcon}>
                  <AntDesign
                    name={params.sex === "NAM" ? "checkcircle" : "checkcircleo"}
                    size={16}
                    color="black"
                  />
                  <Text style={{ paddingLeft: 10 }}>Male</Text>
                </View>
                <View style={styles.genderIcon}>
                  <AntDesign
                    name={params.sex === "NU" ? "checkcircle" : "checkcircleo"}
                    size={16}
                    color="black"
                  />
                  <Text style={{ paddingLeft: 10 }}>Female</Text>
                </View>
              </View>
            </View>
            {Object.keys(IDCardInfo).map((item: any) => (
              <View style={styles.content} key={item}>
                <Text style={styles.title}>{item.replaceAll("_", " ")}</Text>
                <View style={styles.info}>
                  <Text>{IDCardInfo[item]}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 15,
        }}
      >
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => {
            updateIdentifyCardUserInfo();
          }}
        >
          <Text style={{ color: Color.white, fontSize: 17 }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default IdCardInfoScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    height: "100%",
  },
  genderWrapper: {
    paddingVertical: 18,
    paddingHorizontal: 15,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  genderCheck: {
    flexDirection: "row",
    width: 250,
    justifyContent: "space-between",
    paddingTop: 5,
  },
  genderIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginTop: 18,
  },
  title: {
    color: "#9C9C9C",
    backgroundColor: Color.white,
    position: "absolute",
    left: 13,
    zIndex: 2,
    paddingHorizontal: 8,
  },
  info: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 8,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ECEDEE",
    borderRadius: 11,
  },
  submitBtn: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#20AA22",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
