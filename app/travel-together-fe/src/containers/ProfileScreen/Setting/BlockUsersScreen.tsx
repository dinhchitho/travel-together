import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import HeaderCommon from "../../../components/HeaderCommon/HeaderCommon";
import { SETTING_SCREEN } from "../../../utilites/routerName";
import { followStyles } from "../FollowScreen";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { BASE_URL } from "../../../utilites";
import axios from "axios";
import { User } from "../../../models/User";
import Color from "../../../utilites/Color";
import AppLoading from "../../../components/AppLoader/AppLoading";
import { WINDOW_HEGIHT } from "../../../utilites/Dimensions";
import {
  AddBlackListCurrentUser,
  RemoveBlackListCurrentUser,
} from "../../../redux";
import { useDispatch } from "react-redux";

interface IProps {}

const BlockUsersScreen = (props: IProps) => {
  const [blockedUsers, setBlockedUsers] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}user/getAll-blacklst`);
      if (response) {
        setBlockedUsers(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("error :", error);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}user/remove-user-blacklst?userId=${userId}`
      );
      if (response) {
        let blockedUsersAfterRemove = blockedUsers.filter(
          (item: any) => item.id != userId
        );
        setBlockedUsers(blockedUsersAfterRemove);
        dispatch<any>(RemoveBlackListCurrentUser({ id: userId }));
      }
    } catch (error) {
      console.log("error :", error);
    }
  };

  const createTwoButtonAlert = (userId: string) =>
    Alert.alert("Unblock user", "Are you sure you want to unblock this user?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => handleUnblockUser(userId) },
    ]);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  return (
    <SafeAreaView>
      <View style={{}}>
        <HeaderCommon
          title="Block users"
          leftIcon={"arrow-left"}
          leftNavigation={SETTING_SCREEN}
        ></HeaderCommon>
        <ScrollView>
          <View style={{ padding: 10, minHeight: WINDOW_HEGIHT }}>
            {loading && <AppLoading />}
            {blockedUsers !== undefined &&
              blockedUsers.map((item: any, index: number) => (
                <BlockedUser
                  key={index}
                  userId={item.id}
                  avatar={item.avatar}
                  fullName={item.fullName}
                  onPress={() => {
                    createTwoButtonAlert(item.id);
                  }}
                />
              ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default BlockUsersScreen;

interface BlockedUserProps {
  userId: string;
  avatar: any;
  fullName: string;
  onPress: Function;
}

const BlockedUser = (props: BlockedUserProps) => {
  const { userId, avatar, fullName, onPress } = props;

  return (
    <View style={followStyles.itemWrapper}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: Color.grey,
            borderRadius: 100,
          }}
        >
          <Image
            source={{
              uri:
                avatar ||
                "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg",
            }}
            style={followStyles.avatarImage}
          ></Image>
        </View>
        <Text style={{ paddingHorizontal: 10, fontWeight: "500" }}>
          {fullName || "Anonymous"}
        </Text>
      </View>
      <View style={followStyles.itemBtnFollow}>
        <TouchableOpacity
          onPress={() => {
            onPress();
          }}
          style={{ paddingRight: 5 }}
        >
          <AntDesign name="minuscircleo" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
