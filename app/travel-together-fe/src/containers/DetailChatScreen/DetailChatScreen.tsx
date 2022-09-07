import { Button, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AutoCompleteInput, Channel, Gallery, MessageInput, MessageList, ThemeProvider, useChatContext, useMessageInputContext, usePaginatedMessageListContext } from 'stream-chat-expo'
import { useNavigation, useRoute } from '@react-navigation/native';
import { CHAT_THREAD_NAVIGATION, USER_PROFILE } from '../../utilites/routerName';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppLoading from '../../components/AppLoader/AppLoading';
import Color from '../../utilites/Color';
import { ApplicationState } from '../../redux';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../utilites';

export const theme = {
  messageList: {
    container: {
      backgroundColor: 'transparent',
    },
  },
};

const IMAGE_URI = 'https://images.unsplash.com/photo-1549125764-91425ca48850?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NjF8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60'

const DetailChatScreen = () => {
  const [channel, setChannel] = useState<any>(null);
  const route = useRoute();

  const { client } = useChatContext<any>();
  const navigation = useNavigation<any>();

  // take channel id from navigation param
  const { channelId }: any = route.params || {};

  const { userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const [userBlocked, setUserBlocked] = useState<any>(false);

  const isBlockUser = (
    userId: string,
    currentBlockedUsers: any,
    itemBlockedUsers: any
  ) => {
    let check =
      currentBlockedUsers.find((e: any) => e.id === userId) ||
        itemBlockedUsers.find((item: any) => item.id === userCurrent.id)
        ? true
        : false;
    return check;
  };

  const getUserById = async (id: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}user/getUserById?userId=${id}`
      );
      return response;
    } catch (error) {

    }
  }

  useEffect(() => {
    // const channel = client.channel("messaging", "channel-id");
    // console.log('====================================');
    // console.log('channel', channel);
    // console.log('====================================');
    // channel.unmute()
    const fetchChannel = async () => {
      setChannel(null);
      // fetching channel with channel id channelId)
      const channels = await client.queryChannels({ id: { $eq: channelId } });

      if (channels.length > 0) {
        // updating channel state
        setChannel(channels[0]);
        // check user chat together
        let ar = Object.values(channels[0]?.state?.members)
        let idUser: String = "";
        let nameUserChat: String = "";
        if (ar[1].user.id == userCurrent.id) {
          idUser = ar[0].user.id;
          nameUserChat = ar[0].user.name;
        } else {
          idUser = ar[1].user.id;
          nameUserChat = ar[1].user.name;
        }
        // set title for screen
        navigation.setOptions({
          headerTitle: () => <Text onPress={() => navigation.navigate(USER_PROFILE, idUser)}>{nameUserChat}</Text>,
        })

        // get user information to get block list
        const response = await axios.get(
          `${BASE_URL}user/getUserById?userId=${idUser}`
        );
        // check have blocked or not?
        if (response.data.success) {
          if (userCurrent.blackListedUsers.filter((el: any) => el.id == idUser).length > 0 || isBlockUser(userCurrent.id, userCurrent.blackListedUsers, response.data.data.blackListedUsers)) {
            setUserBlocked(true);
          } else {
            setUserBlocked(false);
          }
        }
      } else {
        console.log("No channels found");
      }
      return () => setChannel(null);
    };

    fetchChannel();
  }, [channelId]);

  if (!channel) {
    return (
      <AppLoading />
    );
  }
  const StreamButton = () => {
    const { sendMessage, text, imageUploads, fileUploads } = useMessageInputContext();
    const isDisabled = !text && !imageUploads.length && !fileUploads.length;

    return (
      <TouchableOpacity disabled={isDisabled} onPress={sendMessage}>
        {isDisabled ? <MaterialCommunityIcons name="send" size={24} color="gray" /> : <MaterialCommunityIcons name="send" size={24} color="#0094FF" />}
      </TouchableOpacity>
    );
  };

  const CustomInputGiphySearch = () => {
    const { setGiphyActive, setShowMoreOptions } = useMessageInputContext();

    return (
      <View>
        <Text style={{ textAlign: 'center' }}>Giphy</Text>
        <AutoCompleteInput />
        <Button
          onPress={() => {
            setGiphyActive(false);
            setShowMoreOptions(true);
          }}
          title='Close'
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ThemeProvider style={theme}>
        <Channel channel={channel} SendButton={StreamButton} InputGiphySearch={CustomInputGiphySearch} Gallery={() => <Gallery preventPress />}>
          <ImageBackground
            style={{ flex: 1 }}
            source={{
              uri: IMAGE_URI,
            }}
          >
            <MessageList
              onThreadSelect={(thread) =>
                navigation.navigate(CHAT_THREAD_NAVIGATION, {
                  channelId: channelId,
                  thread,
                })
              }

            />
            {/* <MessageInput /> */}
            {
              userBlocked ? <View style={{ backgroundColor: Color.primary, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>You can't reply this conversation.</Text>
              </View> : <MessageInput />
            }
          </ImageBackground>
        </Channel>
      </ThemeProvider>

    </View>
  );
};

export default DetailChatScreen

const styles = StyleSheet.create({
  container: {
    height: '98%',

  }
})
