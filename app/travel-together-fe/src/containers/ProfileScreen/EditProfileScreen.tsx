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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderCommon, {
  headerStyles,
} from "../../components/HeaderCommon/HeaderCommon";

import DateTimePicker from "@react-native-community/datetimepicker";

import {
  Entypo,
  FontAwesome5,
  FontAwesome,
  MaterialIcons,
  Fontisto,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import {
  PERSONAL_NAVIGATION,
  PROFILE_BOTTOM_NAVIGATION,
  SEARCH_COUNTRY,
} from "../../utilites/routerName";

import * as ImagePicker from "expo-image-picker";
import { WINDOW_HEGIHT, WINDOW_WIDTH } from "../../utilites/Dimensions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { COUNTRIES } from "../../api/Const";

import firebase from "../../../config";
import BottomModal, {
  BottomSheetRefProps,
} from "../../components/custom/BottomModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Color from "../../utilites/Color";
import InterestsUpdate from "../../components/Profile/InterestsUpdate";
import BioUpdate from "../../components/Profile/BioUpdate";
import axios from "axios";
import { BASE_URL } from "../../utilites";
import { useSelector } from "react-redux";
import { ApplicationState, UpdateCurrentUser } from "../../redux";
import { globalStyles } from "../../globalStyles";
import Loading from "../../components/custom/Loading";
import { useDispatch } from "react-redux";

interface IProps {
  route?: any;
}

const EditProfileScreen = (props: IProps) => {
  const navigation = useNavigation<any>();

  const params = props.route.params;

  const { user, error, userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const dispatch = useDispatch();

  const [fullName, setFullName] = useState<string>(userCurrent?.fullName);
  const [avatar, setAvatar] = useState<any>(userCurrent?.avatar);
  const [coverPhoto, setCoverPhoto] = useState<any>(userCurrent?.coverPhoto);
  const [gender, setGender] = useState<boolean>(userCurrent?.gender);
  const [married, setMarried] = useState<boolean>(userCurrent?.married);
  const [height, setHeight] = useState<string>(userCurrent?.height);
  const [weight, setWeight] = useState<string>(userCurrent?.weight);
  const [dob, setDob] = useState<Date>(
    userCurrent.dob ? new Date(userCurrent.dob) : new Date()
  );
  const [country, setCountry] = useState<string>(userCurrent?.country);
  const [interests, setInterests] = useState<any[]>(userCurrent?.interests);
  const [bio, setBio] = useState<string>(userCurrent?.bio);

  const [loading, setLoading] = useState<boolean>(false);

  const nameRef = useRef<any>();
  const heightRef = useRef<any>();
  const weightRef = useRef<any>();

  const interestRef = useRef<BottomSheetRefProps>(null);
  const bioRef = useRef<BottomSheetRefProps>(null);
  const MAX_HEIGHT = -WINDOW_HEGIHT / 1.5;

  const openBottomModal = (type: string) => {
    type === "interest"
      ? interestRef?.current?.scrollTo(MAX_HEIGHT)
      : bioRef?.current?.scrollTo(MAX_HEIGHT);
  };
  const closeBottomModal = (type: string) => {
    type === "interest"
      ? interestRef?.current?.scrollTo(200)
      : bioRef?.current?.scrollTo(200);
  };

  const showStatusActionSheet = (type: string) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options:
          type === "gender"
            ? ["Cancel", "Male", "Female"]
            : ["Cancel", "Single", "Married"],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex !== 0) {
          type === "gender"
            ? setGender(buttonIndex === 1 ? true : false)
            : setMarried(buttonIndex === 2 ? true : false);
        }
      }
    );
  };

  const findCountryFlag = (countryName: string) => {
    const country = COUNTRIES.find((item) => item.name.common === countryName);
    if (country) {
      return country.flags.png;
    } else {
      return "";
    }
  };

  const handleUpdata = (photo: any, typeImage: string) => {
    const data = new FormData();
    data.append("file", photo);
    data.append("upload_preset", "travel_together");
    data.append("cloud_name", "df66mvytc");
    fetch("https://api.cloudinary.com/v1_1/df66mvytc/image/upload", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
        "Content-type": "multipart/form-data",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        typeImage === "avatar" ? setAvatar(data.url) : setCoverPhoto(data.url);
      })
      .catch((err) => {
        setLoading(false);
        Alert.alert(
          "Fail to upload image",
          //body
          `${err}`,
          [
            {
              text: "OK",
              onPress: () => console.log("OK"),
            },
          ],
          { cancelable: true }
        );
      });
  };

  const pickImage = async (typeImage: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      typeImage === "avatar"
        ? setAvatar(result.uri)
        : setCoverPhoto(result.uri);
      const { uri, type } = result;
      const name = "image";
      const source = { uri, type, name };
      handleUpdata(source, typeImage);
    }
  };

  // const imageIsExist = (imageUrl: string, type: string) => {
  //   switch (type) {
  //     case "avatar":
  //       if (imageUrl === params.avatar) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     case "coverPhoto":
  //       if (imageUrl === params.coverPhoto) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     default:
  //       return false;
  //   }
  // };

  // const uploadImage = async (imageUrl: string, type: string) => {
  //   setLoading(true);
  //   let firebaseUrl = "";
  //   if (imageUrl && !imageIsExist(imageUrl, type)) {
  //     const response = await fetch(imageUrl);
  //     const blob = await response.blob();
  //     const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
  //     var snapshot = firebase.storage().ref().child(fileName).put(blob);
  //     try {
  //       await snapshot;
  //       let uploadPromise = new Promise((resolve, reject) => {
  //         snapshot.on(
  //           firebase.storage.TaskEvent.STATE_CHANGED,
  //           () => {},
  //           (error) => {
  //             console.log("error :", error);
  //             reject(error);
  //           },
  //           () => {
  //             snapshot.snapshot.ref.getDownloadURL().then((url: string) => {
  //               resolve(url);
  //             });
  //           }
  //         );
  //       });
  //       await uploadPromise.then((val: any) => {
  //         firebaseUrl = val;
  //       });
  //     } catch (error) {
  //       console.log("error :", error);
  //     }
  //     return firebaseUrl;
  //   } else {
  //     return firebaseUrl;
  //   }
  // };

  const updateUserData = async () => {
    setLoading(true);
    const userData = {
      id: user.id,
      fullName,
      avatar,
      coverPhoto,
      gender,
      married,
      height,
      weight,
      dob,
      country,
      interests,
      bio,
      hasUpdated: true,
    };
    try {
      if (userData) {
        const response = await axios.put(
          `${BASE_URL}user/update-user`,
          userData
        );
        if (response.data.data) {
          navigation.navigate(PERSONAL_NAVIGATION, "updated");
          dispatch<any>(UpdateCurrentUser(response.data.data));
        }
      }
    } catch (error) {
      setLoading(false);
      console.log("error :", error);
    }
  };

  useEffect(() => {
    if (params?.keyword) {
      setCountry(params.keyword);
    }
  }, [params]);

  return (
    <>
      {loading === true ? (
        <Loading />
      ) : (
        <GestureHandlerRootView style={styles.container}>
          {/* {enable && (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "absolute",
            }}
          ></View>
        )} */}

          <SafeAreaView>
            <View style={[headerStyles.header, globalStyles.px15]}>
              <TouchableOpacity
                style={{ width: 50, alignItems: "flex-start" }}
                onPress={() => {
                  navigation.navigate(PERSONAL_NAVIGATION, "updated");
                }}
              >
                <Feather name="arrow-left" size={24} color="black" />
              </TouchableOpacity>
              <Text style={headerStyles.headerText}>Edit profile</Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => updateUserData()}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: Color.primary,
                    fontSize: 17,
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView
              extraScrollHeight={0}
              enableAutomaticScroll={true}
              style={styles.container}
            >
              <DissmissKeyboard>
                <View style={{ paddingHorizontal: 4 }}>
                  {/* avatar */}
                  <TouchableOpacity
                    style={styles.content}
                    onPress={() => {
                      pickImage("avatar");
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        style={styles.avatar}
                        source={{
                          uri: avatar
                            ? avatar
                            : "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg",
                        }}
                      ></Image>
                      <Text style={styles.title}>Profile Image</Text>
                    </View>
                    <Entypo name="camera" size={22} color={Color.icon_grey} />
                  </TouchableOpacity>
                  {/* cover photo */}
                  <TouchableOpacity
                    style={styles.content}
                    onPress={() => {
                      pickImage("coverPhoto");
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {coverPhoto ? (
                        <Image
                          style={styles.headerImage}
                          source={{
                            uri: coverPhoto,
                          }}
                        ></Image>
                      ) : (
                        <Image
                          style={styles.headerImage}
                          source={require("../../../assets/coverPhoto.jpg")}
                        />
                      )}

                      <Text style={styles.title}>Header Image</Text>
                    </View>
                    <Entypo name="camera" size={22} color={Color.icon_grey} />
                  </TouchableOpacity>
                  {/* name */}
                  <TouchableOpacity
                    style={styles.content}
                    onPress={() => {
                      nameRef.current.focus();
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          width: 35,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FontAwesome5
                          name="user-alt"
                          size={24}
                          color={Color.blue}
                        />
                      </View>
                      <TextInput
                        style={styles.title}
                        value={fullName}
                        onChangeText={setFullName}
                        ref={nameRef}
                      />
                    </View>
                    <FontAwesome
                      name="pencil"
                      size={20}
                      color={Color.icon_grey}
                    />
                  </TouchableOpacity>
                  {/* gender */}
                  <View style={styles.content}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        style={{
                          // width: 35,
                          flexDirection: "row",
                          // justifyContent: "center",
                          paddingVertical: 10,
                          paddingHorizontal: 10,
                          alignItems: "center",
                          height: "100%",
                          width: WINDOW_WIDTH / 2.5,
                        }}
                        onPress={() => {
                          showStatusActionSheet("gender");
                        }}
                      >
                        <FontAwesome5
                          name="transgender"
                          size={24}
                          color={Color.blue}
                          style={{ marginRight: 8 }}
                        />
                        <Text style={[styles.title]}>
                          {gender ? "Male" : "Female"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* married */}
                  <View style={styles.content}>
                    <TouchableOpacity
                      onPress={() => {
                        showStatusActionSheet("married");
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: "100%",
                        width: WINDOW_WIDTH / 2.5,
                      }}
                    >
                      <View
                        style={{
                          width: 35,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Entypo name="heart" size={24} color={Color.blue} />
                      </View>
                      <Text style={styles.title}>
                        {married ? "Married" : "Single"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* height */}
                  <TouchableOpacity
                    style={styles.content}
                    onPress={() => {
                      heightRef.current.focus();
                    }}
                    accessible={false}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          width: 35,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialIcons
                          name="height"
                          size={24}
                          color={Color.blue}
                        />
                      </View>
                      <TextInput
                        style={styles.title}
                        value={height}
                        // onChangeText={(val) => setHeight(val)}
                        onChangeText={setHeight}
                        ref={heightRef}
                        keyboardType="numeric"
                      />

                      <Text>cm</Text>
                    </View>
                  </TouchableOpacity>
                  {/* weight */}
                  <TouchableOpacity
                    style={styles.content}
                    onPress={() => {
                      weightRef.current.focus();
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          width: 35,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="weight"
                          size={24}
                          color={Color.blue}
                        />
                      </View>
                      <TextInput
                        style={styles.title}
                        value={weight}
                        // onChangeText={(val) => setHeight(val)}
                        onChangeText={setWeight}
                        ref={weightRef}
                        keyboardType="numeric"
                      />
                      <Text>kg</Text>
                    </View>
                  </TouchableOpacity>
                  {/* dob */}
                  <View style={styles.content}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          width: 35,
                          // justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <FontAwesome
                          name="birthday-cake"
                          size={24}
                          color={Color.blue}
                        />
                      </View>
                      <Text style={styles.title}>
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
                          style={{ width: 100 }}
                        />
                      </Text>
                    </View>
                  </View>
                  {/* country */}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.navigate(SEARCH_COUNTRY);
                    }}
                  >
                    <View style={styles.content}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          style={styles.avatar}
                          source={
                            findCountryFlag(country)
                              ? {
                                  uri: findCountryFlag(country),
                                }
                              : require("../../../assets/images/earth.png")
                          }
                        ></Image>
                        <Text style={styles.title}>{country || ""}</Text>
                      </View>
                      <Entypo
                        name="chevron-right"
                        size={24}
                        color={Color.icon_grey}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  {/* Interests */}
                  <TouchableOpacity
                    style={styles.content}
                    onPress={() => {
                      openBottomModal("interest");
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          width: 35,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Fontisto
                          name="checkbox-active"
                          size={24}
                          color={Color.blue}
                        />
                      </View>
                      <Text style={styles.title}>{`${
                        interests ? interests.length : 0
                      } interest`}</Text>
                    </View>
                    <Entypo
                      name="chevron-right"
                      size={24}
                      color={Color.icon_grey}
                    />
                  </TouchableOpacity>
                  {/* bio  */}
                  <TouchableOpacity
                    style={styles.content}
                    onPress={() => {
                      openBottomModal("bio");
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          width: 35,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="notebook"
                          size={28}
                          color={Color.blue}
                        />
                      </View>
                      <Text style={styles.title}>{bio}</Text>
                    </View>
                    <FontAwesome
                      name="pencil"
                      size={20}
                      color={Color.icon_grey}
                    />
                  </TouchableOpacity>
                  {/* end */}
                  {/* <TouchableOpacity
                    onPress={() => {
                      updateUserData();
                    }}
                  >
                    <Text>upload</Text>
                  </TouchableOpacity> */}
                </View>
              </DissmissKeyboard>
              <BottomModal
                ref={interestRef}
                maxHeight={MAX_HEIGHT}
                onClose={() => {}}
              >
                <InterestsUpdate
                  handleCloseBotttomModal={() => {
                    closeBottomModal("interest");
                  }}
                  interests={interests ? interests : []}
                  setInterests={(val: any) => {
                    setInterests(val);
                  }}
                />
              </BottomModal>
              <BottomModal
                ref={bioRef}
                maxHeight={MAX_HEIGHT}
                onClose={() => {}}
              >
                <BioUpdate
                  handleCloseBotttomModal={() => {
                    closeBottomModal("bio");
                  }}
                  bio={bio}
                  setBio={(val: any) => {
                    setBio(val);
                  }}
                />
              </BottomModal>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </GestureHandlerRootView>
      )}
    </>
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

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {},
  content: {
    height: 55,
    borderColor: "transparent",
    borderWidth: 1,
    borderBottomColor: "#ECEDEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  avatar: {
    height: 35,
    width: 35,
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
  saveButton: {
    width: 50,
    alignItems: "center",
    borderColor: Color.primary,
    borderRadius: 6,
  },
});
