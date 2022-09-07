import { useNavigation } from "@react-navigation/core";
import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { useChatContext } from "stream-chat-react-native-core";
import { ApplicationState } from "../../redux";
import { CHAT_DETAIL_NAVIGATION } from "../../utilites/routerName";

const UserListItem = ({ userDetail } : any) => {
  const { client } = useChatContext();

  const { user, error } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const navigation = useNavigation<any>();

  
  const onPress = async () => {

    if (!userDetail.id || !user.id) {
      return;
    }
    const channel = client.channel("messaging", { members: [userDetail.id, user.username] });
    await channel.watch();
    
    navigation.navigate(CHAT_DETAIL_NAVIGATION, { channel });
  };

  return (
    <Pressable onPress={onPress} style={styles.root}>
      <Image style={styles.image} source={{ uri: userDetail.image }} />
      <Text>{userDetail.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: "gray",
    borderRadius: 50,
    marginRight: 10,
  },
});

export default UserListItem;