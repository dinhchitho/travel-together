import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import Color from "../../utilites/Color";
import { GENDER } from "../../api/Const";
import { WINDOW_HEGIHT, WINDOW_WIDTH } from "../../utilites/Dimensions";
import TripTypeIcon from "../../components/post/TripTypeIcon";
import CustomSlide from "../../components/custom/CustomSlide";
import CustomInput from "../../components/custom/CustomInput";

import DateTimePicker from "@react-native-community/datetimepicker";
import HeaderCommon from "../../components/HeaderCommon/HeaderCommon";

import Constants from "expo-constants";
import { HOME_NAVIGATOR, NEW_POST, POST_LIST } from "../../utilites/routerName";
import { globalStyles } from "../../globalStyles";
import { useNavigation } from "@react-navigation/native";

const statusBarHeight = Constants.statusBarHeight;

interface IProps {}

const SearchPostScreen = (props: IProps) => {
  const navigation = useNavigation<any>();

  const [gender, setGender] = useState<string>("Both");
  const [minAge, setMinAge] = useState<number>(0);
  const [maxAge, setMaxAge] = useState<number>(99);
  const [country, setCountry] = useState<string>();
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const navigateToHome = () => {
    navigation.navigate(POST_LIST, {
      gender: gender,
      minAge: minAge,
      maxAge: maxAge,
      country: country,
      departureDate: departureDate.toDateString(),
      endDate: endDate.toDateString(),
    });
  };

  return (
    <View>
      <View style={{ height: statusBarHeight }}></View>
      <HeaderCommon
        title="Search post"
        leftIcon={"arrow-left"}
        leftNavigation={POST_LIST}
      ></HeaderCommon>
      <View style={styles.content}>
        <View>
          <View style={styles.controlWrapper}>
            <Text style={styles.titleText}>Filter by gender</Text>
            <View style={styles.genderWrapper}>
              {GENDER?.length &&
                GENDER.map((item) => (
                  <TouchableOpacity
                    onPress={() => setGender(item.name)}
                    key={item.id}
                    style={
                      gender === item.name ? styles.genderActive : styles.gender
                    }
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
          <View style={styles.controlWrapper}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.titleText}>Filter by age</Text>
              <Text>{`${minAge} - ${maxAge}`}</Text>
            </View>
            <CustomSlide
              minAge={minAge}
              maxAge={maxAge}
              setMinAge={(val: number) => setMinAge(val)}
              setMaxAge={(val: number) => setMaxAge(val)}
            ></CustomSlide>
          </View>
          <View>
            <View style={styles.controlWrapper}>
              <Text style={styles.titleText}>Filter by location</Text>
              <CustomInput
                value={country}
                onChange={(val: string) => setCountry(val)}
                placeholder="wite a location..."
              ></CustomInput>
            </View>
            <View style={styles.controlWrapper}>
              <Text style={styles.titleText}>Filter by date</Text>
              <View style={{ paddingHorizontal: 5 }}>
                <Text>Departure date</Text>
                <View style={globalStyles.dateWrapper}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={departureDate}
                    mode={"date"}
                    is24Hour={true}
                    display="default"
                    onChange={(e: any, val: any) => {
                      setDepartureDate(val);
                    }}
                    style={{
                      width: 100,
                    }}
                  ></DateTimePicker>
                </View>
                <Text>End date</Text>
                <DateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  value={endDate}
                  mode={"date"}
                  is24Hour={true}
                  display="default"
                  onChange={(e: any, val: any) => {
                    setEndDate(val);
                  }}
                  style={{
                    width: 100,
                  }}
                ></DateTimePicker>
              </View>
            </View>
            {/* <View
              style={{
                width: WINDOW_WIDTH - 30,
                height: 400,
                backgroundColor: Color.white,
                position: 'absolute',
                top: 75,
              }}
            ></View> */}
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={() => navigateToHome()}
          >
            <Text style={styles.buttonText}>Apply filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SearchPostScreen;

interface SearchItemTitleProps {
  icon?: string;
  label: string;
}

const styles = StyleSheet.create({
  content: {
    height: WINDOW_HEGIHT - statusBarHeight - 45,
    paddingHorizontal: 15,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioWrapper: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingLeft: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "500",
    paddingLeft: 5,
    marginBottom: 5,
  },

  genderWrapper: {
    height: 45,
    borderWidth: 1,
    borderColor: "#909293",
    borderRadius: 8,
    flexDirection: "row",
  },
  gender: {
    width: (WINDOW_WIDTH - 33) / 3,
    justifyContent: "center",
    alignItems: "center",
  },
  genderActive: {
    // flex: 1 / 3,
    width: (WINDOW_WIDTH - 36) / 3,
    // top: -2,
    // left: -2,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Color.primary,
    borderWidth: 1,
    borderRadius: 7,
  },
  controlWrapper: {
    borderColor: "transparent",
    borderWidth: 1,
    borderBottomColor: "#ECEDEE",
    paddingVertical: 10,
  },
  buttonWrapper: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
});
