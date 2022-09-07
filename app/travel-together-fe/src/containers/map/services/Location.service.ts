import Geocoder from "react-native-geocoding";
// import Geolocation from "@react-native-community/geolocation";
// import * as Location from 'expo-location';
// navigator.geolocation = require("@react-native-community/geolocation");r

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (data) => resolve(data.coords),
      (err) => reject(err)
    );
  });
};

export const geocodeLocationByName = (locationName: any) => {
  return new Promise((resolve, reject) => {
    Geocoder.from(locationName)
      .then((json) => {
        const addressComponent = json.results[0].address_components[0];
        resolve(addressComponent);
      })
      .catch((error) => reject(error));
  });
};

export const geocodeLocationByCoords = (lat: any, long: any) => {
  return new Promise((resolve, reject) => {
    Geocoder.from(lat, long)
      .then((json) => {
        const addressComponent = json.results[0].address_components[0];
        resolve(addressComponent);
      })
      .catch((error) => reject(error));
  });
};
