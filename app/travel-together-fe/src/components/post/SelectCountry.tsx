import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import Color from "../../utilites/Color";
import BuddyTitle from "./BuddyTitle";

import { FontAwesome5 } from "@expo/vector-icons";

import axios from "axios";

import { COUNTRIES, GENDER } from "../../api/Const";
import { WINDOW_WIDTH } from "../../utilites/Dimensions";
import AutoCompleteComponent from "../../containers/map/components/AutoCompleteComponent";

interface IProps {
  onChange: Function;
}

const SelectCountry = (props: IProps) => {
  const { onChange } = props;

  const translation = useRef(new Animated.Value(WINDOW_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: 0,
      delay: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  });

  const getCoordsFromName = () => {};

  const getDetailData = (item: any) => {
    if (item.formatted_address) {
      onChange(item.formatted_address);
    }
  };

  useEffect(() => {
    onChange(null);
    return () => {};
  }, []);

  return (
    <>
      <BuddyTitle
        title="Planned destination"
        description="Select one destination you plan to visit"
        flex={0.15}
      ></BuddyTitle>
      <Animated.View
        style={{
          flex: 0.8,
          transform: [{ translateX: translation }],
        }}
      >
        {/* <View style={styles.inputContainer}>
          <FontAwesome5 name="search-location" size={24} color="black" />
          <TextInput
            style={styles.input}
            onChangeText={(keyword) => {
              handleOnChangeKeyword(keyword);
            }}
            value={keyword}
            placeholder="Tap to search"
          />
        </View>
        <ScrollView style={styles.countriesWrapper}>
          {countries.map((item: any, index: number) => (
            <CountryItem
              key={index}
              name={item.name.common}
              flat_url={item.flags.png}
              keyword={keyword}
              onPress={() => {
                onChange(item.name.common);
                handleChooseCountry(item.name.common);
              }}
            ></CountryItem>
          ))}
        </ScrollView> */}
        <View style={{ marginLeft: -20 }}>
          <AutoCompleteComponent
            notifyChange={(loc: any) => getCoordsFromName()}
            dataChange={(item: any) => getDetailData(item)}
            wfull={true}
          />
        </View>
      </Animated.View>
    </>
  );
};

export default SelectCountry;

interface ContryItemProps {
  flat_url: string;
  name: string;
  keyword: string;
  onPress: any;
}

export const CountryItem = (props: ContryItemProps) => {
  const { flat_url, name, onPress, keyword } = props;

  return (
    <TouchableOpacity style={styles.countriesWrapper} onPress={onPress}>
      <View style={styles.countriesContainer}>
        <Image style={styles.flatImage} source={{ uri: flat_url }} />
        <View style={styles.titleWrapper}>
          <Text style={keyword === name ? styles.textBold : null}>{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    flexDirection: "row",
    borderColor: Color.grey,
    borderWidth: 1,
    borderRadius: 4,
    padding: 6,
    gap: 4,
  },
  input: {
    width: "100%",
    marginLeft: 10,
  },
  inputWrapper: {
    flex: 0.8,
  },
  countriesWrapper: {
    // paddingTop: 10,
  },
  countriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    borderBottomColor: Color.grey,
    paddingVertical: 10,
  },
  flatImage: {
    width: 35,
    height: 25,
  },
  titleWrapper: {
    marginLeft: 10,
  },
  textBold: {
    fontWeight: "bold",
  },
});
