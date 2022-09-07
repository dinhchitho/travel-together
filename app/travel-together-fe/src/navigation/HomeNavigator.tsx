import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { POST_LIST, SEARCH_POST, NEW_POST } from "../utilites/routerName";
import PostListScreen from "../containers/PostScreen/PostListScreen";
import NewPostScreen from "../containers/PostScreen/NewPostScreen";
import SearchPostScreen from "../containers/PostScreen/SearchPostScreen";
import AlertComponent from "../components/Alert/AlertComponent";

const HomeNavigator = () => {
  const HomeStack = createNativeStackNavigator();
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={POST_LIST} component={PostListScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
