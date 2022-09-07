import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  CHAT_DETAIL_NAVIGATION,
  CHAT_THREAD_NAVIGATION,
  EDIT_INFORMATION_PROFILE,
  NEW_POST,
  SEARCH_POST,
  USER_PROFILE,
  TAB_BOTTOM,
  DETAIL_POST,
  COMMENT_DETAIL,
  POST_BLOG,
  ID_CARD_INFO_SCREEN,
  VERIFY_ACCOUNT_SCREEN,
  BLOCK_USERS,
  CHANGE_PASSWORD,
  EDIT_BLOG,
  REPORT_USERS,
  USER_FOLLOW_SCREEN,
} from "../utilites/routerName";
import { StreamChat } from "stream-chat";
import { Chat, useChatContext } from "stream-chat-expo";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import NewPostScreen from "../containers/PostScreen/NewPostScreen";
import SearchPostScreen from "../containers/PostScreen/SearchPostScreen";
import DetailChatScreen from "../containers/DetailChatScreen/DetailChatScreen";
import ThreadScreen from "../containers/DetailChatScreen/Thread";
import AlertComponent from "../components/Alert/AlertComponent";
import UserProfileScreen from "../containers/ProfileScreen/UserProfileScreen";
import EditProfileFirstLogin from "../containers/ProfileScreen/EditProfileFirstLogin";
import ViewPostDetail from "../containers/PostScreen/ViewPostDetail";
import { useSelector } from "react-redux";
import { ApplicationState } from "../redux";
import { useNavigation } from "@react-navigation/native";
import CheckNavigator from "./CheckNavigator";
import CommentDetail from "../containers/BlogList/CommentDetail";
import PostBlog from "../containers/BlogList/PostBlog";
import VerifyAccount from "../containers/ProfileScreen/Setting/VerifyAccount";
import IdCardInfoScreen from "../containers/ProfileScreen/Setting/IdCardInfoScreen";
import BlockUsersScreen from "../containers/ProfileScreen/Setting/BlockUsersScreen";
import ChangePassword from "../containers/ProfileScreen/Setting/ChangePassword";
import EditBlog from "../containers/BlogList/EditBlog";
import ReportUserScreen from "../containers/ProfileScreen/ReportUserScreen";
import UserFollowScreen from "../containers/ProfileScreen/UserFollowScreen";
const SubNavigator = () => {
  const { user, userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  // create stack main
  const MainStack = createNativeStackNavigator();

  const Stack = createNativeStackNavigator();

  return (
    <>
      {userCurrent.hasUpdated == true ? (
        <>
          <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen name={TAB_BOTTOM} component={TabNavigator} />
            <MainStack.Screen
              name={NEW_POST}
              component={NewPostScreen}
              options={{ headerShown: false }}
            />
            <MainStack.Screen name={SEARCH_POST} component={SearchPostScreen} />
            <MainStack.Screen
              name={CHAT_DETAIL_NAVIGATION}
              component={DetailChatScreen}
              options={{
                headerShown: true,
              }}
            />
            <MainStack.Screen
              name={CHAT_THREAD_NAVIGATION}
              component={ThreadScreen}
              options={{ headerShown: true }}
            />
            <MainStack.Screen name={"Alert"} component={AlertComponent} />
            <MainStack.Screen
              name={USER_PROFILE}
              component={UserProfileScreen}
            />
            <MainStack.Screen
              name={REPORT_USERS}
              component={ReportUserScreen}
            />
            <MainStack.Screen
              name={USER_FOLLOW_SCREEN}
              component={UserFollowScreen}
            />
            <MainStack.Screen name={DETAIL_POST} component={ViewPostDetail} />
            <MainStack.Screen name={COMMENT_DETAIL} component={CommentDetail} />
            <MainStack.Screen name={POST_BLOG} component={PostBlog} />
            <MainStack.Screen name={EDIT_BLOG} component={EditBlog} />
            <MainStack.Screen
              name={ID_CARD_INFO_SCREEN}
              component={IdCardInfoScreen}
            />
            <MainStack.Screen name={BLOCK_USERS} component={BlockUsersScreen} />
            <MainStack.Screen
              name={CHANGE_PASSWORD}
              component={ChangePassword}
            />
            <MainStack.Screen
              name={VERIFY_ACCOUNT_SCREEN}
              component={VerifyAccount}
            />
          </MainStack.Navigator>
        </>
      ) : (
        <>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"CHECKSTACK"} component={CheckNavigator} />
          </Stack.Navigator>
        </>
      )}
    </>
  );
};

export default SubNavigator;

const styles = StyleSheet.create({});
