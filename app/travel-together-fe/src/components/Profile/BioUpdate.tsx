import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { globalStyles } from "../../globalStyles";
import Color from "../../utilites/Color";
import { headerStyles } from "../HeaderCommon/HeaderCommon";

interface IProps {
  handleCloseBotttomModal: Function;
  bio: string;
  setBio: Function;
}

const BioUpdate = (props: IProps) => {
  const { handleCloseBotttomModal, bio, setBio } = props;

  const handleCancel = () => {
    handleCloseBotttomModal("bio");
    setBio("");
  };

  return (
    <View style={styles.container}>
      <View style={[headerStyles.header, globalStyles.py15]}>
        <TouchableOpacity
          onPress={() => {
            handleCloseBotttomModal("bio");
          }}
        >
          <Text style={styles.text}>Done</Text>
        </TouchableOpacity>
        <Text style={headerStyles.headerText}>Bio</Text>
        <TouchableOpacity
          onPress={() => {
            handleCancel();
          }}
        >
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 10 }}>
        <TextInput
          multiline={true}
          numberOfLines={4}
          style={styles.bio}
          placeholder="Add a bio about yourself"
          onSubmitEditing={Keyboard.dismiss}
          value={bio}
          onChangeText={(val) => {
            setBio(val);
          }}
        ></TextInput>
      </View>
    </View>
  );
};

export default BioUpdate;

const styles = StyleSheet.create({
  container: {},
  text: {
    color: Color.primary,
    fontSize: 17,
    fontWeight: "500",
  },
  bio: {
    fontSize: 15,
  },
});
