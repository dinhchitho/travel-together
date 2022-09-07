import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Animated,
} from "react-native";
import Color from "../../utilites/Color";
import { WINDOW_WIDTH } from "../../utilites/Dimensions";
import BuddyTitle from "./BuddyTitle";

interface IProps {
  description: string;
  onChange: Function;
}

const DescribeTrip = (props: IProps) => {
  const { description, onChange } = props;

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
        flex={0.2}
        title="Describe your ideal trip"
        description="Tell us more about yourself, your planned journey and about fellow traveler you looking for to find"
      ></BuddyTitle>
      <Animated.View
        style={{
          flex: 1,
          paddingBottom: 20,
          transform: [{ translateX: translation }],
        }}
      >
        <TextInput
          multiline={true}
          numberOfLines={4}
          style={styles.description}
          placeholder="Tell us more about yourself, your planned journey and about fellow traveler you looking for to find"
          onSubmitEditing={Keyboard.dismiss}
          value={description}
          onChangeText={(value) => {
            onChange(value);
          }}
        ></TextInput>
      </Animated.View>
    </>
  );
};

export default DescribeTrip;

const styles = StyleSheet.create({
  container: {},
  descriptionWrapper: {},
  description: {
    borderColor: Color.grey,
    borderWidth: 1,
    borderRadius: 4,
    height: "100%",
  },
});
