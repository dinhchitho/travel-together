import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../components/CustomDrawer/CustomDrawer";
import { EDIT_PROFILE, PERSONAL_NAVIGATION } from "../utilites/routerName";
import ProfileScreen from "../containers/ProfileScreen/MyProfileScreen";
import EditProfileScreen from "../containers/ProfileScreen/EditProfileScreen";

const DrawerNavigation = () => {
  // this create drawer
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name={PERSONAL_NAVIGATION} component={ProfileScreen} />
      <Drawer.Screen name={EDIT_PROFILE} component={EditProfileScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({});
