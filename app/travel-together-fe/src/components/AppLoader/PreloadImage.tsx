import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import apploading from "../../../assets/preloadImage.json";

const PreloadImage = () => {
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
            <LottieView
                style={{
                    height: 120,
                    width: 120,
                }}
                source={apploading}
                autoPlay
                resizeMode="contain"
            />
        </View>
    )
}

export default PreloadImage

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000000",
        zIndex: 1,
    },
});