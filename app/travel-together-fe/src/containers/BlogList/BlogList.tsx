import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import AppLoading from "../../components/AppLoader/AppLoading";
import BlogItem from "./BlogItem";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Blog } from "../../models/Blog";
import PostTool from "./PostTool";
import { BASE_URL } from "../../utilites";
import axios from "axios";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../redux";

const wait = (timeout: number | undefined) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function BlogList() {

  const { userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const [refreshing, setRefreshing] = React.useState(false);

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   wait(2000).then(() =>
  //     setRefreshing(false)
  //   );
  // }, []);

  // set loading
  const [loading, setLoading] = React.useState<boolean>(false);

  // set list blog
  const [lstBlog, setLstBlog] = React.useState<Blog[]>([]);

  const dateSortDesc = (array: any[]) => {
    array.sort(
      (a: any, b: any) =>
        Number(new Date(b.dateCreate)) -
        Number(new Date(a.dateCreate))
    );
    return array;
  };

  // check block user and ngược lại
  const isBlockUser = (
    userId: string,
    currentBlockedUsers: any,
    itemBlockedUsers: any
  ) => {
    let check =
      currentBlockedUsers.find((e: any) => e.id === userId) ||
        itemBlockedUsers.find((item: any) => item.id === userCurrent.id)
        ? true
        : false;
    return check;
  };

  const getAllBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}user/blog/getAll`
      );
      if (response && response.data.success) {
        let arrayDataBlogs: any[] = [];
        response.data.data.forEach((item: any) => {
          let resultBlog: any[] = [];
          let resultQas: any[] = [];
          let resultAds: any[] = [];
          if (userCurrent.blackListedUsers.filter((el: any) => el.id == item.id).length <= 0 && !isBlockUser(userCurrent.id, userCurrent.blackListedUsers, item.blackListedUsers)) {
            if (item.blogs.length > 0) {
              resultBlog = item.blogs.map((itemBlog: any, index: any) => (
                {
                  id: itemBlog.id,
                  dateCreate: itemBlog.createdDate,
                  content: itemBlog.content,
                  images: itemBlog.images,
                  videos: itemBlog.videos,
                  lat: itemBlog.lat,
                  lng: itemBlog.lng,
                  likedUsers: itemBlog.likedUsers,
                  comments: itemBlog.comments,
                  location: itemBlog.location,
                  ratings: [],
                  avatar: item.avatar,
                  fullName: item.fullName,
                  userIdCreated: item.id,
                  isLocalGuide: item.localGuide,
                  type: "BLOG",
                  ban: itemBlog.ban
                }
              ))
            }

            // data QA
            if (item.qas && item.qas.length > 0) {

              resultQas = item.qas.map((itemQas: any) => (
                {
                  id: itemQas.id,
                  dateCreate: itemQas.createdDate,
                  content: itemQas.content,
                  images: itemQas.images,
                  videos: itemQas.videos,
                  lat: itemQas.lat,
                  lng: itemQas.lng,
                  likedUsers: itemQas.likes,
                  comments: itemQas.comments,
                  location: itemQas.location,
                  ratings: [],
                  avatar: item.avatar,
                  fullName: item.fullName,
                  userIdCreated: item.id,
                  isLocalGuide: item.localGuide,
                  type: "QA",
                  ban: itemQas.ban
                }
              ))
            }

            // data ads
            if (item.ads != null && item.ads && item.ads.length > 0) {
              resultAds = item.ads.map((itemAds: any) => (
                {
                  id: itemAds.id,
                  dateCreate: itemAds.createdDate,
                  content: itemAds.content,
                  images: itemAds.images,
                  videos: itemAds.videos,
                  lat: itemAds.lat,
                  lng: itemAds.lng,
                  likedUsers: itemAds.likedUsers,
                  comments: itemAds.comments,
                  location: itemAds.location,
                  ratings: [],
                  avatar: item.avatar,
                  fullName: item.fullName,
                  userIdCreated: item.id,
                  isLocalGuide: item.localGuide,
                  type: "ADS",
                  ban: itemAds.ban
                }
              ))
            }
            arrayDataBlogs.push(...resultAds, ...resultBlog, ...resultQas);
          }
        })
        setLstBlog([...dateSortDesc(arrayDataBlogs)]);
        setLoading(false);

      }
    } catch (error) {
      console.log("error :", error);
      setLoading(false);
    }
  }
  const isFocused = useIsFocused();

  const isMounted = useIsMounted()

  // render after delete
  const getDataFromItem = (data: any) => {
    if (data != "") {
      var index = lstBlog.findIndex(function (o) {
        return o.id === data;
      })
      // remove out of array
      if (index !== -1) lstBlog.splice(index, 1);
      setLstBlog([...lstBlog]);
    }
  }

  useEffect(() => {
    if (isMounted.current) {
      getAllBlog();
    }
    return () => {
      setLstBlog([]);
      setLoading(false);
    }
  }, [isFocused]);

  return (
    <>
      {loading ? <AppLoading /> :
        <View style={{ backgroundColor: '#CACBD0', zIndex: 10, height: '89%' }}>
          <ScrollView style={styles.listPostWrapper}>
            {/* refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}> */}
            {/* Post tool */}
            <View>
              <PostTool />
            </View>
            {/* item blog */}
            {lstBlog?.length > 0 &&
              lstBlog.map((item: any, index) => (
                !item.ban ?
                  <BlogItem
                    key={index}
                    id={item.id}
                    fullName={item.fullName}
                    content={item.content || ""}
                    images={item.images || []}
                    videos={item.videos || []}
                    location={item.location || ""}
                    comments={item.comments || []}
                    likedUsers={item.likedUsers || []}
                    userIdCreated={item.userIdCreated || ""}
                    avatarUser={item.avatar || ""}
                    lat={item.lat}
                    lng={item.lng}
                    dateCreate={item.dateCreate || ""} type={item.type} deleteFunction={(data: any) => getDataFromItem(data)}
                    isLocalGuide={item.isLocalGuide} />
                  : <></>
              ))}
          </ScrollView>
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  listPostWrapper: {
  },

});


export function useIsMounted() {
  const isMounted = useRef(false);

  useEffect((): any => {
    isMounted.current = true;
    return () => isMounted.current = false;
  }, []);

  return isMounted;
}
