import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    InputAccessoryView,
    Button,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
    ActionSheetIOS,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Comment } from "../../models/Comment";
import { User } from "../../models/User";
import { Rating } from "../../models/Rating";
import { AntDesign } from "@expo/vector-icons";
import Color from "../../utilites/Color";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BLOG_NAVIGATION, COMMENT_DETAIL, EDIT_BLOG, REPORT_USERS, USER_PROFILE } from "../../utilites/routerName";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CommentItem from "./CommentItem";
import axios from "axios";
import { BASE_URL } from "../../utilites";
import moment from "moment";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../redux";
import { femaleDefaultImage, maleDefaultImage } from "../../api/Const";
import { EvilIcons } from "@expo/vector-icons";
import AppLoading from "../../components/AppLoader/AppLoading";
import { WINDOW_HEGIHT } from "../../utilites/Dimensions";
import PreloadImage from "../../components/AppLoader/PreloadImage";

interface IProps {
    id: string;
    fullName: string;
    content: string;
    images: string[];
    videos: string[];
    location: string;
    comments: Comment[];
    likedUsers: User[];
    userIdCreated: string;
    ratings: Rating[];
    avatarUser: string;
    createdDate: string;
}

const CommentDetail = (props: IProps) => {
    // declare item
    const route = useRoute<any>();

    const { user, userCurrent } = useSelector(
        (state: ApplicationState) => state.userReducer
    );

    const [dataSource, setDataSource] = useState<any>({});

    const [commentlist, setCommentlst] = useState<any[]>([]);

    const [countComment, setCountComment] = useState<number>();

    const [countLike, setCountLike] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMain, setLoadingMain] = useState<boolean>(false);

    const getCurrentBlog = async (id: string) => {
        setLoadingMain(true);
        let url = "";
        let params = "";
        if (route.params.type == "BLOG") {
            url = "blog";
            params = "blogId";
        } else {
            url = "qa";
            params = "qaId";
        }
        try {
            const response = await axios.get(
                route.params.type == "ADS"
                    ? `${BASE_URL}user/ads/getById?qaId=${id}`
                    : `${BASE_URL}user/${url}/getById?${params}=${id}`
            );
            if (response && response.data.success) {
                setDataSource({
                    avatarUser: route.params.avatarUser,
                    fullName: route.params.fullName,
                    createdDate: response.data.data.createdDate,
                    images: response.data.data.images,
                    likedUsers:
                        route.params.type == "BLOG" || route.params.type == "ADS"
                            ? response.data.data.likedUsers
                            : response.data.data.likes,
                    content: response.data.data.content,
                    comments: response.data.data.comments,
                    location: response.data.data.location,
                    localGuide: response.data.data.localGuild,
                    createdUser: response.data.data.userIdCreated
                });

                let likeUserData: [] =
                    route.params.type == "BLOG" || route.params.type == "ADS"
                        ? response.data.data.likedUsers
                        : response.data.data.likes;

                setCountImage(response.data.data.images.length);
                // set list comments
                setCommentlst(response.data.data.comments);
                setCountLike(likeUserData.length);
                setLoadingMain(false);
                if (likeUserData && likeUserData.length > 0) {
                    likeUserData.forEach((item: any) => {
                        if (route.params.type == "BLOG" || route.params.type == "ADS") {
                            if (item.id == user.id) {
                                setLiked(true);
                            } else {
                                setLiked(false);
                            }
                        } else {
                            if (item.userId == user.id) {
                                setLiked(true);
                            } else {
                                setLiked(false);
                            }
                        }
                    });
                }
            }
            setLoadingMain(false);
        } catch (error) {
            setLoadingMain(false);
            console.log(error);
        }
    };

    useEffect(() => {
        // get current blog by id
        if (route.params.id != "") {
            getCurrentBlog(route.params.id);
        }
    }, [route.params]);

    useEffect(() => {
        setCountComment(commentlist.length);
    }, [commentlist.length]);

    // show more show less long text
    const [textShown, setTextShown] = useState(false); //To show ur remaining Text
    const [textShownComent, setTextShownComment] = useState(false); //To show ur remaining Text

    const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
    const [lengthMoreComment, setLengthMoreComment] = useState(false); //to show the "Read more & Less Line"

    const toggleNumberOfLines = () => {
        //To toggle the show text or hide it
        setTextShown(!textShown);
    };

    const toggleNumberOfLinesComment = () => {
        //To toggle the show text or hide it
        setTextShownComment(!textShownComent);
    };

    // declare navigation to navigate
    const navigation = useNavigation<any>();

    // count images
    const [countImages, setCountImage] = useState<number>(0); //To show ur remaining Text

    const onTextLayout = useCallback((e) => {
        setLengthMore(e.nativeEvent.lines.length >= 3); //to check the text is more than 4 lines or not
        // console.log(e.nativeEvent);
    }, []);

    const onTextLayoutComment = useCallback((e) => {
        setLengthMoreComment(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
        // console.log(e.nativeEvent);
    }, []);

    const navigateGoback = () => {
        navigation.goBack();
    };

    const [liked, setLiked] = useState<boolean>(false);

    const initialText = "";
    // text comment
    const [text, setText] = useState(initialText);

    const [loadedImage, setLoadedImage] = useState<boolean>(false);

    // send comment
    const commentBlog = async () => {
        setLoading(true);
        if (text != "") {
            try {
                let url = "";
                let params = "";
                let params2 = "";
                if (route.params.type == "BLOG") {
                    url = "blog";
                    params = "blogId";
                    params2 = "userIdOfBlog";
                } else {
                    url = "qa";
                    params = "qaId";
                    params2 = "userIdOfQA";
                }
                const response = await axios.post(
                    route.params.type == "ADS"
                        ? `${BASE_URL}user/ads/comment?adsId=${route.params.id}&UserIdOfAds=${route.params.userIdCreated}`
                        : `${BASE_URL}user/${url}/comment?${params}=${route.params.id}&${params2}=${route.params.userIdCreated}`,
                    {
                        content: text,
                    }
                );
                if (response.data.success) {
                    setCommentlst([...commentlist, response.data.data]);
                    setText("");
                    // hide bàn phím đi
                    Keyboard.dismiss();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
    };

    const likedPost = async () => {
        setLiked(!liked);
        if (liked == true) {
            setCountLike(countLike - 1);
        } else {
            setCountLike(countLike + 1);
        }
        try {
            let url = "";
            let params = "";
            let params2 = "";
            if (route.params.type == "BLOG") {
                url = "blog";
                params = "blogId";
                params2 = "userIdOfBlog";
            } else {
                url = "qa";
                params = "qaId";
                params2 = "userIdOfQA";
            }
            if (route.params.type == "ADS") {
                await axios.post(
                    `${BASE_URL}user/ads/like?adsId=${route.params.id}&UserIdOfAds=${route.params.userIdCreated}`
                );
            } else {
                await axios.post(
                    `${BASE_URL}user/${url}/like?${params}=${route.params.id}&${params2}=${route.params.userIdCreated}`
                );
            }
        } catch (error) { }
    };

    // delete and report bottom show
    const showStatusActionSheet = () => {
        {
            route.params.userIdCreated == user.id ?
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
                                let id = route.params.id;
                                let type = route.params.type;
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
                                let id = route.params.id;
                                let type = route.params.type;
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
                    text: "OK",
                    onPress: () => {
                        deleteBlogById();
                    },
                },
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };
    // delete blog by id
    const deleteBlogById = async () => {
        let url = "";
        let params = "";
        let prefixUrl = "";
        if (route.params.type == "BLOG") {
            url = "blog";
            params = "blogId";
            prefixUrl = "user/";
        } else if (route.params.type == "QA") {
            url = "qa";
            params = "qaId";
            prefixUrl = "user/";
        } else {
            url = "local-guild";
            params = "getById";
            prefixUrl = "";
        }
    };

    const navigateToUser = () => {
        if (userCurrent.id != dataSource.createdUser) {
            navigation.navigate(USER_PROFILE, dataSource.createdUser);
        }
    }

    // loading previous image
    const onLoading = (value: boolean) => {
        setLoadedImage(value)
    }

    return (
        <SafeAreaView>
            {
                loadingMain ? <View style={{ marginTop: WINDOW_HEGIHT / 2 }}><AppLoading /></View> :
                    <>
                        {loading && <AppLoading />}
                        <View
                            style={{
                                justifyContent: "space-between",
                                flexDirection: "column",
                                padding: 5,
                            }}
                        >
                            {/* Profile */}
                            <View style={[styles.profileContainer, { borderColor: Color.grey }]}>
                                <View style={{ justifyContent: "center" }}>
                                    <TouchableOpacity onPress={() => navigateGoback()}>
                                        <Ionicons name="chevron-back-outline" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    {userCurrent.gender ? (
                                        <Image
                                            source={{
                                                uri: dataSource.avatarUser
                                                    ? dataSource.avatarUser
                                                    : maleDefaultImage,
                                            }}
                                            style={styles.avatar}
                                        ></Image>
                                    ) : (
                                        <Image
                                            source={{
                                                uri: dataSource.avatarUser
                                                    ? dataSource.avatarUser
                                                    : femaleDefaultImage,
                                            }}
                                            style={styles.avatar}
                                        ></Image>
                                    )}
                                </View>
                                <View style={styles.contentInfo}>
                                    <Text style={styles.textFullName} numberOfLines={2} ellipsizeMode='tail'>
                                        <Text onPress={() => navigateToUser()}>{dataSource.fullName}</Text>
                                        {route.params.isLocalGuide != undefined &&
                                            route.params.isLocalGuide == true && (
                                                <AntDesign
                                                    name="checkcircle"
                                                    size={11}
                                                    color={Color.primary}
                                                />
                                            )}
                                        <Text style={{ fontSize: 13, fontWeight: "400" }}>
                                            {" "}
                                            {route.params.type == "BLOG"
                                                ? "is at "
                                                : route.params.type == "QA"
                                                    ? "is asking about "
                                                    : "talking about "}
                                            <Text style={{ fontWeight: "500" }}>
                                                {dataSource.location}
                                            </Text>
                                        </Text>
                                    </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <EvilIcons name="clock" size={18} color="black" />
                                        <Text style={styles.dateTime}>
                                            {moment
                                                .utc(dataSource.createdDate)
                                                .local()
                                                .startOf("seconds")
                                                .fromNow()}
                                            .
                                        </Text>
                                        <Text style={styles.dateTime}>
                                            {" "}
                                            {route.params.type == "BLOG"
                                                ? "Story"
                                                : route.params.type == "QA"
                                                    ? "Question"
                                                    : "Advertise"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.rightContentInfor}>
                                    <TouchableOpacity onPress={() => showStatusActionSheet()}>
                                        <Entypo name="dots-three-horizontal" size={20} color="grey" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <KeyboardAvoidingView behavior="position">
                                <View style={{ height: "89%", backgroundColor: "white" }}>
                                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                                        <View>
                                            {/* Image */}
                                            {dataSource &&
                                                dataSource.images &&
                                                dataSource.images?.length > 0 && (
                                                    <View style={styles.imageContainer}>
                                                        <PagerView style={styles.viewPager} initialPage={0}>
                                                            {dataSource.images &&
                                                                dataSource.images?.length > 0 &&
                                                                dataSource.images.map((item: any, index: any) => (
                                                                    <View key={index}>
                                                                        {
                                                                            loadedImage && <PreloadImage />
                                                                        }
                                                                        <Image
                                                                            source={{
                                                                                uri: item,
                                                                            }}
                                                                            style={styles.imageContent}
                                                                            onLoadStart={() => onLoading(true)} onLoadEnd={() => onLoading(false)}
                                                                        />
                                                                        {dataSource.images.length > 1 && <Text style={styles.countImage}> {index + 1}/{countImages}</Text>}
                                                                    </View>
                                                                ))}
                                                        </PagerView>
                                                    </View>
                                                )}
                                            {/* Content */}
                                            <View>
                                                <Text
                                                    onTextLayout={onTextLayout}
                                                    numberOfLines={textShown ? undefined : 3}
                                                    style={{
                                                        lineHeight: 19,
                                                        marginHorizontal: 10,
                                                        marginVertical: 10,
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {dataSource.content}
                                                </Text>
                                                {lengthMore ? (
                                                    <Text
                                                        onPress={toggleNumberOfLines}
                                                        style={{
                                                            lineHeight: 13, color: 'black', fontWeight: '600', paddingLeft: 10, paddingBottom: 10
                                                        }}
                                                    >
                                                        {textShown ? "Read less..." : "Read more..."}
                                                    </Text>
                                                ) : null}
                                            </View>
                                            {/* Like comment */}
                                            <View style={styles.likeCommentContainer}>
                                                <View style={styles.like}>
                                                    <TouchableOpacity onPress={() => likedPost()}>
                                                        {liked == true ? (
                                                            <AntDesign name="heart" size={20} color="red" />
                                                        ) : (
                                                            <AntDesign name="hearto" size={20} color="black" />
                                                        )}
                                                    </TouchableOpacity>
                                                    <Text style={styles.textLikeComment}>{countLike} Like</Text>
                                                </View>
                                                <View style={styles.comment}>
                                                    <Ionicons name="chatbox-outline" size={24} color="black" />
                                                    <Text
                                                        style={[styles.textLikeComment, { textAlign: "right" }]}
                                                    >
                                                        {countComment} Comment
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Comment */}
                                            <View>
                                                {commentlist &&
                                                    commentlist.length > 0 &&
                                                    commentlist.map((item: any, index: any) => (
                                                        <CommentItem
                                                            key={index}
                                                            id={item.id}
                                                            avatar={item.userAvt}
                                                            fullName={item.fullName}
                                                            contentComment={item.content}
                                                            isLocalGuide={item.isLocalGuide}
                                                        />
                                                    ))}
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                                {/* input comment */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignContent: "center",
                                        borderTopWidth: 1,
                                        borderColor: Color.grey,
                                        paddingHorizontal: 10
                                    }}
                                >
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={setText}
                                        value={text}
                                        placeholder={"Please type here…"}
                                    // inputAccessoryViewID="Next"
                                    />
                                    <TouchableOpacity
                                        style={{ alignItems: "center", margin: 10 }}
                                        onPress={() => commentBlog()}
                                    >
                                        <Ionicons name="ios-send" size={24} color={Color.primary} />
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                        {/* <InputAccessoryView nativeID="Next">
                <View
                    style={{
                        flexDirection: "row",
                        alignContent: "center",
                        borderTopWidth: 1,
                        borderColor: Color.grey,
                        paddingHorizontal: 10
                    }}
                >
                    <TextInput
                        style={styles.input}
                        onChangeText={setText}
                        value={text}
                        placeholder={"Please type here…"}
                    />
                    <TouchableOpacity
                        style={{ alignItems: "center", margin: 10 }}
                        onPress={() => commentBlog()}
                    >
                        <Ionicons name="ios-send" size={24} color={Color.primary} />
                    </TouchableOpacity>
                </View>
            </InputAccessoryView> */}
                    </>
            }
        </SafeAreaView>
    );
};

export default CommentDetail;

const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: "row",
        paddingVertical: 5,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 1000,
        marginLeft: 10,
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
        justifyContent: "space-between",
    },
    contentInfo: {
        width: "70%",
        paddingLeft: 5,
        justifyContent: "center",
    },
    textFullName: {
        fontSize: 14,
        fontWeight: "500",
    },
    dateTime: {
        fontSize: 11,
        color: Color.text_grey,
    },
    rightContentInfor: {
        justifyContent: "center",
    },
    like: {
        width: "50%",
        flexDirection: "row",
    },
    comment: {
        flexDirection: "row",
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
        fontWeight: "600",
        color: "white",
    },
    contentComment: {
        width: "80%",
        marginLeft: 5,
        alignSelf: "flex-start",
        borderRadius: 5,
        backgroundColor: "#F0F2F5",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    input: {
        paddingHorizontal: 20,
        fontSize: 16,
        justifyContent: "center",
        padding: 10,
        borderColor: Color.grey,
        backgroundColor: "#F0F2F5",
        borderRadius: 50,
        marginTop: 5,
        width: "90%",
    },
});
