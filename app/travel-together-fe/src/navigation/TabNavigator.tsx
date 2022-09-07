import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  BLOG_NAVIGATION,
  CHANNEL_LIST,
  HOME_NAVIGATOR,
  NOTIFICATION_NAVIGATION,
  PROFILE_BOTTOM_NAVIGATION,
  SEARCH_POST,
} from "../utilites/routerName";
import NotificationScreen from "../containers/NotificationScreen/NotificationScreen";
import BlogScreen from "../containers/BlogScreen/BlogScreen";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import SpecifyNavigator from "./HomeNavigator";
import { getFocusedRouteNameFromRoute, useIsFocused } from "@react-navigation/native";
import ChatNavigator from "./ChatNavigation";
import ProfileNavigator from "./ProfileNavigator";
import { useSelector } from "react-redux";
import { ApplicationState } from "../redux";
import UsersScreen from "../containers/ChatScreen/ListUser";
import { useChatContext } from "stream-chat-expo";

const TabNavigator = () => {
  const { client } = useChatContext();

  const [count, setCount] = useState<number>(0);

  const isFocused = useIsFocused();

  useEffect(() => {
    client.on((event) => {
      if (event.total_unread_count !== undefined) {

        // setCount(count + 1);
      }

      if (event.unread_channels !== undefined) {
        setCount(event.unread_channels);
      }
    });
  }, []);

  // create bottom tab
  const TabStack = createMaterialBottomTabNavigator();

  // Animated Tab Indicator...
  const tabOffsetValue = useRef(new Animated.Value(0)).current;

  // take objectNotification from redux
  const { objectNotification } = useSelector(
    (state: ApplicationState) => state.notificationReducer
  );

  // data of notification
  const dataNoti = objectNotification.notifications
    ? objectNotification.notifications
    : "";

  // re-render after
  useEffect(() => {
    if (dataNoti != "") {
      let isRead = 0;
      if (numberIsRead < 12) {
        dataNoti.filter((el: any) => {
          if (!el.read) {
            isRead++;
          }
        });
        setNumberIsRead(isRead);
      }
    }
    return () => setNumberIsRead(0)
  }, [dataNoti]);

  const getTabBarVisibility = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";
    if (routeName == "NewPost" || routeName == SEARCH_POST) {
      // setAnimate(false);
      return "none";
    }
    // setAnimate(true);
    return "flex";
  };

  const [numberIsRead, setNumberIsRead] = useState<number>(0);

  // Get curren width
  const getWidth = () => {
    let width = Dimensions.get("window").width;
    // Total five Tabs...
    return width / 5;
  };

  return (
    <>
      <TabStack.Navigator
        initialRouteName={HOME_NAVIGATOR}
        activeColor="#0094FF"
        inactiveColor="#AEAEAE"
        barStyle={{ backgroundColor: "#fff" }}
      >
        <TabStack.Screen
          name={HOME_NAVIGATOR}
          component={SpecifyNavigator}
          options={({ route }) => ({
            tabBarLabel: "Home",
            tabBarStyle: { display: getTabBarVisibility(route) },
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name="home" size={26} color={color} />
            ),
          })}
        // listeners={({ navigation, route }) => ({
        //     // Onpress Update....
        //     tabPress: (e) => {
        //         Animated.spring(tabOffsetValue, {
        //             toValue: 0,
        //             useNativeDriver: true,
        //         }).start();
        //     },
        // })}
        />
        <TabStack.Screen
          name={CHANNEL_LIST}
          component={ChatNavigator}
          options={({ route }) => ({
            tabBarBadge: count != 0 ? count : 0,
            tabBarLabel: "Message",
            tabBarStyle: { display: getTabBarVisibility(route) },
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <Entypo name="chat" size={26} color={color} />
            ),
          })}
        // listeners={({ navigation, route }) => ({
        //     // Onpress Update....
        //     tabPress: (e) => {
        //         Animated.spring(tabOffsetValue, {
        //             toValue: getWidth(),
        //             useNativeDriver: true,
        //         }).start();
        //     },
        // })}
        />
        <TabStack.Screen
          name={BLOG_NAVIGATION}
          component={BlogScreen}
          options={{
            tabBarLabel: "Explore",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name="earth-sharp" size={25} color={color} />
            ),
          }}
        // listeners={({ navigation, route }) => ({
        //     // Onpress Update....
        //     tabPress: (e) => {
        //         Animated.spring(tabOffsetValue, {
        //             toValue: getWidth() * 2,
        //             useNativeDriver: true,
        //         }).start();
        //     },
        // })}
        />
        <TabStack.Screen
          name={NOTIFICATION_NAVIGATION}
          // children={() => (
          //   <NotificationScreen lstNotification={notifications} />
          // )}
          component={NotificationScreen}
          options={{
            tabBarBadge: numberIsRead > 10 ? "10+" : numberIsRead,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name="notifications" size={26} color={color} />
            ),
          }}
        // listeners={({ navigation, route }) => ({
        //     // Onpress Update....
        //     tabPress: (e) => {
        //         Animated.spring(tabOffsetValue, {
        //             toValue: getWidth() * 3,
        //             useNativeDriver: true,
        //         }).start();
        //     },
        // })}
        />
        <TabStack.Screen
          name={PROFILE_BOTTOM_NAVIGATION}
          component={ProfileNavigator}
          options={({ route }) => ({
            tabBarLabel: "Profile",
            tabBarStyle: { display: getTabBarVisibility(route) },
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name="person" size={26} color={color} />
            ),
          })}
        // listeners={({ navigation, route }) => ({
        //     // Onpress Update....
        //     tabPress: (e) => {
        //         Animated.spring(tabOffsetValue, {
        //             toValue: getWidth() * 4,
        //             useNativeDriver: true,
        //         }).start();
        //     },
        // })}
        />
      </TabStack.Navigator>
      {/* Animated */}
      {/* Check animation */}
      {/* <Animated.View
                style={[
                    {
                        width: getWidth() - 20,
                        height: 2,
                        backgroundColor: '#0094FF',
                        position: 'absolute',
                        bottom: 85,
                        // Horizontal Padding = 20...
                        left: 10,
                        borderRadius: 20,
                        transform: [{ translateX: tabOffsetValue }],
                    }, {

                    }]}
            ></Animated.View> */}
    </>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({});
