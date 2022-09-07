import { Dimensions, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { BASE_URL } from "../../../utilites";
interface IProps {
  region: any;
  onRegionChange: Function;
  onPressMarker: Function;
  locationname: any;
}
interface children {
  images: any[]
}
interface dataLocation {
  children: children[];
  createUser: string;
  createdDate: string;
  id: string;
  lastModifiedUser: string;
  lat: any;
  lng: any;
  location: string
  name: string
  updateDttm: string
}

// interface dataBottomSheet {
//   fullName: 
// }

export default function MapViewComponent(props: IProps) {

  // get width height of window
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;

  const LATITUDE_DELTA = 60;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  // data to view marker
  const [datalstLocation, setDatalstLocation] = useState<any>([]);

  // get all them
  const getAllDataLocation = async () => {
    try {
      let detailLocation: any[] = [];
      const response = await axios.get(
        `${BASE_URL}user/blog/getAllByGroup`
      );
      if (response.data.success) {
        // set lsst data 

        detailLocation = response.data.data.map((item: dataLocation) => ({
          location: item.location,
          lat: item.lat,
          lng: item.lng,
          images: item.children.length > 0 && item.children[0].images.length > 0 ? item.children[0].images[0] : 'https://upload.wikimedia.org/wikipedia/commons/f/f2/678111-map-marker-512.png',
        }))

        setDatalstLocation([...detailLocation]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllDataLocation()
  }, [props.region]);

  return (
    <MapView
      style={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
      mapType={"standard"}
      zoomEnabled={true}
      scrollEnabled={true}
      // showsScale={true}
      region={props.region}
      showsUserLocation={true}
      // onRegionChange={(reg) => props.onRegionChange(reg)}
      showsScale={true}
    >
      {/* Check region */}
      {
        props.region && props.locationname != "" && <Marker
          coordinate={props.region}
          onPress={() => props.onPressMarker(props.locationname)}
          title={props.locationname}
        >
          <Image
            resizeMethod="resize"
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/f/f2/678111-map-marker-512.png",
            }}
            style={{ width: 40, height: 40, borderRadius: 10 }}
          ></Image>
        </Marker>
      }
      {/* marker view */}
      {
        datalstLocation && datalstLocation.map((item: any, index: any) => (
          <Marker
            key={index}
            onPress={() => props.onPressMarker(item.location)}
            coordinate={{
              latitude: item.lat,
              latitudeDelta: LATITUDE_DELTA,
              longitude: item.lng,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            anchor={{ x: 0.5, y: 0.40 }}
            title={item.location}
          >
            {
              <Image
                resizeMethod="resize"
                source={{
                  uri: item.images,
                }}
                style={{ width: 40, height: 40, borderRadius: 10 }}
              ></Image>
            }
          </Marker>
        )
        )
      }
    </MapView>
  );
}

const styles = StyleSheet.create({});
