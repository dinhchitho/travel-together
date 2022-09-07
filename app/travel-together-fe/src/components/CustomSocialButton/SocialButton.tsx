import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import firebase from "../../../config";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

import * as GoogleAuthentication from 'expo-google-app-auth';
import axios from 'axios';
import { BASE_URL } from '../../utilites';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState, onLoginExternal } from '../../redux';
import { string } from 'yup/lib/locale';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AppLoading from '../AppLoader/AppLoading';
interface IuserData {
  type: string,
  data: any
}
const typeOfLogin = { FACEBOOK: "FACEBOOK", GOOGLE: "GOOGLE", APPLE: "APPLE" };

WebBrowser.maybeCompleteAuthSession();

const SocialSignInButtons = () => {

  const dispatch = useDispatch();

  const [userData, setUserData] = useState<IuserData>({
    type: '',
    data: null
  });

  const [isLoading, setIsLoading] = useState(false);

  const [accessToken, setAccessToken] = useState<any>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "6450001473-e8g16d2j9knniv7n1a730613s71gkim8.apps.googleusercontent.com",
    iosClientId: "6450001473-f27rh7b1kjrn6ntm6035i1e4q6lehviq.apps.googleusercontent.com",
    scopes: ['profile', 'email'],
  });

  const { user, error } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  useEffect(() => {
    if (userData && userData.data) {
      // set loading
      setIsLoading(true);
      switch (userData.type) {
        case typeOfLogin.APPLE:
          let userLogin = {
            username: userData.data.uid,
            fullName: '',
            email: '',
            avatar: userData.data.photoURL ? userData.data.photoURL : '',
            phone: userData.data.phoneNumber
          }
          loginExternal(userLogin.username, userLogin.fullName, userLogin.email, userLogin.avatar, userLogin.phone);
          break;
        case typeOfLogin.FACEBOOK:
          let userLoginFacebook = {
            username: userData.data.id,
            fullName: userData.data.name,
            email: userData.data.email,
            avatar: userData.data.picture.data.url,
            phone: ''
          }
          loginExternal(userLoginFacebook.username, userLoginFacebook.fullName, userLoginFacebook.email, userLoginFacebook.avatar, userLoginFacebook.phone);
          break;
        case typeOfLogin.GOOGLE:
          // code block
          let userLoginGoogle = {
            username: userData.data.id,
            fullName: userData.data.name,
            email: userData.data.email,
            avatar: userData.data.picture,
            phone: ''
          };
          loginExternal(userLoginGoogle.username, userLoginGoogle.fullName, userLoginGoogle.email, userLoginGoogle.avatar, userLoginGoogle.phone);
          break;
        default:
        // code block
      }
    }
  }, [userData])

  // login external
  const loginExternal = (username: string, fullName: string, email: string, avatar: string, phone: string) => {
    dispatch<any>(onLoginExternal(username, fullName, email, avatar, phone));
    if (error) {
      setIsLoading(false);
      Alert.alert(
        "Error",
        //body
        `${error}`,
        [
          {
            text: 'OK', onPress: () => console.log("OK")
          },
        ],
        { cancelable: true },
      );
    }
  }

  // get user data google
  useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication?.accessToken);
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken])

  //fetch data google
  async function fetchUserInfo() {
    await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then(response => response.json())
      .then(data => {
        setUserData({ type: typeOfLogin.GOOGLE, data: data });
      })
  }

  // useEffect(() => {
  //   const subscriber = onAuthStateChanged(getAuth(), (user) => {
  //     if (user) {
  //       setUserData({type: typeOfLogin.APPLE, data: user})
  //     } else {
  //       console.log("signed out");
  //     }
  //   });
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  // get login facebook
  const onSignInFacebook = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '735907774389905',      // enter app id here
      });
      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });
      if (result.type === 'success') {
        // await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        // We are using facebook graph api
        fetch(`https://graph.facebook.com/me?access_token=${result.token}&fields=id,name,email,picture.height(500)`)
          .then(response => response.json())
          .then(data => {
            setUserData({ type: typeOfLogin.FACEBOOK, data: data });
          })
          .catch(e => console.log(e))
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  // const onSignInGoogle = async () => {
  //   GoogleAuthentication.logInAsync({
  //     androidStandaloneAppClientId: 'ANDROID_STANDALONE_APP_CLIENT_ID',
  //     iosStandaloneAppClientId: 'IOS_STANDALONE_APP_CLIENT_ID',
  //     scopes: ['profile', 'email']
  //   })
  //     .then((logInResult) => {
  //       if (logInResult.type === 'success') {
  //         const { idToken, accessToken } = logInResult;
  //         const credential = firebase.auth.GoogleAuthProvider.credential(
  //           idToken,
  //           accessToken
  //         );

  //         return firebase.auth().signInWithCredential(credential);
  //         // Successful sign in is handled by firebase.auth().onAuthStateChanged
  //       }
  //       return Promise.reject(); // Or handle user cancelation separatedly
  //     })
  //     .catch((error) => {
  //       // ...
  //     });
  // };

  const onSignInApple = () => {
    const nonce = Math.random().toString(36).substring(2, 10);

    return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
      .then((hashedNonce) =>
        AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL
          ],
          nonce: hashedNonce
        })
      )
      .then((appleCredential) => {
        const { identityToken } = appleCredential;
        const provider = new firebase.auth.OAuthProvider('apple.com');
        const credential = provider.credential({
          idToken: identityToken!,
          rawNonce: nonce
        });
        firebase.auth().signInWithCredential(credential).then(data => {
          if (data.user) {
            setUserData({ type: typeOfLogin.APPLE, data: data.user })
          } else {
            Alert.alert(
              "Không có user",
              //body
              `Không có user`,
              [
                {
                  text: 'OK', onPress: () => console.log("OK")

                },
              ],
              { cancelable: true },
            );
          }
        })
        // onAuthStateChanged(getAuth(), (user) => {
        //   console.log('user', user);

        //   if (user) {
        //     setUserData({ type: typeOfLogin.APPLE, data: user })
        //   } else {
        //     Alert.alert(
        //       "Không có user",
        //       //body
        //       `Không có user`,
        //       [
        //         {
        //           text: 'OK', onPress: () => console.log("OK")

        //         },
        //       ],
        //       { cancelable: true },
        //     );
        //   }
        // });
        // Successful sign in is handled by firebase.auth().onAuthStateChanged
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          //body
          `${error}`,
          [
            {
              text: 'OK', onPress: () => console.log("OK")

            },
          ],
          { cancelable: true },
        );
      });
  };

  return (
    <>
      {
        isLoading == true ? <AppLoading /> : <></>
      }
      <View style={
        {
          flexDirection: "row",
          alignContent: "space-between"
        }
      }>
        <TouchableOpacity
          style={styles.outlineFacebook} onPress={onSignInFacebook}>
          <FontAwesome style={styles.text} name="facebook-f" size={24} color="#3B5998" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineGoogle} onPress={() => promptAsync()}>
          <AntDesign style={styles.text} name="googleplus" size={24} color="#DD4B39" />
        </TouchableOpacity>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={5}
          style={styles.outlineApple}
          onPress={onSignInApple}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  outlineFacebook: {
    margin: 8,
    borderWidth: 1,
    padding: 10,
    width: 48,
    height: 48,
    borderColor: '#3B5998',
    borderRadius: 3
  },
  outlineGoogle: {
    margin: 8,
    borderWidth: 1,
    padding: 10,
    width: 48,
    height: 48,
    borderColor: '#DD4B39',
    borderRadius: 3
  },
  outlineApple: {
    margin: 8,
    borderWidth: 1,
    padding: 10,
    width: 48,
    height: 48,
    borderColor: 'black',
    borderRadius: 3
  },
  text: {
    textAlign: 'center'
  }
});

export default SocialSignInButtons;
