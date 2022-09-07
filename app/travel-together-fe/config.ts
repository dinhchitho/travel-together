import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/firestore";
// import "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth/react-native";
export const firebaseConfig = {
  // apiKey: 'AIzaSyApGoaZVtoVTYnftHSbT9l7nDmDVUYJYpU',
  //   authDomain: 'playground-d4e7b.firebaseapp.com',
  //   databaseURL: 'https://playground-d4e7b.firebaseio.com',
  //   projectId: 'playground-d4e7b',
  //   storageBucket: 'playground-d4e7b.appspot.com',
  //   messagingSenderId: '903405300293',
  //   appId: '1:903405300293:web:c55227a2b8064da05d112c',

  // apiKey: "AIzaSyBTBAkBzi20bYwyH4vV_eyEQLNtggIASfM",
  // authDomain: "travel-together-353406.firebaseapp.com",
  // databaseURL:
  //   "https://travel-together-353406-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "travel-together-353406",
  // storageBucket: "travel-together-353406.appspot.com",
  // messagingSenderId: "62931611428",
  // appId: "1:62931611428:web:60f78160aeff10a5c4cdb1",
  // measurementId: "G-XC2SVTN91T",

  apiKey: "AIzaSyCHNZ_u7jWdD-1z3Wda3nNkh8Gxufj6uoM",
  authDomain: "travel-together-353406.firebaseapp.com",
  databaseURL:
    "https://travel-together-353406-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "travel-together-353406",
  storageBucket: "travel-together-353406.appspot.com",
  messagingSenderId: "62931611428",
  appId: "1:62931611428:web:60f78160aeff10a5c4cdb1",
  measurementId: "G-XC2SVTN91T",
};

if (!firebase.apps.length) {
  const defaultApp = firebase.initializeApp(firebaseConfig);
  initializeAuth(defaultApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export default firebase;
