import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Constants from "expo-constants";
import MapViewContainer from "./containers/MapViewContainer";

export default function MapTravelRequest() {
  return (
    <View style={styles.container}>
      {/* <MapViewContainer /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // paddingTop: Constants.statusBarHeight,
  },
});
