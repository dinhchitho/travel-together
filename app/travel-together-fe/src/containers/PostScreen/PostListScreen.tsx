import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import {
  AntDesign,
  Fontisto,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";

import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Color from "../../utilites/Color";
import {
  DETAIL_POST,
  NEW_POST,
  PERSONAL_NAVIGATION,
  POST_LIST,
  SEARCH_POST,
  USER_PROFILE,
} from "../../utilites/routerName";
import HeaderCommon, {
  headerStyles,
} from "../../components/HeaderCommon/HeaderCommon";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../../utilites";
import { User } from "../../models/User";
import { TravelRequest } from "../../models/TravelRequest";
import { EGender } from "../../api/Enum/EGender";
import { ETripType } from "../../api/Enum/ETripType";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { array } from "yup";
import { globalStyles } from "../../globalStyles";
import Loading from "../../components/custom/Loading";
import AppLoading from "../../components/AppLoader/AppLoading";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../redux";
import { maleDefaultImage } from "../../api/Const";
const statusBarHeight = Constants.statusBarHeight;

interface IProps {
  navigation: any;
  route: any;
}

const PostListScreen = (props: IProps) => {
  const navigation = useNavigation<any>();

  const { user, error, userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const isFocused = useIsFocused();

  const componentMounted = useRef(true);

  const dateSortDesc = (array: []) => {
    return array.sort(
      (a: any, b: any) =>
        Number(new Date(b.travelRequest.createdDate)) -
        Number(new Date(a.travelRequest.createdDate))
    );
  };

  const fetchTravelRequest = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}user/travel-request/all`);
      const arrSorted = filterNotBlockUser(dateSortDesc(response.data.data));
      console.log("response.data.data :", response.data.data);
      if (props.route.params) {
        const arrFilter = arrayFilter(arrSorted, props.route.params);
        setUsers(arrFilter);
      } else {
        setUsers(arrSorted);
      }
      setLoading(false);
    } catch (error) {
      console.error("error :", error);
      setLoading(false);
    }
  };

  const calculateAge = (birthday: Date) => {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const ageFilter = (birthday: Date, minAge: number, maxAge: number) => {
    let age = calculateAge(new Date(birthday));
    if (birthday) {
      return age >= minAge && age <= maxAge;
    }
  };

  const dateFilter = (
    departureDateCondition: Date,
    endDateCondition: Date,
    departureDate: Date,
    endDate: Date
  ) => {
    return (
      new Date(departureDate) >= new Date(departureDateCondition) &&
      new Date(endDate) <= new Date(endDateCondition)
    );
  };

  const arrayFilter = (arr: any, condition: any) => {
    const { country, gender, minAge, maxAge, departureDate, endDate } =
      condition;
    arr = arr.filter(
      (item: any) =>
        ageFilter(item.dob, minAge, maxAge) &&
        dateFilter(
          departureDate,
          endDate,
          item.travelRequest.departureDate,
          item.travelRequest.endDate
        )
    );
    if (gender !== "Both") {
      const genderBoolean = gender === "Male" ? true : false;
      arr = arr.filter((item: any) => item.gender === genderBoolean);
    }
    if (country) {
      arr = arr.filter(
        (item: any) => item.travelRequest.destination === country
      );
    }
    return arr;
  };

  const isBlockUser = (
    userId: string,
    currentBlockedUsers: any,
    itemBlockedUsers: any
  ) => {
    let check =
      currentBlockedUsers.find((e: any) => e.id === userId) ||
      itemBlockedUsers.find((item: any) => item.id === user.id)
        ? true
        : false;
    return check;
  };

  const filterNotBlockUser = (travelRequests: any) => {
    return travelRequests.filter(
      (item: any) =>
        !isBlockUser(
          item.id,
          userCurrent.blackListedUsers,
          item.blackListedUsers
        )
    );
  };

  const navigateToUserProfile = (id: any) => {
    navigation.navigate(DETAIL_POST, id);
  };

  useEffect(() => {
    if (componentMounted) {
      fetchTravelRequest();
    }
    return () => {
      componentMounted.current = false;
      props.route.params = null;
      setUsers([]);
    };
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={{ height: statusBarHeight }}></View>
      <View style={headerStyles.header}>
        <TouchableOpacity
          style={{ width: 50, alignItems: "flex-start" }}
          onPress={() => navigation.navigate(SEARCH_POST)}
        >
          {/* <Feather name={leftIcon} size={24} color={Color.text_grey} /> */}
          <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
        <Text style={headerStyles.headerText}>Home</Text>
        <TouchableOpacity
          style={{ width: 50, alignItems: "flex-end" }}
          onPress={() => navigation.navigate(NEW_POST)}
        >
          <Ionicons name="md-create-outline" size={26} color="black" />
          {/* <Entypo name={rightIcon} size={24} color={Color.text_grey} /> */}
        </TouchableOpacity>
      </View>
      {/* <HeaderCommon
        leftIcon={"filter"}
        rightIcon={"plus"}
        rightNavigation={NEW_POST}
        leftNavigation={SEARCH_POST}
        title={"Home"}
      /> */}
      {loading ? <AppLoading /> : <></>}
      <ScrollView style={styles.listPostWrapper}>
        {users?.length > 0 &&
          users.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                navigateToUserProfile(item.id);
              }}
            >
              <PostItem
                id={item.id}
                fullName={item.fullName || ""}
                avatar={item.avatar || ""}
                country={item.country || ""}
                travelRequest={item.travelRequest || {}}
                localGuide={item.localGuide || false}
              ></PostItem>
            </TouchableOpacity>
          ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

export default PostListScreen;

interface PostItemProps {
  id: any;
  fullName: string;
  avatar: string;
  country: string;
  localGuide: boolean;
  travelRequest: TravelRequest;
}

const PostItem = (props: PostItemProps) => {
  const { id, fullName, avatar, travelRequest, localGuide } = props;
  const {
    genderLooking,
    departureDate,
    endDate,
    tripType,
    description,
    destination,
  } = travelRequest;

  return (
    <View style={styles.postItemWrapper}>
      <Image
        source={{
          uri: avatar ? avatar : maleDefaultImage,
        }}
        style={styles.postItemImage}
      ></Image>
      <View style={styles.postItemContent}>
        <View style={styles.postItemTitle}>
          <Text style={styles.name}>
            {fullName}
            {localGuide && (
              <View style={{ paddingLeft: 5, paddingBottom: 1 }}>
                <AntDesign name="checkcircle" size={11} color={Color.primary} />
              </View>
            )}
          </Text>

          <View style={styles.lookingWrapper}>
            <Text style={styles.postItemText}>Looking for</Text>
            <View
              style={{
                marginLeft: 5,
              }}
            >
              {genderLooking == EGender.Both && (
                <Ionicons name="people" size={18} color={Color.danger} />
              )}
              {genderLooking == EGender.Male && (
                <Fontisto name="male" size={18} color={Color.danger} />
              )}
              {genderLooking == EGender.Female && (
                <Fontisto name="female" size={18} color={Color.danger} />
              )}
            </View>
          </View>
        </View>
        <View>
          <View>
            <View style={styles.locationWrapper}>
              <View
                style={{
                  justifyContent: "flex-start",
                  height: "100%",
                  paddingTop: 2,
                }}
              >
                <MaterialIcons name="location-pin" size={15} color="black" />
              </View>
              <Text style={styles.postItemText}>{destination}</Text>
            </View>
          </View>
          <View style={styles.postItemDateType}>
            <View>
              <Text style={styles.postItemText}>{`${new Date(
                departureDate || ""
              ).toLocaleDateString()} - ${new Date(
                endDate || ""
              ).toLocaleDateString()}`}</Text>
            </View>
            <View style={styles.postItemType}>
              <Text style={styles.postItemTypeText}>
                {ETripType[tripType || ""]}
              </Text>
            </View>
          </View>
          <Text
            style={styles.postItemText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  listPostWrapper: {},
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#ffffff",
    borderWidth: 0.3,
    borderColor: "transparent",
    borderBottomColor: "#DDDDDD",
  },
  headerText: {
    color: Color.black,
    fontSize: 17,
    fontWeight: "500",
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
  },
  postItemWrapper: {
    marginBottom: 10,
    flexDirection: "row",
    padding: 10,
    // paddingTop: 10,
    height: 145,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    shadowColor: "#ECEDEE",
    shadowRadius: 10,
    shadowOpacity: 0.6,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  postItemImage: {
    width: 100,
    borderRadius: 4,
  },
  postItemTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: "#2D3F65",
    fontSize: 15,
    fontWeight: "600",
    width: 140,
  },
  lookingWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  postItemContent: {
    flex: 1,
    paddingLeft: 6,
  },
  locationWrapper: {
    marginLeft: -2,
    flexDirection: "row",
    alignItems: "center",
  },
  postItemText: {
    color: Color.text_grey,
    fontSize: 13,
    lineHeight: 20,
  },
  postItemDateType: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // width: "10  0%",
  },
  postItemType: {
    backgroundColor: "#FBF6F6",
    borderRadius: 5,
    paddingHorizontal: 5,
    height: 17,
    marginLeft: 2,
  },
  postItemTypeText: {
    fontSize: 12,
    textAlign: "center",
  },
});
