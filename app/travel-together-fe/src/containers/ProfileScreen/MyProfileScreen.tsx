import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  ActionSheetIOS,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesome, Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import Color from "../../utilites/Color";
import { globalStyles } from "../../globalStyles";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  COMMENT_DETAIL,
  DETAIL_POST,
  EDIT_PROFILE,
  FOLLOW_SCREEN,
  SETTING_SCREEN,
} from "../../utilites/routerName";
import axios from "axios";
import { BASE_URL } from "../../utilites";
import { User } from "../../models/User";
import { ETripType } from "../../api/Enum/ETripType";
import Loading from "../../components/custom/Loading";
import { COUNTRIES, femaleDefaultImage, maleDefaultImage } from "../../api/Const";
import { WINDOW_WIDTH } from "../../utilites/Dimensions";

import Constants from "expo-constants";
import styles from "../SignInScreen/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState, ToggleTravelRequestCurrentUser } from "../../redux";
import BlogScreen from "../BlogScreen/BlogScreen";
import BlogList from "../BlogList/BlogList";
import { navigationRef } from "../../navigation/RootNavigator";
import LoadingProfile from "../../components/AppLoader/LoadingProfile";

interface IProps {
  route: any;
}

const ProfileScreen = (props: IProps) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { error, userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );
  console.log("userCurrent :", userCurrent);

  const [userStatistic, setUserStatistic] = useState<any>({});
  const [userInfo, setUserInfo] = useState<any>({});
  const [travelRequest, setTravelRequest] = useState<any>({});

  const [onAboutTab, setOnAboutTab] = useState<boolean>(true);

  const [loadedImage, setLoadedImage] = useState<boolean>(false);

  const followingRef = useRef<[]>();
  const followedRef = useRef<[]>();

  const setCurrentUserInfo = async () => {
    if (userCurrent) {
      const {
        followingUsers,
        followedUsers,
        married,
        weight,
        height,
        travelRequest,
      } = userCurrent;
      followingRef.current = followingUsers;
      followedRef.current = followedUsers;
      setUserStatistic({
        Follower: followedUsers?.length || 0,
        Following: followingUsers?.length || 0,
      });
      setUserInfo({
        married: married ? "Married" : "Single",
        weight: weight ? `${weight}kg` : null,
        height: height ? `${height}cm` : null,
      });
      if (travelRequest) {
        const { destination, tripType, departureDate, endDate } = travelRequest;
        setTravelRequest({
          destination,
          tripType: ETripType[tripType],
          departureDate: new Date(departureDate).toLocaleDateString("en-US"),
          endDate: new Date(endDate).toLocaleDateString("en-US"),
        });
      }
    }
  };

  const calculateAge = (birthday: Date) => {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const findFlat = (countryName: string) => {
    return COUNTRIES.filter((item) =>
      item.name.common.toLowerCase().includes(countryName.toLowerCase())
    )[0].flags.png;
  };

  const toggleActiveTravelRequest = async () => {
    try {
      console.log("zooo");

      const response = await axios.post(
        `${BASE_URL}user/travel-request/deactive`
      );
      console.log("deactivce", response.data);
      if (response.data) {
        dispatch<any>(ToggleTravelRequestCurrentUser(response.data.data));
      }
    } catch (error) {
      console.log("error :", error);
    }
  };

  const showStatusActionSheet = () => {
    let options = ["Cancel", "Preview"];
    if (userCurrent.travelRequest) {
      options.push(userCurrent.travelRequest.active ? "Deactive" : "Active");
    }
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: options,
        cancelButtonIndex: 0,
        destructiveButtonIndex: 2,
      },
      (buttonIndex: any) => {
        if (buttonIndex !== 0) {
          switch (buttonIndex) {
            case 1:
              navigation.navigate(DETAIL_POST, userCurrent.id);
              break;
            case 2:
              toggleActiveTravelRequest();
              break;
            default:
              break;
          }
        }
      }
    );
  };

  const navigateToSettingScreen = async () => {
    navigation.navigate(SETTING_SCREEN, userCurrent);
  };

  const navigateToEditScreen = () => {
    navigation.navigate(EDIT_PROFILE, userCurrent);
  };

  const navigateToFollowScreen = (from: any) => {
    navigation.navigate(FOLLOW_SCREEN, {
      followingUsers: followingRef.current,
      followedUsers: followedRef.current,
      fullName: userCurrent.fullName,
      from,
    });
  };

  useEffect(() => {
    setCurrentUserInfo();
  }, [isFocused]);

  // loading previous image
  const onLoading = (value: boolean) => {
    setLoadedImage(value)
  }

  return (
    <View style={myProfileStyles.container}>

      <View>
        <View style={myProfileStyles.settingWrapper}>
          <TouchableOpacity
            onPress={() => {
              navigateToSettingScreen();
            }}
          >
            <Ionicons name="settings-sharp" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <ScrollView style={myProfileStyles.container}>
          <View>
            {userCurrent.coverPhoto ? (
              <Image
                source={{
                  uri: userCurrent.coverPhoto,
                }}
                style={myProfileStyles.coverImage}
              ></Image>
            ) : (
              <Image
                style={myProfileStyles.coverImage}
                source={require("../../../assets/coverPhoto.jpg")}
              />
            )}
          </View>

          <View
            style={{
              paddingHorizontal: 18,
            }}
          >
            <View style={myProfileStyles.content}>
              <View style={myProfileStyles.avatarWrapper}>
                {/* {loadedImage && <LoadingProfile />} */}
                {
                  userCurrent.gender ? <Image
                    source={{
                      uri: userCurrent.avatar ? userCurrent.avatar : maleDefaultImage
                    }}
                    onLoadStart={() => onLoading(true)} onLoadEnd={() => onLoading(false)}
                    style={myProfileStyles.avatarImage}
                  ></Image>
                    :
                    <Image
                      source={{
                        uri: userCurrent.avatar ? userCurrent.avatar : femaleDefaultImage
                      }}
                      onLoadStart={() => onLoading(true)} onLoadEnd={() => onLoading(false)}
                      style={myProfileStyles.avatarImage}
                    ></Image>
                }
              </View>
              <TouchableOpacity
                style={myProfileStyles.editProfileBtn}
                onPress={navigateToEditScreen}
              >
                <FontAwesome
                  name="pencil"
                  size={20}
                  color={Color.primary}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontWeight: "bold" }}>Edit profile</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingVertical: 5 }}>
              <Text
                style={{ fontWeight: "500", fontSize: 20, paddingBottom: 5 }}
              >
                {userCurrent.fullName}
                {userCurrent.localGuide && (
                  <View style={{ paddingLeft: 5, paddingBottom: 1 }}>
                    <AntDesign
                      name="checkcircle"
                      size={15}
                      color={Color.primary}
                    />
                  </View>
                )}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={
                    userCurrent.country
                      ? { uri: findFlat(userCurrent.country) }
                      : require("../../../assets/images/earth.png")
                  }
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 100,
                    marginRight: 3,
                  }}
                ></Image>
                <Text style={{ fontSize: 13 }}>
                  {userCurrent.gender ? "Male" : "Female"},{" "}
                  {userCurrent.dob && calculateAge(new Date(userCurrent.dob))}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: 65,
              backgroundColor: "#ECEDEE",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {Object.keys(userStatistic).map((item): any => (
              <TouchableWithoutFeedback
                style={globalStyles.w100}
                key={item}
                onPress={() => {
                  navigateToFollowScreen(item);
                }}
              >
                <View>
                  <Text style={globalStyles.textCenter}>{item}</Text>
                  <Text style={[globalStyles.textCenter, globalStyles.fw500]}>
                    {userStatistic[item]}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>

          <View style={myProfileStyles.tabContainer}>
            <View style={myProfileStyles.tabWrapper}>
              <TouchableOpacity
                style={[
                  myProfileStyles.tab,
                  onAboutTab ? globalStyles.bgWhite : null,
                ]}
                onPress={() => {
                  setOnAboutTab(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "500",
                  }}
                >
                  About
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  myProfileStyles.tab,
                  !onAboutTab ? globalStyles.bgWhite : null,
                ]}
                onPress={() => {
                  setOnAboutTab(false);
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "500" }}>Blog</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* about tab */}
          {onAboutTab ? (
            <View style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
              <View>
                <Text style={{ fontWeight: "500", fontSize: 15 }}>
                  About myself
                </Text>
                <View style={myProfileStyles.tagWrapper}>
                  {Object.keys(userInfo).map(
                    (item): any =>
                      userInfo[item] && (
                        <View key={item} style={myProfileStyles.tag}>
                          <Text style={{ fontSize: 13, fontWeight: "500" }}>
                            {userInfo[item]}
                          </Text>
                        </View>
                      )
                  )}
                </View>
              </View>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontWeight: "500", fontSize: 15 }}>
                    About my trip
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      showStatusActionSheet();
                    }}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    {userCurrent.travelRequest && (
                      <>
                        <Entypo name="dot-single" size={16} color="black" />
                        <Text style={{ color: Color.primary }}>
                          Tap to edit
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={myProfileStyles.tagWrapper}>
                  {Object.keys(travelRequest)?.map(
                    (item): any =>
                      travelRequest[item] && (
                        <View key={item} style={myProfileStyles.tag}>
                          <Text style={{ fontSize: 13, fontWeight: "500" }}>
                            {travelRequest[item]}
                          </Text>
                        </View>
                      )
                  )}
                </View>
              </View>
              <View>
                <Text style={{ fontWeight: "500", fontSize: 15 }}>Bio</Text>
                <View style={myProfileStyles.tagWrapper}>
                  <Text style={{ fontSize: 13, fontWeight: "500" }}>
                    {userCurrent.bio}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={{ fontWeight: "500", fontSize: 15 }}>
                  Interests
                </Text>
                <View style={myProfileStyles.tagWrapper}>
                  {userCurrent?.interests?.map((e: any, i: any) => (
                    <View key={e.name} style={myProfileStyles.tag}>
                      <Text style={{ fontSize: 13, fontWeight: "500" }}>
                        {e.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <BlogListImage user={userCurrent}></BlogListImage>
          )}
        </ScrollView>
      </View>

    </View>
  );
};

export default ProfileScreen;

interface BlogListImageProps {
  user: {
    fullName: string;
    avatar: string;
    userIdCreated: string;
    type: string;
    isLocalGuide: boolean;
    blogs: [
      {
        id: string;
        images: string[];
      }
    ];
  };
}

export const BlogListImage = (props: BlogListImageProps) => {
  const { user } = props;

  const navigation = useNavigation<any>();

  const { fullName, avatar, userIdCreated, isLocalGuide } = user;

  return (
    <View style={myProfileStyles.grid}>
      {user.blogs &&
        user.blogs.map(
          (item: any) =>
            item && (
              <TouchableOpacity
                style={myProfileStyles.imageBlogItem}
                key={item.id}
                onPress={() => {
                  navigation.navigate(COMMENT_DETAIL, {
                    id: item.id,
                    fullName,
                    avatarUser: avatar,
                    userIdCreated,
                    type: "BLOG",
                    isLocalGuide,
                  });
                }}
              >
                <Image
                  source={{
                    uri: `${item.images[0]}`,
                  }}
                  style={myProfileStyles.imageFull}
                ></Image>
              </TouchableOpacity>
            )
        )}
    </View>
  );
};

export const myProfileStyles = StyleSheet.create({
  container: {
    height: "100%",
  },
  settingWrapper: {
    position: "absolute",
    top: Constants.statusBarHeight,
    width: WINDOW_WIDTH,
    height: 100,
    zIndex: 3,
    alignItems: "flex-end",
    paddingHorizontal: 15,
    backgroundColor: "transparent",
    // justifyContent: "flex-end",
  },
  coverImage: {
    width: "100%",
    height: 200,
  },
  content: {
    marginTop: -45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarWrapper: {
    borderColor: Color.white,
    borderWidth: 3,
    borderRadius: 100,
    backgroundColor: Color.grey,
  },
  avatarImage: {
    height: 90,
    width: 90,
    borderRadius: 100,
  },
  editProfileBtn: {
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.white,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderColor: "transparent",
    borderBottomColor: "#ECEDEE",
    borderWidth: 1,
  },
  tabWrapper: {
    height: 30,
    backgroundColor: "#ECEDEE",
    borderRadius: 6,
    padding: 2,
    flexDirection: "row",
  },
  tab: {
    height: "100%",
    borderRadius: 4,
    width: "50%",
    alignItems: "center",
    padding: 5,
  },
  tagWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 6,
    paddingBottom: 10,
    minHeight: 25,
  },
  tag: {
    flexDirection: "row",
    width: "auto",
    alignSelf: "flex-start",
    padding: 8,
    borderRadius: 15,
    backgroundColor: Color.tagColor,
    margin: 2,
    alignItems: "center",
  },
  imageBlogItem: {
    width: WINDOW_WIDTH / 3 - 1,
    height: WINDOW_WIDTH / 3 - 1,
    backgroundColor: Color.grey,
    marginRight: 1,
    marginTop: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    position: "relative",
  },
  imageFull: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
