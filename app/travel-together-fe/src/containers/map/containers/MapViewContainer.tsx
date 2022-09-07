import { Dimensions, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AutoCompleteComponent from "./../components/AutoCompleteComponent";
import MapViewComponent from "./../components/MapViewComponent";
import {
  getLocation,
  geocodeLocationByCoords,
} from "./../services/Location.service";
import * as Location from "expo-location";
import { useIsFocused } from "@react-navigation/native";
import BottomModal, { BottomSheetRefProps } from "../../../components/custom/BottomModal";
import GroupBlog from "../components/GroupBlog";
import { WINDOW_HEGIHT, WINDOW_WIDTH } from "../../../utilites/Dimensions";
import BottomSheet from 'reanimated-bottom-sheet';
import ItemBlogOnMaps from "../components/ItemBlogOnMaps";
import Animated from "react-native-reanimated";
import Color from "../../../utilites/Color";
import { ScrollView } from "react-native-gesture-handler";
import { globalStyles } from "../../../globalStyles";
import axios from "axios";
import { BASE_URL } from "../../../utilites";
import AppLoading from "../../../components/AppLoader/AppLoading";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../../redux";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingMap from "../../../components/AppLoader/LoadingMap";

interface IProps {
  index: number;
}

// const MapViewContainer = (props: IProps) => {
const MapViewContainer = () => {

  // const { index } = props;

  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;

  const LATITUDE_DELTA = 60;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [region, setRegion] = React.useState<any>({
    latitude: 15.8775027,
    longitude: 108.3300186,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });


  const [errorMsg, setErrorMsg] = React.useState<any>(null);
  const [closeModal, setCloseModal] = React.useState<any>(false);

  // loading bottom sheet
  const [loadingBottomSheet, setLoadingBottomSheet] = React.useState<any>(false);

  const [loadingMap, setLoadingMap] = React.useState<any>(false);

  const sheetRef = React.useRef<any>(null);
  const fall = new Animated.Value(1);

  const { userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  // focus on tab
  const isFocused = useIsFocused();

  const [onBlogTab, setOnBlogTab] = useState<boolean>(true);

  const [locationName, setLocationName] = useState<string>('');

  const [renderMap, setRenderMap] = useState<number>();

  // data show on bottom sheet
  const [dataShow, setDataShow] = useState<any[]>([]);


  // data blog and ads
  const [dataBlogAds, setDataBlogAds] = useState<any[]>([]);

  // data qa
  const [dataQa, setDataQa] = useState<any[]>([]);

  // React.useEffect(() => {
  //   if (index == 1) {
  //     setRenderMap(1);
  //   }
  //   getInitialState();
  // }, [index]);

  const onMapRegionChange = (region: any) => {
    setRegion(region);
  };

  const getCoordsFromName = (loc: any) => {
    setRegion({
      latitude: loc.lat,
      longitude: loc.lng,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const getInitialState = () => {
    // getLocation().then((data: any) => {
    //   setRegion({
    //     latitude: data.lat,
    //     longitude: data.lng,
    //     latitudeDelta: 0.003,
    //     longitudeDelta: 0.003,
    //   });
    // });

  };

  const getDetailData = (data: any) => {
    setLocationName(data.formatted_address);
  }

  const onPressMaker = (data: any) => {
    if (data) {
      Keyboard.dismiss();
      setDataShow([]);
      setDataQa([]);
      setDataBlogAds([]);
      getAllData(data);
      setCloseModal(true);
      setOnBlogTab(true);

      sheetRef.current.snapTo(0)
    }
  }

  useEffect(() => {
    // if (index == 1) {
    (async () => {
      setLoadingMap(true);
      // reset when rerender
      sheetRef.current.snapTo(2);
      setCloseModal(false);
      // end reset
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let locations = await Location.getCurrentPositionAsync({});

      if (locations && locations.coords) {
        setRegion({
          latitude: locations.coords.latitude,
          longitude: locations.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      }
      setLoadingMap(false)
    }
    )();
    // }
  }, []);

  // sort date time
  const dateSortDesc = (array: any[]) => {
    array.sort(
      (a: any, b: any) =>
        Number(new Date(b.dateCreate)) -
        Number(new Date(a.dateCreate))
    );
    return array;
  };

  const getAllData = async (location: string) => {
    encodeURIComponent('+')
    let newLocation = location.replace(/\+/g, "%2B")
    setLoadingBottomSheet(true);

    // init array
    let resultBlog: any[] = [];
    let resultQas: any[] = [];
    let resultAds: any[] = [];

    try {
      const response = await axios.get(
        `${BASE_URL}user/blog/getAllByGroupLocation?location=${newLocation}`
      );

      if (response.data.success) {
        // set list data blog and ads
        resultBlog = response.data.data.children &&
          response.data.data.children.map((el: any) => (
            {
              // if (userCurrent.blackListedUsers.filter((elCurent: any) => elCurent.id == el.createUser).length <= 0) {
              avatar: el.avt,
              fullName: el.fullName,
              images: el.images,
              dateCreate: el.createdDate,
              id: el.id,
              content: el.content,
              type: "BLOG",
              ban: el.ban,
              createdUser: el.userIdCreated
              // }
            }
          ))
      }
    } catch (error) {
      console.log('result blog', error);
    }

    try {
      const response2 = await axios.get(
        `${BASE_URL}user/getAllAdsByLocation?location=${newLocation}`
      );
      // set data for ADS
      if (response2.data.success) {
        response2.data.data.forEach((el: any) => {
          if (el.ads && el.ads.length > 0 && userCurrent.blackListedUsers.filter((elCurent: any) => elCurent.id == el.id).length <= 0) {
            resultAds = el.ads.map((item: any) => (
              {
                avatar: el.avatar,
                fullName: el.fullName,
                images: item.images,
                dateCreate: item.createdDate,
                id: item.id,
                content: item.content,
                type: "ADS",
                isLocalGuide: el.localGuide,
                ban: item.ban,
                createdUser: el.id
                // arr.push(convertDataADS);
              }
            ));
          }
        })
      }
    } catch (error) {
      console.log('result ads', error);
    }
    setDataBlogAds([...dateSortDesc([...resultAds, ...resultBlog])]);
    // set default bottom sheet
    setDataShow([...dateSortDesc([...resultAds, ...resultBlog])]);

    try {
      const response3 = await axios.get(
        `${BASE_URL}user/qa/getByLocation?location=${newLocation}`
      );
      if (response3.data.success) {
        response3.data.data.forEach((el: any) => {
          console.log('el', el);

          if (el.qas && el.qas.length > 0 && userCurrent.blackListedUsers.filter((elCurent: any) => elCurent.id == el.id).length <= 0) {
            resultQas = el.qas.map((item: any) => (
              {
                avatar: el.avatar,
                fullName: el.fullName,
                images: item.images,
                dateCreate: item.createdDate,
                id: item.id,
                content: item.content,
                type: "QA",
                isLocalGuide: el.localGuide,
                ban: item.ban,
                createdUser: el.id
                // arrQA.push(convertDataQA);
              }
            ));
          }
        })
        // set qa data
        setDataQa([...resultQas]);
      }
    } catch (error) {
      console.log('result qa', error);
    }
    setLoadingBottomSheet(false);
  }

  const renderBackDrop = () => (
    <Animated.View
      style={{
        opacity: 0.5,
        backgroundColor: '#000',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
      <TouchableOpacity
        style={{
          width: WINDOW_WIDTH,
          height: WINDOW_HEGIHT,
          backgroundColor: 'transparent',
        }}
        activeOpacity={1}
        onPress={() => {
          sheetRef.current.snapTo(2);
          setCloseModal(false);
        }}
      />
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 10,
        height: 450,
      }}
    >
      {/* <TouchableOpacity onPress={() => sheetRef.current.snapTo(2)}>
        <Text>haha</Text>
      </TouchableOpacity>
      <View style={{ height: 380 }}>
        <ScrollView>
          <ItemBlogOnMaps id={"ssss"} fullName={"Abg"} content={"gagagag"} images={[]} videos={[]} lat={0} lng={0} location={""} comments={[]} likedUsers={[]} userIdCreated={""} avatarUser={""} dateCreate={""} type={undefined} isLocalGuide={undefined} />
          <ItemBlogOnMaps id={"ssss"} fullName={"Abg"} content={"gagagag"} images={[]} videos={[]} lat={0} lng={0} location={""} comments={[]} likedUsers={[]} userIdCreated={""} avatarUser={""} dateCreate={""} type={undefined} isLocalGuide={undefined} />
          <ItemBlogOnMaps id={"ssss"} fullName={"Abg"} content={"gagagag"} images={[]} videos={[]} lat={0} lng={0} location={""} comments={[]} likedUsers={[]} userIdCreated={""} avatarUser={""} dateCreate={""} type={undefined} isLocalGuide={undefined} />
          <ItemBlogOnMaps id={"ssss"} fullName={"Abg"} content={"gagagag"} images={[]} videos={[]} lat={0} lng={0} location={""} comments={[]} likedUsers={[]} userIdCreated={""} avatarUser={""} dateCreate={""} type={undefined} isLocalGuide={undefined} />
        </ScrollView>
      </View> */}

      <View>
        <View style={styles.tabWrapper}>
          <TouchableOpacity
            style={[
              styles.tab,
              onBlogTab ? globalStyles.bgWhite : null,
            ]}
            onPress={() => {
              setLoadingBottomSheet(true);
              setOnBlogTab(true);
              if (dataBlogAds && dataBlogAds.length) {
                setDataShow(dataBlogAds);
              }
              setLoadingBottomSheet(false);
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "500" }}>Blog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              !onBlogTab ? globalStyles.bgWhite : null,
            ]}
            onPress={() => {
              setLoadingBottomSheet(true);
              setOnBlogTab(false);
              if (dataQa && dataQa.length) {
                setDataShow(dataQa)
              } else {
                setDataShow([])
              }
              setLoadingBottomSheet(false);
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
              }}
            >
              Question
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 360 }}>
          {loadingBottomSheet ? <AppLoading />
            :
            <ScrollView>
              {
                dataShow && dataShow.length <= 0 ?
                  <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="map-marker-remove-outline" size={100} color={Color.icon_grey} />
                    <Text style={{ color: Color.text_grey, fontSize: 18 }}>No data at this location</Text>
                  </View>
                  :
                  dataShow && dataShow.map((item: any, index: any) => (
                    <ItemBlogOnMaps
                      key={index}
                      id={item.id}
                      fullName={item.fullName}
                      content={item.content}
                      images={item.images}
                      videos={[]}
                      lat={0}
                      lng={0}
                      location={""}
                      comments={[]}
                      likedUsers={[]}
                      userIdCreated={item.createdUser}
                      avatarUser={item.avatar}
                      dateCreate={item.dateCreate}
                      type={item.type}
                      isLocalGuide={item.isLocalGuide ? item.isLocalGuide : false}
                      ban={item.ban} />
                  ))
              }
            </ScrollView>
          }

        </View>
      </View>
    </View>

  );

  return (
    <>
      {
        loadingMap ? <LoadingMap /> :
          <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}
              accessible={false}>
              <View style={{ flex: 1 }} >
                <AutoCompleteComponent
                  notifyChange={(loc: any) => getCoordsFromName(loc)} dataChange={(data: any) => getDetailData(data)} />
                {region["latitude"] ? (
                  <View style={{ flex: 1 }}>
                    <MapViewComponent
                      region={region}
                      onRegionChange={(reg: any) => onMapRegionChange(reg)} onPressMarker={(loc: any) => onPressMaker(loc)} locationname={locationName} />
                  </View>
                ) : null}
              </View>
            </TouchableWithoutFeedback>
            {closeModal == true && renderBackDrop()}
            <BottomSheet
              ref={sheetRef}
              snapPoints={[450, 300, 0]}
              renderContent={renderContent}
              enabledGestureInteraction={false}
              initialSnap={2}
              callbackNode={fall}
              renderHeader={renderHeader}
            >
            </BottomSheet>
          </>
      }

    </>
  );
};

export default MapViewContainer;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },

  tabWrapper: {
    height: 40,
    backgroundColor: "#ECEDEE",
    borderRadius: 6,
    padding: 2,
    flexDirection: "row",
  },
  tab: {
    height: "100%",
    borderRadius: 4,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  avatarWrapper: {
    borderColor: Color.white,
    borderWidth: 3,
    borderRadius: 100,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  itemBtnFollow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  unfollowBtn: {
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: Color.grey,
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  followBtn: {
    backgroundColor: Color.primary,
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  followBtnText: {
    fontWeight: "bold",
    color: Color.white,
  },
  onUnfollowBtntext: {
    fontWeight: "bold",
    color: Color.primary,
  },
});
