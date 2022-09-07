// import { StyleSheet, View } from "react-native";
// import React from "react";
// import MapYotsuba from "../map/MapYotsuba";
// import MapTravelRequest from "../map/MapTravelRequest";
// import { Tab, Text, TabView } from "@rneui/themed";
// import Color from "../../utilites/Color";
// import BlogList from "../BlogList/BlogList";
// import HeaderCommon from "../../components/HeaderCommon/HeaderCommon";
// import { POST_BLOG } from "../../utilites/routerName";
// import MapViewContainer from "../map/containers/MapViewContainer";

// const BlogScreen = () => {
//   const [index, setIndex] = React.useState<number>(0);

//   return (
//     <>
//       <View style={styles.container}>
//         <View style={{ marginBottom: 5 }}>
//           <HeaderCommon title="Explore" rightIcon={"new-message"} rightNavigation={POST_BLOG} />
//         </View>
//         <Tab
//           value={index}
//           onChange={(e) => {
//             setIndex(e);
//           }}
//           indicatorStyle={{
//             backgroundColor: Color.primary,
//             width: 0,
//             shadowColor: "black",
//             shadowRadius: 10,
//             shadowOpacity: 1,
//           }}

//         >
//           <Tab.Item
//             title="For You"
//             style={styles.tabItem}
//             containerStyle={(active) => ({
//               backgroundColor: active ? Color.primary : "white",
//               borderRadius: 10,
//             })}
//             titleStyle={(active) => ({
//               color: active ? "white" : "black",
//               fontSize: 15,
//               fontWeight: "500",
//               height: 30,
//             })}
//           />
//           <Tab.Item
//             title="Map"
//             style={styles.tabItem}
//             containerStyle={(active) => ({
//               backgroundColor: active ? Color.primary : "white",
//               borderRadius: 10,
//             })}
//             titleStyle={(active) => ({
//               color: active ? "white" : "black",
//               fontSize: 15,
//               fontWeight: "500",
//               height: 30,
//             })}
//           />
//         </Tab>
//       </View>
//       <TabView
//         value={index}
//         onChange={setIndex}
//         disableSwipe={true}
//       >
//         <TabView.Item style={{ backgroundColor: "white", width: "100%" }}>
//           <BlogList></BlogList>
//         </TabView.Item>
//         <TabView.Item
//           style={{ backgroundColor: "white", width: "100%", height: "100%" }}
//         >
//           <MapViewContainer index={index} />
//           {/* <MapYotsuba /> */}
//         </TabView.Item>
//       </TabView>
//     </>
//   );
// };

// export default BlogScreen;

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 30,
//     backgroundColor: 'white',
//     borderColor: Color.grey,
//     paddingHorizontal: 5,
//     paddingVertical: 5,
//   },
//   tabItem: {
//     borderRadius: 10,
//     height: 40,
//     paddingBottom: 30,
//   },
// });

import { Animated, Keyboard, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import MapYotsuba from "../map/MapYotsuba";
import MapTravelRequest from "../map/MapTravelRequest";
import { Tab, Text, TabView } from "@rneui/themed";
import Color from "../../utilites/Color";
import BlogList from "../BlogList/BlogList";
import HeaderCommon from "../../components/HeaderCommon/HeaderCommon";
import { BLOG_LIST, MAP_VIEW, POST_BLOG } from "../../utilites/routerName";
import MapViewContainer from "../map/containers/MapViewContainer";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const BlogScreen = () => {

  const TabTop = createMaterialTopTabNavigator();

  return (
    <>
      <View style={styles.container}>
        <HeaderCommon title="Explore" rightIcon={"new-message"} rightNavigation={POST_BLOG} />
      </View>
      <TabTop.Navigator initialRouteName={BLOG_LIST} style={{ minHeight: '100%', height: '100%' }}>
        <TabTop.Screen name={BLOG_LIST} component={BlogList} options={{
          title: "For you",
          swipeEnabled: false,

        }} />
        <TabTop.Screen name={MAP_VIEW} component={MapViewContainer} options={{
          title: "Map",
        }}
        />
      </TabTop.Navigator>
    </>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    backgroundColor: 'white',
    borderColor: Color.grey,
  },
  tabItem: {
    borderRadius: 10,
    height: 40,
    paddingBottom: 30,
  },
});

