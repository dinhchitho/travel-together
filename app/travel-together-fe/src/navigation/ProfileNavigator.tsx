import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import BottomModal from "../components/custom/BottomModal";
import EditProfileScreen from "../containers/ProfileScreen/EditProfileScreen";
import FollowScreen from "../containers/ProfileScreen/FollowScreen";
import ProfileScreen from "../containers/ProfileScreen/MyProfileScreen";
import SearchCountryScreen from "../containers/ProfileScreen/SearchCountryScreen";
import IdCardInfoScreen from "../containers/ProfileScreen/Setting/IdCardInfoScreen";
import SettingScreen from "../containers/ProfileScreen/Setting/SettingScreen";
import VerifyAccount from "../containers/ProfileScreen/Setting/VerifyAccount";
import {
  RESET_PASSWORD,
  EDIT_PROFILE,
  FOLLOW_SCREEN,
  ID_CARD_INFO_SCREEN,
  PERSONAL_NAVIGATION,
  SEARCH_COUNTRY,
  SETTING_SCREEN,
  VERIFY_ACCOUNT_SCREEN,
} from "../utilites/routerName";

interface IProps {}

const ProfileNavigator = (props: IProps) => {
  const ProfileStack = createNativeStackNavigator();

  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen
        name={PERSONAL_NAVIGATION}
        component={ProfileScreen}
      />
      <ProfileStack.Screen name={EDIT_PROFILE} component={EditProfileScreen} />
      <ProfileStack.Screen name={SETTING_SCREEN} component={SettingScreen} />

      <ProfileStack.Screen
        name={SEARCH_COUNTRY}
        component={SearchCountryScreen}
      />
      <ProfileStack.Screen name={FOLLOW_SCREEN} component={FollowScreen} />
    </ProfileStack.Navigator>
  );
};

export default ProfileNavigator;

const styles = StyleSheet.create({
  container: {},
});
