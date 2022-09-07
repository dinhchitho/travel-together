import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { Dispatch, useEffect, useRef, useState } from "react";

import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  Entypo,
  SimpleLineIcons,
} from "@expo/vector-icons";

import Color from "../../utilites/Color";
import { globalStyles } from "../../globalStyles";

import { useIsFocused, useNavigation } from "@react-navigation/native";

import {
  CHAT_DETAIL_NAVIGATION,
  EDIT_PROFILE,
  FOLLOW_SCREEN,
  HOME_NAVIGATOR,
  REPORT_USERS,
  USER_FOLLOW_SCREEN,
} from "../../utilites/routerName";
import { BASE_URL } from "../../utilites";

import axios from "axios";

import { User } from "../../models/User";
import { ETripType } from "../../api/Enum/ETripType";

import Loading from "../../components/custom/Loading";

import { COUNTRIES } from "../../api/Const";

import Constants from "expo-constants";
import {
  ApplicationState,
  AddBlackListCurrentUser,
  UpdateCurrentUser,
  UserAction,
} from "../../redux";
import { useSelector } from "react-redux";
import { useChatContext } from "stream-chat-react-native-core";
import { log } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { BlogListImage, myProfileStyles } from "./MyProfileScreen";

interface IProps {
  route: any;
}

const statusBarHeight = Constants.statusBarHeight;

const UserProfileScreen = (props: IProps) => {
  const { route } = props;

  const navigation = useNavigation<any>();

  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  const [userStatistic, setUserStatistic] = useState<any>({});
  const [userInfo, setUserInfo] = useState<any>({});
  const [user, setUser] = useState<User>(new User());
  const [travelRequest, setTravelRequest] = useState<any>({});
  const [isFollowed, setIsFollowed] = useState<boolean>();

  const [onAboutTab, setOnAboutTab] = useState<boolean>(true);

  const followingRef = useRef<[]>();
  const followedRef = useRef<[]>();

  const { userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const [loading, setLoading] = useState<boolean>(false);

  const { client } = useChatContext();

  const chatWithUser = async () => {
    if (!route.params || !userCurrent.id) {
      return;
    }
    const channel = client.channel("messaging", {
      members: [route.params, userCurrent.id],
    });
    await channel.watch();
    navigation.navigate(CHAT_DETAIL_NAVIGATION, { channelId: channel.id });
  };

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}user/getUserById?userId=${route.params}`
      );
      if (response) {
        const {
          followingUsers,
          followedUsers,
          married,
          weight,
          height,
          travelRequest,
        } = response.data.data;
        setUser(response.data.data);
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
          const { destination, tripType, departureDate, endDate, active } =
            travelRequest;
          if (active) {
            setTravelRequest({
              destination,
              tripType: ETripType[tripType],
              departureDate: new Date(departureDate).toLocaleDateString(
                "en-US"
              ),
              endDate: new Date(endDate).toLocaleDateString("en-US"),
            });
          }
        }
        console.log("done");
        setLoading(false);
      }
    } catch (error) {
      console.log("error :", error);
      setLoading(false);
    }
  };

  const handleAddFollow = async () => {
    const response = await axios.post(
      `${BASE_URL}user/add-follow?userId=${route.params}`
    );
    if (response.data.data) {
      console.log("response.data.data :", response.data.data);
      setIsFollowed(true);
      setUserStatistic({
        ...userStatistic,
        Follower: userStatistic.Follower + 1,
      });
    }
    try {
    } catch (error) {
      console.log("error :", error);
    }
  };
  const handleUnfollow = async () => {
    const response = await axios.delete(
      `${BASE_URL}user/remove-follow?userId=${route.params}`
    );
    if (response.data.data) {
      setIsFollowed(false);
      setUserStatistic({
        ...userStatistic,
        Follower: userStatistic.Follower - 1,
      });
    }
    try {
    } catch (error) {
      console.log("error :", error);
    }
  };

  const getAllFollowing = async () => {
    const response = await axios.get(`${BASE_URL}user/getAll-following`);
    if (response.data.data) {
      return response.data.data;
    }
    try {
    } catch (error) {
      console.log("error :", error);
    }
  };

  const calculateAge = (birthday: Date) => {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const findFlat = (countryName: string) => {
    return COUNTRIES.filter((item) =>
      item.name.common.toLowerCase().includes(countryName.toLowerCase())
    )[0].flags.png;
  };

  const blockUser = async () => {
    try {
      const response = await axios.post(`${BASE_URL}user/add-blacklst`, null, {
        params: { userId: route.params },
      });
      if (response) {
        dispatch<any>(AddBlackListCurrentUser({ id: route.params }));
        navigation.navigate(HOME_NAVIGATOR);
      }
    } catch (error) {}
  };

  const showStatusActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Block", "Report"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex !== 0) {
          switch (buttonIndex) {
            case 1:
              Alert.alert(
                "Confirm block user",
                "Are you sure you want to block this user?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () =>
                      (async () => {
                        blockUser();
                      })(),
                  },
                ]
              );

              break;
            case 2:
              navigation.navigate(REPORT_USERS, {
                userId: route.params,
                type: "USER",
              });
              break;
            default:
              break;
          }
        }
      }
    );
  };

  const navigateToFollowScreen = (from: any) => {
    navigation.navigate(USER_FOLLOW_SCREEN, {
      followingUsers: followingRef.current,
      followedUsers: followedRef.current,
      fullName: user.fullName,
      from,
    });
  };

  useEffect(() => {
    (async () => {
      getUserInfo();
      let usersFollowing = await getAllFollowing();
      let userInFollowing = usersFollowing.find(
        (e: any) => e.id === route.params
      );
      if (userInFollowing) {
        setIsFollowed(true);
      } else {
        setIsFollowed(false);
      }
    })();
  }, [route.params]);

  return (
    <View style={myProfileStyles.container}>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView style={myProfileStyles.container}>
          <View
            style={{
              backgroundColor: "transparent",
              position: "absolute",
              zIndex: 1,
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              marginTop: statusBarHeight,
              paddingLeft: 15,
            }}
          >
            <TouchableOpacity
              style={{ width: 50 }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 50 }}
              onPress={() => {
                showStatusActionSheet();
              }}
            >
              <Entypo name="dots-three-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View>
            {user.coverPhoto ? (
              <Image
                source={{
                  uri: user.coverPhoto,
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
                <Image
                  source={{
                    uri: user.avatar
                      ? user.avatar
                      : "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg",
                  }}
                  style={myProfileStyles.avatarImage}
                ></Image>
              </View>
              <View style={{ flexDirection: "row" }}>
                {isFollowed === true && (
                  <TouchableOpacity
                    style={[myProfileStyles.editProfileBtn]}
                    onPress={() => {
                      handleUnfollow();
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: Color.black,
                        marginLeft: 2,
                      }}
                    >
                      Following
                    </Text>
                  </TouchableOpacity>
                )}
                {isFollowed === false && (
                  <TouchableOpacity
                    style={[myProfileStyles.editProfileBtn, styles.bgBlue]}
                    onPress={() => {
                      handleAddFollow();
                    }}
                  >
                    <Entypo name="plus" size={24} color={Color.white} />
                    <Text style={{ fontWeight: "bold", color: Color.white }}>
                      Follow
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={myProfileStyles.editProfileBtn}
                  onPress={() => chatWithUser()}
                >
                  <Feather
                    name="message-circle"
                    size={20}
                    color={Color.primary}
                  />
                  <Text style={{ fontWeight: "bold", color: Color.primary }}>
                    Messsage
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ paddingVertical: 10 }}>
              <Text
                style={{ fontWeight: "500", fontSize: 20, paddingBottom: 5 }}
              >
                {user.fullName}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={
                    user.country
                      ? { uri: findFlat(user.country) }
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
                  {user.gender ? "Male" : "Female"},{" "}
                  {user.dob && calculateAge(new Date(user.dob))}
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
                <Text style={{ fontWeight: "500", fontSize: 15 }}>
                  About my trip
                </Text>
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
                    {user.bio || null}
                  </Text>
                </View>
              </View>

              <View>
                <Text style={{ fontWeight: "500", fontSize: 15 }}>
                  Interests
                </Text>
                <View style={myProfileStyles.tagWrapper}>
                  {user?.interests?.map((e: any, i: any) => (
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
            <BlogListImage user={user} />
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  // container: {
  //   height: "100%",
  // },
  // coverImage: {
  //   width: "100%",
  //   height: 150,
  // },
  // content: {
  //   marginTop: -48,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  // },
  // avatarWrapper: {
  //   borderColor: Color.white,
  //   borderWidth: 3,
  //   borderRadius: 100,
  // },
  // avatarImage: {
  //   width: 90,
  //   height: 90,
  //   borderRadius: 100,
  // },
  bgBlue: {
    backgroundColor: Color.primary,
  },
  // editProfileBtn: {
  //   height: 35,
  //   borderRadius: 100,
  //   paddingVertical: 6,
  //   paddingHorizontal: 15,
  //   marginLeft: 5,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: Color.white,
  //   shadowColor: "#171717",
  //   shadowOffset: { width: 0, height: 3 },
  //   shadowOpacity: 0.04,
  //   shadowRadius: 2,
  // },
  // tabContainer: {
  //   paddingVertical: 20,
  //   paddingHorizontal: 10,
  //   borderColor: "transparent",
  //   borderBottomColor: "#ECEDEE",
  //   borderWidth: 1,
  // },
  // tabWrapper: {
  //   height: 30,
  //   backgroundColor: "#ECEDEE",
  //   borderRadius: 6,
  //   padding: 2,
  //   flexDirection: "row",
  // },
  // tab: {
  //   height: "100%",
  //   borderRadius: 4,
  //   width: "50%",
  //   alignItems: "center",
  //   padding: 5,
  // },
  // tagWrapper: {
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   paddingTop: 6,
  //   paddingBottom: 10,
  //   minHeight: 25,
  // },
  // tag: {
  //   backgroundColor: "#ECEDEE",
  //   height: 25,
  //   paddingVertical: 5,
  //   paddingHorizontal: 10,
  //   borderRadius: 3,
  //   marginRight: 4,
  //   marginTop: 4,
  // },
});
