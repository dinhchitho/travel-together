import { StyleSheet, Text, View, Image, Animated, TouchableOpacity, ActionSheetIOS, Alert } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Comment } from "../../models/Comment";
import { User } from "../../models/User";
import { Rating } from "../../models/Rating";
import { AntDesign } from "@expo/vector-icons";
import Color from "../../utilites/Color";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";
import { useNavigation } from "@react-navigation/native";
import { COMMENT_DETAIL, EDIT_BLOG, REPORT_USERS, USER_PROFILE } from "../../utilites/routerName";
import moment from "moment";
import axios from "axios";
import { BASE_URL } from "../../utilites";
import { ApplicationState } from "../../redux";
import { useSelector } from "react-redux";
import { femaleDefaultImage, maleDefaultImage } from "../../api/Const";
import { EvilIcons } from '@expo/vector-icons';
import AppLoading from "../../components/AppLoader/AppLoading";
import PreloadImage from "../../components/AppLoader/PreloadImage";

interface IProps {
  id: string;
  fullName: string;
  content: string;
  images: string[];
  videos: string[];
  lat: number;
  lng: number;
  location: string;
  comments: Comment[];
  likedUsers: User[];
  userIdCreated: string;
  avatarUser: string;
  dateCreate: string;
  type: string | undefined;
  isLocalGuide: boolean | undefined;
  deleteFunction: Function;
}

const BlogItem = (props: IProps) => {
  // declare item
  const {
    id,
    content,
    fullName,
    images,
    videos,
    location,
    comments,
    likedUsers,
    userIdCreated,
    dateCreate,
    avatarUser,
    type,
    isLocalGuide
  } = props;

  // show more show less long text
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const { user, userCurrent } = useSelector(
    (state: ApplicationState) => state.userReducer
  );


  // declare navigation to navigate
  const navigation = useNavigation<any>();

  // count images 
  const [countImages, setCountImage] = useState<number>(0);

  const [countComment, setCountComment] = useState<number>();

  const [countLike, setCountLike] = useState<number>(0);

  const [liked, setLiked] = useState<boolean>(false);

  const [loadedImage, setLoadedImage] = useState<boolean>(false);

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= 3); //to check the text is more than 2 lines or not
  }, []);

  // loading previous image
  const onLoading = (value: boolean) => {
    setLoadedImage(value)
  }

  useEffect(() => {
    // set number of images comment, like
    if (images && images.length > 0) {
      setCountImage(images.length);
    }
    setCountComment(comments.length);
    setCountLike(likedUsers.length);
    likedUserCheck();
  }, [comments.length, likedUsers.length]);

  // // check user liked or not
  // useEffect(() => {
  //   likedUserCheck();
  // }, []);

  const likedUserCheck = () => {

    if (likedUsers && likedUsers.length > 0) {
      likedUsers.forEach((item: any) => {
        if (item.username == user.username) {
          setLiked(true);
        }
      })
    } else {
      setLiked(false);
    }
  }

  // view comment detail (blog detail)
  const navigateToBlogDetail = () => {
    navigation.navigate(COMMENT_DETAIL, { id, fullName, avatarUser, userIdCreated, type, isLocalGuide });
  };

  // like post show
  const likedPost = async () => {
    setLiked(!liked);
    if (liked == true) {
      setCountLike(countLike - 1);
    } else {
      setCountLike(countLike + 1);
    }
    try {
      let url = '';
      let params = '';
      let params2 = '';
      if (type == "BLOG") {
        url = 'blog';
        params = 'blogId';
        params2 = 'userIdOfBlog';
      } else {
        url = 'qa';
        params = 'qaId';
        params2 = 'userIdOfQA';
      }
      if (type == "ADS") {
        await axios.post(
          `${BASE_URL}user/ads/like?adsId=${id}&UserIdOfAds=${userIdCreated}`,
        );
      } else {
        await axios.post(
          `${BASE_URL}user/${url}/like?${params}=${id}&${params2}=${userIdCreated}`,
        );
      }
    } catch (error) {

    }
  }

  // delete and report bottom show
  const showStatusActionSheet = () => {
    {
      userIdCreated == user.id ?
        ActionSheetIOS.showActionSheetWithOptions(
          {
            // 3 option
            options:
              ["Cancel", "Delete", "Edit"],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex !== 0) {
              if (buttonIndex == 1) {
                confirmFunction();
              } else if (buttonIndex == 2) {
                navigation.navigate(EDIT_BLOG, { id, type })
              }
            }
          }
        ) :
        ActionSheetIOS.showActionSheetWithOptions(
          {
            // 3 option
            options:
              ["Cancel", "Report"],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex !== 0) {
              if (buttonIndex == 1) {
                navigation.navigate(REPORT_USERS, { blogId: id, type: type })
              } else if (buttonIndex == 2) {

              }
            }
          }
        )
    }
  };

  const confirmFunction = () => {
    Alert.alert(
      "Are you sure delete?",
      //body
      "This action will not return",
      [
        {
          text: 'OK', onPress: () => { deleteBlogById() }
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
      ],
      { cancelable: true },
    );
  }


  // delete blog by id
  const deleteBlogById = async () => {
    let url = '';
    let params = '';
    if (type == "BLOG") {
      url = 'blog';
      params = 'blogId';
    } else {
      url = 'qa';
      params = 'qaId';
    }
    try {
      const res = await axios.delete(
        type == "ADS" ? `${BASE_URL}local-guild?adsId=${id}` : `${BASE_URL}user/${url}?${params}=${id}`,
      );
      // if thành công thì render màn hình chính
      if (res && res.data.success) {
        props.deleteFunction(id);
      }
    } catch (error) {
      console.log(error);

    }
  }

  const navigateToUser = () => {
    if (userCurrent.id != userIdCreated) {
      navigation.navigate(USER_PROFILE, userIdCreated);
    }
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 5, marginTop: 8, backgroundColor: 'white' }}>
      {/* Profile */}
      <View style={styles.profileContainer}>
        <View>
          {
            userCurrent.gender ? <Image
              source={{
                uri: avatarUser ? avatarUser : maleDefaultImage
              }}
              style={styles.avatar}
            ></Image>
              :
              <Image
                source={{
                  uri: avatarUser ? avatarUser : femaleDefaultImage
                }}
                style={styles.avatar}
              ></Image>
          }

        </View>
        <View style={styles.contentInfo}>
          <Text style={styles.textFullName}>
            <Text onPress={() => navigateToUser()}>{fullName}</Text>
            {isLocalGuide != undefined && isLocalGuide == true &&
              <AntDesign
                name="checkcircle"
                size={11}
                color={Color.primary}
              />
            }
            <Text style={{ fontSize: 13, fontWeight: '400' }}> {type == "BLOG" ? " is at" : type == "QA" ? " is asking about" : "talking about"}
              <Text style={{ fontWeight: '500' }}> {location}</Text>
            </Text>
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <EvilIcons name="clock" size={18} color="black" />
            <Text style={styles.dateTime}>{moment.utc(dateCreate).local().startOf('seconds').fromNow()}.</Text>
            <Text style={styles.dateTime}>   {type == "BLOG" ? "Story" : type == "QA" ? "Question" : "Advertise"}</Text>
          </View>
        </View>
        <View style={styles.rightContentInfor}>
          <TouchableOpacity onPress={() => showStatusActionSheet()}>
            <Entypo name="dots-three-horizontal" size={20} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Image */}
      {images && images?.length > 0 &&
        <View style={styles.imageContainer}>
          <PagerView style={styles.viewPager} initialPage={0}>
            {images && images?.length > 0 &&
              images.map((item, index) => (
                <View key={index}>
                  {
                    loadedImage && <PreloadImage />
                  }
                  <Image source={{
                    uri: item
                  }}
                    style={styles.imageContent} onLoadStart={() => onLoading(true)} onLoadEnd={() => onLoading(false)} />
                  {images.length > 1 && <Text style={styles.countImage}> {index + 1}/{countImages}</Text>}
                </View>
              ))}
          </PagerView>
        </View>
      }
      {/* Content */}
      <View>
        <Text
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : 3}
          style={{ lineHeight: 19, marginHorizontal: 10, marginVertical: 10, fontSize: 13 }}>{content}
        </Text>
        {
          lengthMore ? <Text
            onPress={toggleNumberOfLines}
            style={{ lineHeight: 13, color: 'black', fontWeight: '600', paddingLeft: 10, paddingBottom: 10 }}>{textShown ? 'Read less...' : 'Read more...'}</Text>
            : null
        }
      </View>
      {/* Like comment */}
      <View style={styles.likeCommentContainer}>
        <View style={styles.like}>
          <TouchableOpacity onPress={() => likedPost()}>
            {liked == true ? <AntDesign name="heart" size={20} color="red" /> : <AntDesign name="hearto" size={20} color="black" />}
          </TouchableOpacity>
          <Text style={styles.textLikeComment}>{countLike} Like</Text>
        </View>
        <View style={styles.comment}>
          <Ionicons name="chatbox-outline" size={24} color="black" />
          <TouchableOpacity
            onPress={() => {
              navigateToBlogDetail();
            }}
          >
            <Text style={[styles.textLikeComment, { textAlign: 'right' }]}>{countComment} Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BlogItem;

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 1000,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginVertical: 5,
  },
  imageContent: {
    height: 250,
    borderRadius: 10,
  },
  likeCommentContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    paddingLeft: 30,
    borderTopWidth: 1,
    borderColor: Color.grey,
  },
  contentInfo: {
    width: "75%",
    paddingLeft: 5,
    justifyContent: "center",
  },
  textFullName: {
    fontSize: 14,
    fontWeight: "500",
  },
  dateTime: {
    fontSize: 11,
    color: Color.text_grey
  },
  rightContentInfor: {
    justifyContent: "center",
  },
  like: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: "center"
  },
  comment: {
    flexDirection: "row",
    alignContent: "flex-end",
    textAlign: "end",
    width: "50%",
  },
  textLikeComment: {
    fontSize: 13,
    paddingLeft: 10,
    fontWeight: "500",
    marginTop: 2,
  },
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  countImage: {
    position: "absolute",
    right: 10,
    bottom: 10,
    fontWeight: '600',
    color: 'white'
  },
  localGuide: {
    position: 'absolute',
    bottom: 0,
    right: 0
  }
});
