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
} from "../utilites/routerName";

import { useNavigation } from "@react-navigation/native";
import { Chat } from "stream-chat-expo";
import { ApplicationState, UpdateCurrentUser } from "../redux";
import { useDispatch, useSelector } from "react-redux";
import { StreamChat } from "stream-chat";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewPostScreen from "../containers/PostScreen/NewPostScreen";
import SearchPostScreen from "../containers/PostScreen/SearchPostScreen";
import ThreadScreen from "../containers/DetailChatScreen/Thread";
import DetailChatScreen from "../containers/DetailChatScreen/DetailChatScreen";
import { io, Socket } from "socket.io-client";
import {
  NotificationTypesClient,
  NotificationTypesServer,
  NOTIFICATION_ACTIONS_CLIENT,
  NOTIFICATION_ACTIONS_SERVER,
} from "../socket-client/actions/notification.actions";
import { BASE_URL, SOCKET_URL } from "../utilites";
import {
  addNotification,
  NotificationActionTypes,
  onSetAllNotification,
} from "../redux/actions/notification.actions";
import { Payload, Response } from "../socket-client/constants/data.constants";
import AlertComponent from "../components/Alert/AlertComponent";
import ProfileNavigator from "./ProfileNavigator";
import UserProfileScreen from "../containers/ProfileScreen/UserProfileScreen";
import EditProfileFirstLogin from "../containers/ProfileScreen/EditProfileFirstLogin";
import TabNavigator from "./TabNavigator";
import ViewPostDetail from "../containers/PostScreen/ViewPostDetail";
import axios from "axios";
import { ActivityIndicator, View, Text } from "react-native";
import SubNavigator from "./SubNavigator";
import CheckNavigator from "./CheckNavigator";
import AppLoading from "../components/AppLoader/AppLoading";
import { isMountedRef } from "./RootNavigator";

type EmitStacks = {
  action: NotificationTypesClient;
  payload: Payload;
  callback: (res: Response<any>) => void;
};

const MainNavigator = () => {
  const dispatch = useDispatch();

  const API_KEY = "cwkwpdnq8kgw";
  const client = StreamChat.getInstance(API_KEY);

  const [connected, setConnected] = useState<boolean>(false);

  const [hasUpdated, setHasUpdated] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<any>();

  const { user, userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const Stack = createNativeStackNavigator();

  // useEffect(() : any => {
  //   return () => client.disconnectUser();
  // }, []);

  // useEffect(() => {
  //   if (user) {
  //     // client.disconnectUser();
  //     connectUser(user.username, userCurrent.fullName, userCurrent.avatar);
  //   }
  // }, [userCurrent]);

  // redirect to first update information when first login
  // const fetchDataCurrent = async () => {
  //   console.log("1")

  //   setLoading(true);
  //   let response = await axios.get(`${BASE_URL}user/current-user`);
  //   if (response) {
  //     let userData = response.data.data;
  //     // connectUser(userData.username, userData.fullName, userData.avatar)
  //     dispatch<any>(UpdateCurrentUser(userData));
  //     if (userData.hasUpdated) {
  //       setHasUpdated(true);
  //     } else {
  //       setHasUpdated(false);
  //     }
  //     setLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   fetchDataCurrent();
  // }, []);

  const [socket, setSocket] = useState<Socket>(
    io(`${SOCKET_URL}/${user.id}`, {
      path: "/socket-server/socket",
    })
  );

  const [emitStacksState, setEmitStacksState] = useState<EmitStacks[]>([]);

  const listenServerEvent = (): void => {
    listen(
      NOTIFICATION_ACTIONS_SERVER.NOTIFICATION_ADDED,
      (userId: string, data: any) => {
        if (userId && data) {
          dispatch<any>(addNotification(data));
        }
      }
    );
  };

  const emit = (
    action: NotificationTypesClient,
    payload: Payload,
    callback: (res: Response<any>) => void
  ): void => {
    if (socket && socket.connected) {
      socket.emit(action, payload, callback);
    }
    // else {
    //   setEmitStacksState(prev => [...prev, {action, payload, callback}]);
    // }
  };

  const getNotifications = () => {
    emit(
      NOTIFICATION_ACTIONS_CLIENT.LIST_NOTIFICATION,
      { options: { userId: user.id } },
      (res) => {
        if (res && res.success) {
          dispatch<any>(onSetAllNotification(res.data));
        }
      }
    );
  };

  const executeEmitStacks = (): void => {
    if (emitStacksState.length) {
      for (const idx in emitStacksState) {
        const emit = emitStacksState[idx];
        socket.emit(emit.action, emit.payload, emit.callback);
      }
      setEmitStacksState([]);
    }
  };

  const listen = (
    action: NotificationTypesServer,
    callback: (
      type: NotificationActionTypes,
      data: object,
      options: object
    ) => void
  ): void => {
    !socket.hasListeners(action) && socket.on(action, callback);
  };

  useEffect(() => {
    if (userCurrent != undefined) {
      connectUser(userCurrent.id, userCurrent.fullName, userCurrent.avatar);
    }
  }, [userCurrent]);

  // Connect Socket
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      setConnected(true);
      listenServerEvent();
      getNotifications();
      // executeEmitStacks();
    });
    socket.on("disconnect", () => setConnected(false));
    // console.log(connected);
    return () => {
      socket.disconnect();
      socket.close();
    };
  }, []);

  // if (loading) {
  //   return (
  //     <AppLoading />
  //   );
  // }

  const connectUser = async (
    username: string,
    fullName: string,
    avatar: string
  ) => {
    if (!connected) {
      await client.connectUser(
        {
          id: username,
          name: fullName,
          image: avatar,
        },
        client.devToken(username)
      );
      setConnected(true);
      console.log("connected");
    }
  };

  return (
    <>
      <Chat client={client}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={"SUBSTACK"} component={SubNavigator} />
        </Stack.Navigator>
      </Chat>
    </>
  );
};
export default MainNavigator;
