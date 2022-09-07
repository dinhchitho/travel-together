import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Color from "../../../utilites/Color";

interface IProps {
  notifyChange: Function;
  dataChange: Function;
  wfull?: boolean;
}

export default function AutoCompleteComponent(props: IProps) {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search here"
      minLength={2} // minimum length of text to search
      textInputProps={{
        autoFocus: false,
        returnKeyType: "search",
        // onFocus: () =>
      }}
      // returnKeyType={"search"} // Can be left out for default return key
      listViewDisplayed={false} // true/false/undefined
      fetchDetails={true}
      onPress={(data, details: any = null) => {
        // 'details' is provided when fetchDetails = true
        // console.log("data:", data);
        // console.log("details", details);
        props.notifyChange(details.geometry.location);
        props.dataChange(details);
      }}
      query={{
        key: "AIzaSyAxBnOggvjy8cJ_3BXc-k4ce-ydzj2sD-Q",
        language: "en",
        // type: ["hospital", "pharmacy", "bakery", "country"],
      }}
      styles={{
        container: {
          position: "absolute",
          marginHorizontal: 10,
          width: props.wfull ? "100%" : Dimensions.get("window").width - 20,
          zIndex: 2,
          top: 30,
          borderRadius: 5,
        },
        listView: { backgroundColor: "white" },
        textInput: { fontSize: 17, borderWidth: 1, borderColor: Color.grey, },
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce={300}
    />
  );
}

const styles = StyleSheet.create({});
