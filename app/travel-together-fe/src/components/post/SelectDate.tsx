import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import BuddyTitle from "./BuddyTitle";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Color from "../../utilites/Color";
import DateTimePicker from "@react-native-community/datetimepicker";
import { WINDOW_WIDTH } from "../../utilites/Dimensions";

interface IProps {
  departureDate: Date;
  onChangeDepartureDate: any;
  endDate: Date;
  onChangeEndDate: any;
}

const SelectDate = (props: IProps) => {
  const { departureDate, onChangeDepartureDate, endDate, onChangeEndDate } =
    props;
  const compareToday = (date: any) => {
    const today = new Date();
    return (
      date.toISOString().split("T")[0] === today.toISOString().split("T")[0]
    );
  };
  const translation = useRef(new Animated.Value(WINDOW_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: 0,
      delay: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  });

  return (
    <>
      <BuddyTitle
        title="When and how long?"
        description="Select department date and trip duration"
        flex={0.15}
      ></BuddyTitle>
      <Animated.View
        style={{
          marginBottom: 10,
          flex: 1,
          transform: [{ translateX: translation }],
        }}
      >
        <View style={styles.dateControl}>
          <Text>Departure date</Text>
          <TouchableOpacity style={styles.departureDateWrapper}>
            <DateTimePicker
              minimumDate={new Date()}
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={departureDate}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChangeDepartureDate}
              style={{ width: 100 }}
            ></DateTimePicker>
            <MaterialIcons name="date-range" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.dateControl}>
          <Text>End date</Text>
          <TouchableOpacity style={styles.departureDateWrapper}>
            <DateTimePicker
              minimumDate={new Date()}
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={endDate}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChangeEndDate}
              style={{
                width: 100,
              }}
            ></DateTimePicker>
            <MaterialIcons name="date-range" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

export default SelectDate;

const styles = StyleSheet.create({
  container: {},
  dateWrapper: {},
  inputContainer: {
    // backgroundColor: 'red',
    flexDirection: "row",
    borderColor: Color.grey,
    borderWidth: 1,
    borderRadius: 4,
    padding: 6,
    gap: 4,
    justifyContent: "space-between",
  },
  input: {
    marginLeft: 10,
  },
  departureDateWrapper: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderBottomColor: Color.grey,
    borderColor: "transparent",
    justifyContent: "space-between",
  },
  dateControl: {
    marginBottom: 10,
    justifyContent: "space-between",
  },
});
