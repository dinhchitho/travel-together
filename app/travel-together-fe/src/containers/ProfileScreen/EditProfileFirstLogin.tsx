import React from "react";
import Color from "../../utilites/Color";
import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ActionSheetIOS,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderCommon from "../../components/HeaderCommon/HeaderCommon";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import * as ImagePicker from "expo-image-picker";
import { log } from "react-native-reanimated";
import { WINDOW_WIDTH } from "../../utilites/Dimensions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { navigate } from "../../navigation/RootNavigator";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  Entypo,
  FontAwesome5,
  FontAwesome,
  MaterialIcons,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState, UpdateCurrentUser } from "../../redux";
import BottomModal, {
  BottomSheetRefProps,
} from "../../components/custom/BottomModal";
import { WINDOW_HEGIHT } from "../../utilites/Dimensions";
import firebase from "../../../config";
import axios from "axios";
import { BASE_URL } from "../../utilites";
import AppLoading from "../../components/AppLoader/AppLoading";

const EditProfileFirstLogin = () => {
  const { user, error, userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  //constructor of data information
  const [fullName, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<any>("");
  const [gender, setGender] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [bio, setBio] = useState<string>("");
  const [dob, setDob] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  const windowWidth = Dimensions.get("window").width;

  const dispatch = useDispatch();

  const nameRef = useRef<any>();
  const emailRef = useRef<any>();

  //set data if have
  useEffect(() => {
    if (userCurrent != undefined && userCurrent.hasUpdated == false) {
      setName(userCurrent.fullName);
      setAvatar(userCurrent.avatar);
      setGender(userCurrent.gender);
      setEmail(userCurrent.email);
      setBio(userCurrent.bio);
    }
  }, [userCurrent]);

  const pickImage = async (type: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };

  // show gender
  const showStatusActionSheet = (type: string) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options:
          type === "gender"
            ? ["Cancel", "Male", "Female"]
            : ["Cancel", "Single", "Married"],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex !== 0) {
          setGender(buttonIndex === 1 ? true : false);
        }
      }
    );
  };

  // upload image
  const uploadImage = async (imageUrl: string, type: string) => {
    setLoading(true);
    let firebaseUrl = "";
    if (imageUrl) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
      var snapshot = firebase.storage().ref().child(fileName).put(blob);
      try {
        await snapshot;
        let uploadPromise = new Promise((resolve, reject) => {
          snapshot.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            () => {},
            (error) => {
              console.log("error :", error);
              reject(error);
            },
            () => {
              snapshot.snapshot.ref.getDownloadURL().then((url: string) => {
                resolve(url);
              });
            }
          );
        });
        await uploadPromise.then((val: any) => {
          firebaseUrl = val;
        });
      } catch (error) {
        console.log("error :", error);
      }
      return firebaseUrl;
    }
  };

  // validate data
  const validateData = () => {
    if (fullName == "") {
      Alert.alert(
        "Somethings required",
        //body
        `Full Name is required!`,
        [],
        { cancelable: true }
      );
      return false;
    } else if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      Alert.alert(
        "Somethings required",
        //body
        `Email is required!`,
        [],
        { cancelable: true }
      );
      return false;
    }
    return true;
  };

  // update data submit
  const updateUserData = async () => {
    if (validateData()) {
      await uploadImage(avatar, "avatar").then(async (values) => {
        setLoading(true);
        const avatarURL = values;
        const userData = {
          id: user.id,
          fullName,
          avatar: avatarURL ? avatarURL : avatar,
          gender,
          dob,
          hasUpdated: true,
        };
        try {
          if (userData) {
            const response = await axios.put(
              `${BASE_URL}user/update-user`,
              userData
            );
            if (response.data.data) {
              setLoading(false);
              dispatch<any>(UpdateCurrentUser(response.data.data));
            }
          }
        } catch (error) {
          setLoading(false);
          console.log("error :", error);
        }
      });
    }
  };

  return (
    <View
      style={{
        justifyContent: "space-between",
        // flexDirection: "column",
        paddingBottom: 25,
        flex: 1,
      }}
    >
      {loading == true ? <AppLoading /> : <></>}

      {/* Update view */}

      <View>
        <View>
          <DissmissKeyboard>
            <View style={{ paddingTop: 0 }}>
              {/* avatar */}
              <View
                style={{
                  height: 120,
                  borderBottomColor: Color.grey,
                  backgroundColor: "#f5f2f5",
                }}
              ></View>
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={{ position: "absolute", top: -70 }}
                  onPress={() => {
                    pickImage("avatar");
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={styles.avatar}
                      source={{
                        uri: avatar
                          ? avatar
                          : "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg",
                      }}
                    ></Image>
                    <Entypo
                      style={{ position: "absolute", top: 80, left: 65 }}
                      name="camera"
                      size={22}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {/* Information */}
              <View style={{ paddingTop: 30 }}>
                <TouchableOpacity
                  style={styles.content}
                  onPress={() => {
                    nameRef.current.focus();
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 60,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 1000,
                        height: 60,
                      }}
                    >
                      <View>
                        <FontAwesome5
                          name="user-alt"
                          size={30}
                          color="#6095e5"
                        />
                      </View>
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.title,
                          { paddingBottom: 10, color: "#999AA0" },
                        ]}
                      >
                        Full Name
                      </Text>
                      <TextInput
                        style={[styles.title, styles.textInput]}
                        value={fullName}
                        onChangeText={setName}
                        ref={nameRef}
                      />
                    </View>
                  </View>
                  <FontAwesome name="pencil" size={20} color="#DCDCDC" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.content}
                  onPress={() => {
                    emailRef.current.focus();
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 60,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 1000,
                        height: 60,
                      }}
                    >
                      <Entypo name="email" size={40} color="#6095e5" />
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.title,
                          { paddingBottom: 10, color: "#999AA0" },
                        ]}
                      >
                        Email
                      </Text>
                      <TextInput
                        style={[styles.title, styles.textInput]}
                        value={email}
                        onChangeText={setEmail}
                        ref={emailRef}
                      />
                    </View>
                  </View>
                  <FontAwesome name="pencil" size={20} color="#DCDCDC" />
                </TouchableOpacity>
                {/* gender */}
                <View style={styles.content}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      style={{
                        // width: 35,
                        flexDirection: "row",
                        paddingVertical: 10,
                        alignItems: "center",
                        height: "100%",
                        width: WINDOW_WIDTH / 2.5,
                      }}
                      onPress={() => {
                        showStatusActionSheet("gender");
                      }}
                    >
                      <View
                        style={{
                          width: 60,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 1000,
                          height: 60,
                        }}
                      >
                        <FontAwesome5
                          name="transgender"
                          size={40}
                          color="#6095e5"
                          style={{ marginRight: 8 }}
                        />
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.title,
                            { paddingBottom: 10, color: "#999AA0" },
                          ]}
                        >
                          Gender
                        </Text>
                        <Text style={[styles.title, styles.textInput]}>
                          {gender ? "Male" : "Female"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* dob */}
                <View style={styles.content}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 60,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 1000,
                        height: 60,
                      }}
                    >
                      <FontAwesome
                        name="birthday-cake"
                        size={40}
                        color="#6095e5"
                      />
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.title,
                          { paddingBottom: 10, color: "#999AA0" },
                        ]}
                      >
                        Date of birth
                      </Text>
                      <Text style={[styles.title, styles.textInput]}>
                        <DateTimePicker
                          testID="dateTimePicker"
                          timeZoneOffsetInMinutes={0}
                          value={dob}
                          mode={"date"}
                          is24Hour={true}
                          display="default"
                          onChange={(e: any, val: any) => {
                            setDob(val);
                          }}
                          style={{ width: 110 }}
                        />
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </DissmissKeyboard>
        </View>
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <Text style={[styles.textTitle, { textAlign: "center" }]}>
            This information will be displayed on your profile and you can edit
            it again
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{ alignItems: "center", paddingTop: 30 }}
        onPress={updateUserData}
      >
        <Text style={styles.button}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const DissmissKeyboard = ({ children }: any) => (
  <TouchableWithoutFeedback
    onPress={() => {
      Keyboard.dismiss();
    }}
  >
    {children}
  </TouchableWithoutFeedback>
);

export default EditProfileFirstLogin;

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    padding: 10,
    height: 80,
    backgroundColor: "white",
    borderWidth: 0.3,
    borderColor: "transparent",
    borderBottomColor: "#DDDDDD",
  },
  headerText: {
    color: Color.black,
    fontSize: 17,
    fontWeight: "500",
    justifyContent: "center",
    marginTop: 40,
    textAlign: "center",
    marginLeft: 95,
  },
  content: {
    height: 55,
    borderColor: "transparent",
    borderWidth: 1,
    borderBottomColor: "#ECEDEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginTop: 30,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 100,
    resizeMode: "cover",
  },
  headerImage: {
    height: 35,
    width: 35,
    resizeMode: "cover",
  },
  title: {
    marginLeft: 10,
    fontWeight: "500",
  },
  button: {
    fontSize: 18,
    color: "white",
    width: 345,
    height: 50,
    marginTop: 15,
    borderRadius: 3,
    backgroundColor: "#0094FF",
    padding: 10,
    textAlign: "center",
    justifyContent: "center",
  },
  textInput: {
    fontSize: 16,
  },
  textTitle: {},
});
