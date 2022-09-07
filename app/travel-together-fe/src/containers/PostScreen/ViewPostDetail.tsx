import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { ETripType } from "../../api/Enum/ETripType";
import axios from "axios";
import { BASE_URL } from "../../utilites";
import { User } from "../../models/User";
import Color from "../../utilites/Color";
import { EvilIcons } from "@expo/vector-icons";
import TripTypeIcon from "../../components/post/TripTypeIcon";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FAB } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { USER_PROFILE } from "../../utilites/routerName";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../redux";
import { useChatContext } from "stream-chat-expo";
import { CHAT_DETAIL_NAVIGATION } from "../../utilites/routerName";
import { WINDOW_HEGIHT } from "../../utilites/Dimensions";
import { ScrollView } from "react-native-gesture-handler";
import { COUNTRIES } from "../../api/Const";

interface IProps {
  route: any;
}

const ViewPostDetail = (props: IProps) => {
  const { client } = useChatContext();

  // take id from props
  const { route } = props;

  const { user } = useSelector((state: ApplicationState) => state.userReducer);

  // travel request
  const [travelRequest, setTravelRequest] = useState<any>({});

  const [userRequest, setUserRequest] = useState<User>(new User());

  const [age, setAge] = useState<any>("");

  // init router
  const navigation = useNavigation<any>();

  useEffect(() => {
    // fetchUsser();
    setCurrentUserInfo();
  }, []);

  const setCurrentUserInfo = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(
        `${BASE_URL}user/getUserById?userId=${route.params}`
      );
      if (response) {
        setUserRequest(response.data.data);

        // tính tuổi hiện tại
        let yearDob = new Date(response.data.data.dob).getFullYear();
        let yearNow = new Date().getFullYear();

        let age = Math.abs(yearNow - yearDob);
        // gán tuổi hiện tại vào state
        setAge(age);

        if (response.data.data.travelRequest) {
          const { destination, tripType, departureDate, endDate, description } =
            response.data.data.travelRequest;
          // tính khoảng thời gian đi
          let a: any = new Date(departureDate);
          let b: any = new Date(endDate);
          var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
          var diffDays = Math.round(
            Math.abs((a.getTime() - b.getTime()) / oneDay)
          );
          // option date time
          setTravelRequest({
            destination,
            tripType: ETripType[tripType],
            departureDate: new Date(departureDate).toLocaleDateString("en-us", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            endDate: new Date(endDate).toLocaleDateString("en-US"),
            aboutDate: diffDays,
            description: description,
          });
        }
        // setLoading(false);
      }
    } catch (error) {
      console.log("error :", error);
      // setLoading(false);
    }
  };

  console.log(userRequest);

  // navigate to user detail profile
  const navigateToUserProfile = (id: any) => {
    navigation.navigate(USER_PROFILE, id);
  };

  const onPress = async () => {
    if (!userRequest.id || !user.id) {
      return;
    }
    const channel = client.channel("messaging", {
      members: [userRequest.id, user.id],
    });
    await channel.watch();

    navigation.navigate(CHAT_DETAIL_NAVIGATION, { channelId: channel.id });
  };

  // find flat of country
  const findFlat = (countryName: string) => {
    return COUNTRIES.filter((item: any) =>
      item.name.common.toLowerCase().includes(countryName.toLowerCase())
    )[0].flags.png;
  };

  return (
    <>
      <View style={{ height: '91%' }}>
        <ScrollView>
          <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
            {/* Image */}
            <View>
              <Image
                source={{
                  uri: userRequest.avatar
                    ? userRequest.avatar
                    : "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
                }}
                style={styles.image}
              ></Image>
            </View>
            {/*  */}
            <View>
              {/* information user */}
              <View style={{ borderBottomWidth: 1, borderBottomColor: Color.grey }}>
                <View style={styles.containerName}>
                  <Text style={styles.fullName}>
                    {userRequest.fullName ? userRequest.fullName : "Anonymous"}{" "}
                  </Text>
                  <Text style={styles.age}>, {age}</Text>
                </View>
                {/* Live in */}
                <View style={styles.address}>
                  {/* <Entypo name="address" size={24} color="black" /> */}
                  {userRequest.country && <>
                    <Image
                      source={
                        userRequest.country
                          ? { uri: findFlat(userRequest.country) }
                          : require("../../../assets/images/earth.png")
                      }
                      style={{
                        height: 15,
                        width: 15,
                        borderRadius: 100,
                        marginRight: 3,
                      }} />
                    <Text style={styles.textAddress}>{userRequest.country}</Text>
                  </>}
                </View>
              </View>
              <View style={{ paddingHorizontal: 15 }}>
                <View>
                  <Text
                    style={{ fontSize: 16, paddingVertical: 10, fontWeight: "500" }}
                  >
                    Detail trip:{" "}
                  </Text>
                </View>
                <View style={styles.contentAboutTrip}>
                  <View style={styles.tag}>
                    <EvilIcons name="location" size={24} color="black" />
                    <Text>{travelRequest.destination}</Text>
                  </View>
                  <View style={styles.tag}>
                    <EvilIcons name="calendar" size={27} color="black" />
                    <Text>{travelRequest.departureDate}</Text>
                  </View>
                  <View style={styles.tag}>
                    <SimpleLineIcons name="clock" size={22} color="black" />
                    <Text> {travelRequest.aboutDate} days</Text>
                  </View>
                  <View style={styles.tag}>
                    <TripTypeIcon name={travelRequest.tripType}></TripTypeIcon>
                    <Text> {travelRequest.tripType}</Text>
                  </View>
                </View>
                <View style={{}}>
                  <Text style={{ fontSize: 14, paddingVertical: 20, flexWrap: 'wrap', flexDirection: 'row', width: '100%' }}>
                    {travelRequest.description}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={{ flexDirection: "row", position: 'absolute', left: 0, right: 0, bottom: 10, justifyContent: 'center', alignItems: 'center' }}>
        <FAB
          icon="close"
          color="white"
          style={styles.fab}
          onPress={() => {
            navigation.goBack();
          }}
        />
        {user.id != route.params ? (
          <>
            <FAB
              icon="chat"
              color="white"
              style={styles.fab1}
              onPress={() => onPress()}
            />
            <FAB
              icon="heart"
              color="white"
              style={styles.fab2}
              onPress={() => {
                navigateToUserProfile(route.params);
              }}
            />
          </>
        ) : (
          <></>
        )}
      </View>
    </>
  );
};

export default ViewPostDetail;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 350,
  },
  containerName: {
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 20,
    fontWeight: "800",
    color: "blue",
  },
  age: {
    fontSize: 20,
    fontWeight: "500",
    color: "blue",
    marginLeft: 5,
  },
  address: {
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: "row",
  },
  textAddress: {
    fontSize: 18,
  },
  contentAboutTrip: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    width: "auto",
    alignSelf: "flex-start",
    padding: 8,
    borderRadius: 15,
    backgroundColor: Color.tagColor,
    margin: 2,
    alignItems: "center",
  },
  fab: {
    margin: 16,
    backgroundColor: "#FC5067",
    color: "white",
  },
  fab1: {
    margin: 16,
    backgroundColor: "#03A6FB",
  },
  fab2: {
    margin: 16,
    backgroundColor: "#08CD8F",
    color: "white",
  },
});
