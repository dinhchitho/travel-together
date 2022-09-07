import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Color from "../../utilites/Color";
import { WINDOW_HEGIHT } from "../../utilites/Dimensions";
import { headerStyles } from "../HeaderCommon/HeaderCommon";

import { FontAwesome5 } from "@expo/vector-icons";
import { globalStyles } from "../../globalStyles";

interface IProps {
  handleCloseBotttomModal: Function;
  interests: any[];
  setInterests: Function;
}


const INTEREST_LIST = [
  {
    id: 1,
    name: "Adventure",
    imageUrl: require('../../../assets/advanture.jpg'),
  },
  {
    id: 2,
    name: "Photography",
    imageUrl: require('../../../assets/photograp.jpg'),
  },
  {
    id: 3,
    name: "Travel Blogging",
    imageUrl: require('../../../assets/travelblog.jpg'),
  },
  {
    id: 4,
    name: "Solo Travel",
    imageUrl: require("../../../assets/solo_travel.jpg"),
  },
  {
    id: 5,
    name: "Party",
    imageUrl: require("../../../assets/party.jpg"),
  },
  {
    id: 6,
    name: "Food & Cuisine",
    imageUrl: require("../../../assets/food.jpg"),
  },
];

const removeFromArray = (array: number[], value: number) => {
  var idx = array.indexOf(value);
  if (idx !== -1) {
    array.splice(idx, 1);
  }
  return array;
};

const InterestsUpdate = (props: IProps) => {
  const { handleCloseBotttomModal, interests, setInterests } = props;

  const handleCancel = () => {
    handleCloseBotttomModal("interest");
    setInterests([]);
  };

  return (
    <View>
      <View style={[headerStyles.header, globalStyles.py15]}>
        <TouchableOpacity
          onPress={() => {
            handleCloseBotttomModal("interest");
          }}
        >
          <Text style={styles.text}>Done</Text>
        </TouchableOpacity>
        <Text style={headerStyles.headerText}>Your interests</Text>
        <TouchableOpacity
          onPress={() => {
            handleCancel();
          }}
        >
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 580 }}>
        <ScrollView>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>
              Select the things you're interested in and we'll make sure you see
              more of it!
            </Text>
            <Text style={styles.textUnder}>You can update these later</Text>
          </View>
          <View style={styles.interestWrapper}>
            {INTEREST_LIST.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  let itemExist = interests.find((e) => e.name === item.name);
                  itemExist
                    ? setInterests([...removeFromArray(interests, itemExist)])
                    : setInterests([...interests, item]);
                }}
                style={[styles.itemWrapper]}
              >
                <Image
                  style={[styles.image]}
                  source={item.imageUrl}
                ></Image>
                <View style={[styles.titleImage]}>
                  <Text style={styles.interestName}>{item.name}</Text>
                </View>
                {interests.find((e) => e.name === item.name) ? (
                  <View style={styles.activeItem}>
                    <FontAwesome5 name="check" size={70} color={Color.white} />
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default InterestsUpdate;

const styles = StyleSheet.create({
  container: {},
  text: {
    color: Color.primary,
    fontSize: 17,
    fontWeight: "500",
  },
  titleWrapper: {
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 10,
  },
  title: {
    width: 290,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
  },
  interestWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  interestName: {
    textAlign: "center",
    color: Color.white,
    fontWeight: "500",
  },
  textUnder: {
    fontSize: 12,
    paddingTop: 5,
    color: Color.text_grey,
  },
  itemWrapper: {
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    resizeMode: "cover",
  },
  titleImage: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#8a6956",
    width: "100%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 12,
  },
  activeItem: {
    backgroundColor: "rgba(52, 52, 52, 0.7)",
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
