import React, { useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import HeaderCommon from "../../../components/HeaderCommon/HeaderCommon";
import Color from "../../../utilites/Color";
import { WINDOW_WIDTH } from "../../../utilites/Dimensions";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import {
  ID_CARD_INFO_SCREEN,
  SETTING_SCREEN,
} from "../../../utilites/routerName";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AppLoading from "../../../components/AppLoader/AppLoading";
import { FPT_AI_KEY } from "../../../utilites";

interface IProps {
  route: any;
}

const VerifyAccount = (props: IProps) => {
  const navigation = useNavigation<any>();

  const params = props.route.params;

  const [frontSideImage, setFrontSideImage] = useState<string>("");
  const [backSideImage, setBackSideImage] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const pickImage = async (type: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      type === "front"
        ? setFrontSideImage(result.uri)
        : setBackSideImage(result.uri);
    }
  };

  const getIdCardInfo = async (imageURL: string) => {
    let data = null;
    const form = new FormData();
    const fileName = imageURL.substring(imageURL.lastIndexOf("/") + 1);
    var image: any = {
      uri: imageURL,
      type: fileName,
      name: fileName,
    };
    form.append("image", image);
    await axios({
      method: "POST",
      url: "https://api.fpt.ai/vision/idr/vnm",
      data: form,
      headers: {
        "api-key": FPT_AI_KEY,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        data = response.data.data[0];
      })
      .catch(function (error) {
        setLoading(false);
        Alert.alert(" check again");
        console.log("error: ", error);
      });
    return data;
  };

  const onSubmitHandle = async () => {
    if (frontSideImage === "") {
      Alert.alert("Please select front side image");
    }
    if (backSideImage === "") {
      Alert.alert("Please select back side image");
    } else {
      setLoading(true);
      const frontSideData = await getIdCardInfo(frontSideImage);
      const backSideData = await getIdCardInfo(backSideImage);
      if (frontSideData && backSideData) {
        const { name, id, dob } = frontSideData;
        if (name && id && dob) {
          setLoading(false);
          navigation.navigate(ID_CARD_INFO_SCREEN, frontSideData);
        } else {
          setLoading(false);
          Alert.alert("Please check your front side image");
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <AppLoading />}
      <HeaderCommon
        title="Verify account"
        leftIcon={"arrow-left"}
        leftNavigation={SETTING_SCREEN}
      ></HeaderCommon>
      <View style={styles.content}>
        <Text style={styles.title}>
          Take a photo of both sides of the identity card
        </Text>
        <View style={styles.idCardWrapper}>
          <View style={styles.cardItemWrapper}>
            <Image
              source={
                frontSideImage !== ""
                  ? { uri: frontSideImage }
                  : require("../../../../assets/default.png")
              }
              style={styles.cardImage}
            ></Image>
            <TouchableOpacity
              style={styles.selectImageBtn}
              onPress={() => {
                pickImage("front");
              }}
            >
              <Text style={{ color: Color.white }}>Front</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardItemWrapper}>
            <Image
              source={
                backSideImage
                  ? { uri: backSideImage }
                  : require("../../../../assets/default.png")
              }
              style={styles.cardImage}
            ></Image>
            <TouchableOpacity
              style={styles.selectImageBtn}
              onPress={() => {
                pickImage("backside");
              }}
            >
              <Text style={{ color: Color.white }}>Backside</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.warning}>
          <MaterialCommunityIcons
            name="shield-check"
            size={26}
            color="#20AA22"
          />
          <Text>
            Travel together is committed to protecting everyone's personal
            information
          </Text>
        </View>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => onSubmitHandle()}
        >
          <Text style={{ color: Color.white, fontSize: 16 }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyAccount;

const styles = StyleSheet.create({
  container: {},
  content: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    height: "100%",
  },
  title: {
    fontSize: 15,
    marginBottom: 8,
  },
  idCardWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardItemWrapper: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ECEDEE",
    height: 160,
    borderRadius: 8,
    width: (WINDOW_WIDTH - 48) / 2,
    justifyContent: "space-between",
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  selectImageBtn: {
    width: "100%",
    height: 30,
    backgroundColor: "#667080",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  warning: {
    flexDirection: "row",
    paddingVertical: 8,
    alignItems: "center",
  },
  submitBtn: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#667080",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
