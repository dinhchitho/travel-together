import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from '../containers/ChatScreen/ChatScreen';
import DetailChatScreen from '../containers/DetailChatScreen/DetailChatScreen';
import ThreadScreen from '../containers/DetailChatScreen/Thread';
import {
    CHAT_DETAIL_NAVIGATION,
    CHAT_NAVIGATION,
    CHAT_THREAD_NAVIGATION,
} from '../utilites/routerName';

const ChatNavigator = () => {
    const HomeStack = createNativeStackNavigator();
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name={CHAT_NAVIGATION} component={ChatScreen} />
        </HomeStack.Navigator>
    );
};

export default ChatNavigator;
