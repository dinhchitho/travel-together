import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import apploading from "../../../assets/loading4.json";

const AppLoading = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView
        style={{
          height: 170,
          width: 170,
        }}
        source={apploading}
        autoPlay
        resizeMode="contain"
      />
    </View>
  );
};

export default AppLoading;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000000",
    zIndex: 1,
  },
});
