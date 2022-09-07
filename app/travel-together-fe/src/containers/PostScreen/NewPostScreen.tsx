import react, { useRef, useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import animationJson from "../../../assets/96237-success.json";
import LottieView from "lottie-react-native";
import { ProgressBar } from "react-native-paper";

import { WINDOW_HEGIHT } from "../../utilites/Dimensions";

import Constants from "expo-constants";

const statusBarHeight = Constants.statusBarHeight;
import { StatusBar } from "expo-status-bar";

import SelectGender from "../../components/post/SelectGender";
import SelectTripType from "../../components/post/SelectTripType";
import SelectCountry from "../../components/post/SelectCountry";
import SelectDate from "../../components/post/SelectDate";
import DescribeTrip from "../../components/post/DescribeTrip";

import Color from "../../utilites/Color";
import { COUNTRIES, TRIP_TYPE } from "../../api/Const";

import { CommonActions, useNavigation } from "@react-navigation/native";
import { HOME_NAVIGATOR, POST_LIST } from "../../utilites/routerName";
import BackHeader from "../../components/BackHeader/BackHeader";
import axios from "axios";
import { BASE_URL } from "../../utilites";
import { ApplicationState, updateTravelRequestCurrentUser } from "../../redux";
import { useSelector } from "react-redux";
import Loading from "../../components/custom/Loading";
import AppLoading from "../../components/AppLoader/AppLoading";
import ModalLargerbase from "../../components/Modal/ModalLargerBase";
import { useDispatch } from "react-redux";

const NewPostScreen = () => {
  const navigation = useNavigation<any>();

  const [step, setStep] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const dispatch = useDispatch();

  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [btnText, setBtnText] = useState<string>("CONTINUE");

  const [gender, setGender] = useState<string>("Both");
  const [tripTypeValue, setTripTypeValue] = useState<number>(0);
  const tripTypeName = useRef<string>("Any type");
  const [destination, setDestination] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState<string>("");

  const componentMounted = useRef(true);

  const { user, error } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const handleChooseGender = (value: string) => {
    setGender(value);
  };
  const handleChooseTripType = (value: any, name: string) => {
    setTripTypeValue(value);
    tripTypeName.current = name;
  };

  const handleSelectDepartureDate = (event: any, value: any) => {
    setDepartureDate(value);
  };
  const handleSelectEndDate = (event: any, value: any) => {
    setEndDate(value);
  };

  const handleFillDescription = (value: string) => {
    setDescription(value);
  };

  const findIdTripType = (key: any) => {
    return TRIP_TYPE.findIndex((i: any) => i.key === key);
  };

  const getTravelRequestByUserId = async (userId: string) => {
    try {
      setLoading(true);
      return await axios.get(`${BASE_URL}user/travel-request/${userId}`);
    } catch (error) {
      setLoading(false);
      console.log("error :", error);
    }
  };

  const createTravelRequest = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}user/travel-request`, {
        genderLooking: gender,
        tripType: TRIP_TYPE[tripTypeValue].key,
        destination,
        departureDate,
        endDate,
        description,
      });
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      console.log("error :", error);
    }
  };

  const continueStep = () => {
    setStep((prevStep) => {
      return prevStep + 1;
    });
    setProgress((prevProgress) => {
      return prevProgress + 0.2;
    });
  };

  const handleContinue = () => {
    switch (step) {
      case 3:
        if (destination) continueStep();
        break;
      case 4:
        if (departureDate > endDate) {
          Alert.alert("Please choose your end date again");
        } else {
          continueStep();
          if (isUpdate) {
            setBtnText("UPDATE");
          } else {
            setBtnText("CREATE");
          }
        }
        break;
      case 5:
        if (description.trim() !== "") {
          (async () => {
            const response = await createTravelRequest();
            console.log("Asdasd");
            dispatch<any>(updateTravelRequestCurrentUser(response?.data.data));
            if (response) setShowSuccess(true);
          })();
        }
        break;
      default:
        continueStep();
        break;
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prevStep) => {
        return prevStep - 1;
      });
      setProgress((prevProgress) => {
        return prevProgress - 0.2;
      });
    } else {
      navigation.dispatch(
        CommonActions.navigate({
          name: POST_LIST,
        })
      );
    }
  };

  const setUserInfo = (userInfo: any) => {
    const {
      genderLooking,
      tripType,
      destination,
      departureDate,
      endDate,
      description,
    } = userInfo;
    setGender(genderLooking);
    setTripTypeValue(findIdTripType(tripType));
    setDestination(destination);
    setDepartureDate(new Date(departureDate));
    setEndDate(new Date(endDate));
    setDescription(description);
  };

  useEffect(() => {
    (async () => {
      let response = await getTravelRequestByUserId(user.id);
      setLoading(false);
      if (response?.data.data && componentMounted) {
        setIsUpdate(true);
        setUserInfo(response?.data.data);
      }
    })();
    return () => {
      setUserInfo({});
      componentMounted.current = false;
    };
  }, []);

  return (
    <>
      <View style={newPostStyles.container}>
        <ModalLargerbase visible={showSuccess}>
          <View style={{ alignItems: "center", marginTop: 150 }}>
            <View style={newPostStyles.header}>
              <TouchableOpacity></TouchableOpacity>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <LottieView
              style={{
                width: 300,
              }}
              source={animationJson}
              autoPlay
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              marginVertical: 30,
              fontSize: 20,
              textAlign: "center",
              marginTop: "-5%",
            }}
          >
            {isUpdate ? "Update" : "Create"} travel request successful!
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate(HOME_NAVIGATOR)}>
            <Text style={newPostStyles.buttonModal}>Go to home</Text>
          </TouchableOpacity>
        </ModalLargerbase>
        {loading ? (
          <AppLoading />
        ) : (
          <View style={newPostStyles.container}>
            <View style={{ height: statusBarHeight }}></View>
            <View style={newPostStyles.header}>
              <TouchableOpacity
                style={newPostStyles.back}
                onPress={() => handleBack()}
              >
                <BackHeader />
              </TouchableOpacity>
              <Text style={newPostStyles.headerText}>
                {isUpdate ? "Edit travel request" : "Create travel request"}
              </Text>
              <View style={{ width: 24, height: "100%" }}></View>
            </View>
            <ProgressBar
              progress={progress}
              color={Color.primary}
              style={{ height: 5 }}
            />
            <View style={newPostStyles.content}>
              {step === 1 && (
                <SelectGender
                  genderSelect={gender}
                  onChange={handleChooseGender}
                />
              )}
              {step === 2 && (
                <SelectTripType
                  value={tripTypeValue}
                  onChange={handleChooseTripType}
                />
              )}
              {step === 3 && (
                <SelectCountry
                  onChange={(value: string) => {
                    setDestination(value);
                  }}
                />
              )}
              {step === 4 && (
                <SelectDate
                  departureDate={departureDate}
                  onChangeDepartureDate={handleSelectDepartureDate}
                  endDate={endDate}
                  onChangeEndDate={handleSelectEndDate}
                />
              )}
              {step === 5 && (
                <DescribeTrip
                  description={description}
                  onChange={handleFillDescription}
                />
              )}

              <View style={newPostStyles.buttonWrapper}>
                <TouchableOpacity
                  style={newPostStyles.continueButton}
                  onPress={() => handleContinue()}
                >
                  <Text style={newPostStyles.buttonText}>{btnText}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <StatusBar style="auto" />
          </View>
        )}
      </View>
    </>
  );
};

export default NewPostScreen;

export const newPostStyles = StyleSheet.create({
  container: {
    height: WINDOW_HEGIHT,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#ffffff",
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
  content: {
    padding: 20,
    flex: 1,
    // justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 0.1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  continueButton: {
    backgroundColor: Color.primary,
    borderRadius: 10,
    padding: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
  },
  buttonModal: {
    fontSize: 18,
    color: "white",
    borderRadius: 3,
    backgroundColor: "#0094FF",
    padding: 10,
    textAlign: "center",
    marginTop: 150,
  },
});
