import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import apploadings from "../../../assets/preskeletonProfile.json";

const LoadingProfile = () => {
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
            <LottieView
                style={{
                    height: 170,
                    width: 170,
                }}
                source={apploadings}
                autoPlay
                resizeMode="contain"
            />
        </View>
    );
};

export default LoadingProfile;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000000",
        zIndex: 1,
    },
});
