import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import HeaderCommon from "../../../components/HeaderCommon/HeaderCommon";
import {
  BLOCK_USERS,
  CHANGE_PASSWORD,
  RESET_PASSWORD,
  PERSONAL_NAVIGATION,
  USER_PROFILE,
  VERIFY_ACCOUNT_SCREEN,
} from "../../../utilites/routerName";
import { followStyles } from "../FollowScreen";

import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  Foundation,
  AntDesign,
  FontAwesome5,
} from "@expo/vector-icons";
import Color from "../../../utilites/Color";

import { Logout } from "../../../redux/actions/loginAction";

import { Switch } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useChatContext } from "stream-chat-expo";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApplicationState } from "../../../redux";

interface IProps {
  route: any;
}

const SettingScreen = (props: IProps) => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const params = props.route.params;

  const { user, error, userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const dispatch = useDispatch();
  const { client } = useChatContext();

  const navigateToVerifyAccountScreen = () => {
    navigation.navigate(VERIFY_ACCOUNT_SCREEN, params);
  };

  const logoutAction = () => {
    dispatch<any>(Logout());
    client.disconnectUser();
  };

  const settings = [
    {
      id: 1,
      title: "Black list",
      buttonIcon: (
        <MaterialIcons name="keyboard-arrow-right" size={30} color="black" />
      ),
      icon: (
        <MaterialCommunityIcons
          name="playlist-remove"
          size={26}
          color="black"
        />
      ),
      onPress: () => {
        navigation.navigate(BLOCK_USERS);
      },
    },
    {
      id: 2,
      disable: userCurrent.isLoginExternal,
      title: "Change password",
      buttonIcon: (
        <MaterialIcons name="keyboard-arrow-right" size={30} color="black" />
      ),
      icon: <Foundation name="key" size={26} color="black" />,
      onPress: () => {
        navigation.navigate(CHANGE_PASSWORD);
      },
    },
    {
      id: 3,
      title: "Help",
      buttonIcon: (
        <MaterialIcons name="keyboard-arrow-right" size={30} color="black" />
      ),
      icon: <AntDesign name="questioncircleo" size={26} color="black" />,
      onPress: () => {},
    },
    {
      id: 4,
      title: "Become local guide",
      disable: userCurrent.localGuide,
      buttonIcon: (
        <MaterialIcons name="keyboard-arrow-right" size={30} color="black" />
      ),
      icon: <FontAwesome5 name="user-check" size={26} color="black" />,
      onPress: () => {
        navigateToVerifyAccountScreen();
      },
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View>
          <HeaderCommon
            title="Setting"
            leftIcon={"arrow-left"}
            leftNavigation={PERSONAL_NAVIGATION}
          ></HeaderCommon>
          <View style={{}}>
            {settings &&
              settings.map(
                (item: any) =>
                  !item.disable && (
                    <SettingItem item={item} key={item.id}></SettingItem>
                  )
              )}
          </View>
        </View>
        <TouchableOpacity
          onPress={logoutAction}
          style={{
            backgroundColor: "#E4E5EA",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "500" }}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;

interface settingItemProps {
  item: {
    id: number;
    title: string;
    icon: React.ReactNode;
    buttonIcon: React.ReactNode;
    onPress: Function;
  };
}

const SettingItem = (props: settingItemProps) => {
  const { id, title, icon, buttonIcon, onPress } = props.item;

  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => {
        onPress();
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 40 }}>{icon}</View>
          <Text style={{ paddingHorizontal: 10, fontWeight: "500" }}>
            {title}
          </Text>
        </View>
        {buttonIcon}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
  },
  settingItem: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 10,
    borderColor: "transparent",
    borderWidth: 0.5,
    borderBottomColor: "#DDDDDD",
  },
});
