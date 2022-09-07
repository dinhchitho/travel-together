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
import { firebaseConfig } from "../../../config";
import firebase from "firebase/compat/app";
import axios from "axios";
import { BASE_URL } from "../../utilites";
import { RESET_PASSWORD } from "../../utilites/routerName";

const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const [userId, setUserId] = React.useState("");

  const phoneInput = React.useRef(null);

  const [isSend, setIsSend] = useState<boolean>(false);

  const navigation = useNavigation<any>();

  // otp
  const [code, setCode] = useState("");

  const [verificationId, setVerificationId] = useState<any>(null);

  // recapcha for otp
  const recaptchaVerifier = useRef<any>(null);

  // set animation loading
  const [otpresponseLoading, setOtpresponseLoading] = useState(false);

  const sendOtp = async () => {
    try {
      // check phone exits
      const phoneNew = phoneNumber.slice(1);
      const res = await axios.get(BASE_URL + `send-otp?phone=${phoneNew}`);
      // check data success
      if (res.data.success) {
        // send otp
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(
          phoneNumber,
          recaptchaVerifier.current
        );
        setVerificationId(verificationId);
        // check verificaiton id have or not
        if (verificationId) {
          // re-render giao diện
          setIsSend(true);
          setUserId(res.data.data);
        }
      } else {
        Alert.alert(
          "Error",
          //body
          `Phone number is not exits!`,
          [
            {
              text: "OK",
              onPress: () => console.log("OK"),
            },
          ],
          { cancelable: true }
        );
      }
    } catch (err) {
      Alert.alert(
        "Error",
        //body
        `${err}`,
        [
          {
            text: "OK",
            onPress: () => console.log("OK"),
          },
        ],
        { cancelable: true }
      );
    }
  };

  // c
  const onContinueHandlePress = (): void => {
    if (code.length == 6) {
      setOtpresponseLoading(true);
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
      );
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(() => {
          setCode("");
          if (userId) {
            navigation.navigate(RESET_PASSWORD, { userId });
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      {isSend ? (
        <View style={[styles.container, { marginTop: 50 }]}>
          <View style={styles.layout}>
            <Text style={styles.title}>Verification code</Text>
            <Text style={[styles.text, { marginTop: 15 }]}>
              Please type the verification code sent to your phone number
            </Text>
          </View>
          <KeyboardAvoidingView>
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <OTPInputView
                style={{ width: "90%", height: 40 }}
                pinCount={6}
                codeInputHighlightStyle={{
                  borderBottomColor: "#000",
                  color: "#000",
                  borderBottomWidth: 1,
                  borderWidth: 1,
                }}
                codeInputFieldStyle={{
                  color: "#000",
                  borderBottomColor: "#000",
                  borderBottomWidth: 1,
                  borderWidth: 1,
                }}
                onCodeChanged={(code) => {
                  setCode(code);
                }}
              />
            </View>
          </KeyboardAvoidingView>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {code.length !== 6 ? (
              <TouchableOpacity
                style={{
                  backgroundColor: "#C0C0C0",
                  width: 250,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginTop: "10%",
                }}
                disabled={true}
              >
                <Text style={{ color: "white", fontSize: 18 }}>Continue</Text>
              </TouchableOpacity>
            ) : otpresponseLoading == true ? (
              <ActivityIndicator
                size="large"
                color="#FE017E"
                style={{ marginTop: "10%" }}
              />
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#0094FF",
                  width: 250,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginTop: "10%",
                }}
                onPress={() => onContinueHandlePress()}
              >
                <Text style={{ color: "white", fontSize: 18 }}>Continue</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
          />
          <View style={styles.layout}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.text}>
              Enter the phone number associated with your account and we’ll send
              an phone number with verification code to reset your password.
            </Text>
          </View>
          <PhoneInput
            ref={phoneInput}
            defaultValue={phoneNumber}
            containerStyle={styles.input}
            textContainerStyle={styles.textInput}
            onChangeFormattedText={(text) => {
              setPhoneNumber(text);
            }}
            defaultCode="VN"
            layout="first"
            withShadow
            autoFocus
          />
          <TouchableOpacity onPress={sendOtp}>
            <Text style={styles.button}>Reset Password</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  layout: {
    width: 345,
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
    fontSize: 11,
    color: "red",
    marginTop: 5,
    marginBottom: 0,
    marginLeft: 36,
    marginRight: 36,
    textAlign: "left",
    width: 345,
  },
  textInput: {
    paddingVertical: 0,
    backgroundColor: "white",
    marginLeft: -25,
  },
});
