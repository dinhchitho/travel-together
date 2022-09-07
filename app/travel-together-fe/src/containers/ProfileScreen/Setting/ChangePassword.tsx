import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import PhoneInput from "react-native-phone-number-input";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from "firebase/compat/app";
import axios from "axios";
import { BASE_URL } from "../../../utilites";
import navigation from "../../../navigation";
import { firebaseConfig } from "../../../../config";
import { RESET_PASSWORD, SETTING_SCREEN } from "../../../utilites/routerName";
import HeaderCommon from "../../../components/HeaderCommon/HeaderCommon";
import { Controller, useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ApplicationState } from "../../../redux";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const { user, error } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const schema = yup.object().shape({
    currentPassword: yup
      .string()
      .required("Current password is required")
      .min(6, "Please enter at least 6 characters"),
    newPassword: yup
      .string()
      .required("New password is required")
      .min(6, "Please enter at least 6 characters"),
    confirmNewPassword: yup
      .string()
      .required("Confirm password is required")
      .min(6, "Please enter at least 6 characters")
      .oneOf([yup.ref("newPassword")], "Passwords do not match"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    reValidateMode: "onSubmit",
  });

  const submitChange = async (data: any) => {
    console.log("data :", data);
    try {
      const response = await axios.post(
        `${BASE_URL}user/change-password`,
        null,
        {
          params: {
            oldPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
        }
      );
      console.log("response :", response.data);
    } catch (error: any) {
      console.log("error :", error);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <HeaderCommon
          title="Change password"
          leftIcon={"arrow-left"}
          leftNavigation={SETTING_SCREEN}
        />
        <View style={{ padding: 15 }}>
          <Text style={styles.title}>Change Password</Text>
          <Controller
            name="currentPassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Current password"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
                placeholderTextColor="#A09E9E"
              />
            )}
          />
          {errors.currentPassword?.message ? (
            <Text style={styles.error}>{errors.currentPassword?.message}</Text>
          ) : null}
          <Controller
            name="newPassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="New password"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
                placeholderTextColor="#A09E9E"
              />
            )}
          />
          {errors.newPassword?.message ? (
            <Text style={styles.error}>{errors.newPassword?.message}</Text>
          ) : null}

          <Controller
            name="confirmNewPassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Confirm new password"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
                placeholderTextColor="#A09E9E"
              />
            )}
          />
          {errors.confirmNewPassword?.message ? (
            <Text style={styles.error}>
              {errors.confirmNewPassword?.message}
            </Text>
          ) : null}
          <TouchableOpacity onPress={handleSubmit(submitChange)}>
            <Text style={styles.button}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    color: "#0094FF",
  },
  text: {
    marginTop: 15,
    marginBottom: 15,
  },
  input: {
    fontSize: 15,
    borderWidth: 0.5,
    padding: 13,
    width: 345,
    borderRadius: 4,
    backgroundColor: "white",
    borderColor: "#D6D6D6",
    marginTop: 15,
    shadowColor: "white",
  },
  button: {
    fontSize: 18,
    color: "white",
    width: 345,
    height: 50,
    marginTop: 20,
    borderRadius: 3,
    backgroundColor: "#0094FF",
    padding: 10,
    textAlign: "center",
  },
  error: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
    textAlign: "left",
    width: 345,
  },
  textInput: {
    paddingVertical: 0,
    backgroundColor: "white",
    marginLeft: -25,
  },
});
