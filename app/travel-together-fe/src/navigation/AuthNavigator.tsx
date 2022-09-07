import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  LOGIN,
  REGISTER,
  SPLASH,
  FORGOTPASS,
  OTPSCREEN,
  RESET_PASSWORD,
} from "../utilites/routerName";
import SignInScreen from "../containers/SignInScreen/SignInScreen";
import SignUpScreen from "../containers/SignUpScreen/SignUpScreen";
import SplashScreen from "../containers/SplashScreen/Splash";
import ForgotPassword from "../containers/ForgotPasswordScreen/ForgotPassword";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import AlertComponent from "../components/Alert/AlertComponent";
import ResetPassword from "../containers/ResetPasswordScreen/ResetPassword";

const AuthNavigator = () => {
  const AuthStack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={LOGIN}
    >
      {/* <AuthStack.Screen name={SPLASH} component={SplashScreen} /> */}
      <AuthStack.Screen name={LOGIN} component={SignInScreen} />
      <AuthStack.Screen name={REGISTER} component={SignUpScreen} />
      <AuthStack.Screen
        name={FORGOTPASS}
        component={ForgotPassword}
        options={{
          headerLeft: (props) => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerShown: true,
          headerTitle: "",
          headerShadowVisible: false, // applied here
        }}
      />
      <AuthStack.Screen
        name={RESET_PASSWORD}
        component={ResetPassword}
        options={{
          headerLeft: (props) => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerShown: true,
          headerTitle: "",
          headerShadowVisible: false, // applied here
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
