import * as React from "react";
import { Dimensions, StyleSheet, Text, View, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import { WINDOW_WIDTH } from "../../utilites/Dimensions";

const MapYotsuba = () => {
  const [region, setRegion] = React.useState<any>({
    region: {
      latitude: 16.047079,
      longitude: 108.20623,
    },
  });

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search here"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: "AIzaSyBUknN6UjE2rzChSaeIzU6xh5NTqc3IFz0",
          language: "en",
        }}
        fetchDetails={true}
        listViewDisplayed={true}
        currentLocation={true}
        styles={{
          container: {
            flex: 0,
            position: "absolute",
            marginHorizontal: 10,
            width: WINDOW_WIDTH - 20,
            zIndex: 1,
            top: 50,
          },
          listView: { backgroundColor: "white" },
          textInput: { fontSize: 17 },
        }}
      />
      <MapView
        initialRegion={{
          latitude: 16.047079,
          longitude: 108.20623,
          latitudeDelta: 13.32,
          longitudeDelta: 12.23,
        }}
        style={styles.map}
        //provider="google"
        mapType={"standard"}
        //  region={region}
        zoomEnabled={true}
        scrollEnabled={true}
        showsScale={true}
      >
        <Marker
          coordinate={{
            latitude: 15.880880182148788,
            longitude: 108.33845953594738,
          }}
          image={{
            uri: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
            height: 50,
            width: 50,
          }}
        >
          <View style={{ width: 25, height: 25 }}>
            <Image
              source={{
                uri: "https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.6435-9/103281473_1159481161072071_4450593487129676400_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=e3f864&_nc_ohc=alClgMXoN5MAX8m4agC&_nc_ht=scontent.fsgn2-3.fna&oh=00_AT-yMFDcbYfQCNhKKh_AeRz3WBkMDpcTzhDwz9ff2tnrEw&oe=62EAD8C2",
              }}
              style={{ width: 25, height: 25, resizeMode: "contain" }}
            ></Image>
          </View>
        </Marker>
        <Marker
          coordinate={{
            latitude: 15.968642869550672,
            longitude: 108.26138020051884,
          }}
          title={"100"}
          image={{
            uri: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
          }}
        />
        <Marker
          coordinate={{
            latitude: 21.02924683292903,
            longitude: 105.83612178830947,
          }}
          image={{
            uri: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
          }}
        />
      </MapView>
    </View>
  );
};

export default MapYotsuba;

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // paddingBottom: Dimensions.get('window').height,
    // flex: 1,
    // alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
    // marginTop: 20,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
