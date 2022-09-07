import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { headerStyles } from "../../components/HeaderCommon/HeaderCommon";
import { globalStyles } from "../../globalStyles";
import { useNavigation } from "@react-navigation/native";
import { Feather, Entypo } from "@expo/vector-icons";
import { PERSONAL_NAVIGATION } from "../../utilites/routerName";
import Color from "../../utilites/Color";
import axios from "axios";
import { BASE_URL } from "../../utilites";

interface IProps {
  route?: any;
}

const FollowScreen = (props: IProps) => {
  const navigation = useNavigation<any>();

  const params = props.route.params;

  const [follows, setFollows] = useState<[]>([]);
  const [onFollowingTab, setOnFollowingTab] = useState<boolean>(
    params.from === "Following" ? true : false
  );

  useEffect(() => {
    setFollows(
      params.from === "Following" ? params.followingUsers : params.followedUsers
    );
  }, []);

  const handleAddFollow = async (userId: string) => {
    const response = await axios.post(
      `${BASE_URL}user/add-follow?userId=${userId}`
    );
    if (response.data.data) {
      return response.data.data;
    }
    try {
    } catch (error) {
      console.log("error :", error);
    }
  };
  const handleUnfollow = async (userId: string) => {
    const response = await axios.delete(
      `${BASE_URL}user/remove-follow?userId=${userId}`
    );
    if (response.data.data) {
      return response.data.data;
    }
    try {
    } catch (error) {
      console.log("error :", error);
    }
  };

  return (
    <SafeAreaView>
      <View style={[headerStyles.header, globalStyles.px15]}>
        <TouchableOpacity
          style={{ width: 50, alignItems: "flex-start" }}
          onPress={() => {
            navigation.navigate(PERSONAL_NAVIGATION, "updated");
          }}
        >
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={headerStyles.headerText}>{params.fullName}</Text>
        <View style={{ width: 50 }}></View>
      </View>
      <View style={{ padding: 15 }}>
        <View style={followStyles.tabWrapper}>
          <TouchableOpacity
            style={[
              followStyles.tab,
              !onFollowingTab ? globalStyles.bgWhite : null,
            ]}
            onPress={() => {
              setOnFollowingTab(false);
              setFollows(params.followedUsers);
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "500" }}>Follower</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              followStyles.tab,
              onFollowingTab ? globalStyles.bgWhite : null,
            ]}
            onPress={() => {
              setOnFollowingTab(true);
              setFollows(params.followingUsers);
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
              }}
            >
              Following
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingVertical: 10 }}>
          {follows &&
            follows.map((item: any) => (
              <FollowUser
                key={item.id}
                userId={item.id}
                avatar={item.avatar}
                fullName={item.fullName}
                onUnfollow={handleUnfollow}
                onAddFollow={handleAddFollow}
                // isFollowing={checkUserInFollowing(item.id)}
              />
            ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FollowScreen;

interface FollowUserProps {
  userId: string;
  avatar: any;
  fullName: string;
  onUnfollow: Function;
  onAddFollow: Function;
}

const FollowUser = (props: FollowUserProps) => {
  const { userId, avatar, fullName, onUnfollow, onAddFollow } = props;
  const [isMyFollowing, setIsMyFollowing] = useState<boolean>();

  const handleUnfollow = () => {
    (async () => {
      const isSuccess = await onUnfollow(userId);
      if (isSuccess) {
        setIsMyFollowing(false);
      }
    })();
  };

  const handleAddFollow = () => {
    (async () => {
      const isSuccess = await onAddFollow(userId);
      if (isSuccess) {
        setIsMyFollowing(true);
      }
    })();
  };

  const checkUserInFollowing = async (userId: string) => {
    try {
      let response = await axios.get(`${BASE_URL}user/getAll-following`);
      let userInFollowing = response.data.data.find(
        (e: any) => e.id === userId
      );
      if (userInFollowing) {
        setIsMyFollowing(true);
      } else {
        setIsMyFollowing(false);
      }
    } catch (error) {
      console.error("error :", error);
    }
  };

  useEffect(() => {
    checkUserInFollowing(userId);
    return () => {};
  }, []);

  return (
    <View style={followStyles.itemWrapper}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{
            uri:
              avatar ||
              "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg",
          }}
          style={followStyles.avatarImage}
        ></Image>
        <Text style={{ paddingHorizontal: 10, fontWeight: "500" }}>
          {fullName || "user"}
        </Text>
      </View>
      <View style={followStyles.itemBtnFollow}>
        {isMyFollowing === true && (
          <TouchableOpacity
            onPress={() => {
              handleUnfollow();
            }}
            style={followStyles.unfollowBtn}
          >
            <Text style={followStyles.onUnfollowBtntext}>Unfollow</Text>
          </TouchableOpacity>
        )}
        {isMyFollowing === false && (
          <TouchableOpacity
            onPress={() => {
              handleAddFollow();
            }}
            style={followStyles.followBtn}
          >
            <Text style={followStyles.followBtnText}>Follow</Text>
          </TouchableOpacity>
        )}
        <View style={{ paddingLeft: 10 }}>
          <Entypo name="dots-three-horizontal" size={20} color="black" />
        </View>
      </View>
    </View>
  );
};

export const followStyles = StyleSheet.create({
  tabWrapper: {
    height: 40,
    backgroundColor: "#ECEDEE",
    borderRadius: 6,
    padding: 2,
    flexDirection: "row",
  },
  tab: {
    height: "100%",
    borderRadius: 4,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  avatarWrapper: {
    borderColor: Color.white,
    borderWidth: 3,
    borderRadius: 100,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  itemBtnFollow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  unfollowBtn: {
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: Color.grey,
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  followBtn: {
    backgroundColor: Color.primary,
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  followBtnText: {
    fontWeight: "bold",
    color: Color.white,
  },
  onUnfollowBtntext: {
    fontWeight: "bold",
    color: Color.primary,
  },
});
