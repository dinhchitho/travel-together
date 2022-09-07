import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ChannelList } from "stream-chat-expo";
import { useNavigation } from '@react-navigation/native';
import { CHAT_DETAIL_NAVIGATION } from '../../utilites/routerName';
import { ApplicationState } from '../../redux';
import { useSelector } from 'react-redux';

const ChatScreen = () => {

  const navigation = useNavigation<any>();

  const { user, error } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const filters = {
    members: {
      $in: [user.id],
    },
  };

  const onChannelPressed = (channel: any) => {
    navigation.navigate(CHAT_DETAIL_NAVIGATION, { channelId: channel.id });
  };

  return (
    <ChannelList onSelect={onChannelPressed} filters={filters} />
  )
}

export default ChatScreen

const styles = StyleSheet.create({})