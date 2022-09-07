import { StyleSheet, Text, View, Image, Animated, TouchableOpacity, ActionSheetIOS, Alert } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import { EvilIcons } from '@expo/vector-icons';
import { User } from "firebase/auth";
import { ApplicationState } from "../../../redux";
import { femaleDefaultImage, maleDefaultImage } from "../../../api/Const";
import Color from "../../../utilites/Color";
import { WINDOW_WIDTH } from "../../../utilites/Dimensions";
import { COMMENT_DETAIL } from "../../../utilites/routerName";

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
    ban: boolean;
}

const ItemBlogOnMaps = (props: IProps) => {
    // declare item
    const {
        id,
        content,
        fullName,
        images,
        userIdCreated,
        dateCreate,
        avatarUser,
        type,
        isLocalGuide,
        ban
    } = props;

    // show more show less long text
    const [textShown, setTextShown] = useState(false); //To show ur remaining Text
    const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
    const toggleNumberOfLines = () => {
        //To toggle the show text or hide it
        setTextShown(!textShown);
    };

    const { userCurrent } = useSelector(
        (state: ApplicationState) => state.userReducer
    );

    // declare navigation to navigate
    const navigation = useNavigation<any>();


    const onTextLayout = useCallback(e => {
        setLengthMore(e.nativeEvent.lines.length > 3); //to check the text is more than 4 lines or not
        // console.log(e.nativeEvent);
    }, []);


    // view comment detail (blog detail)
    const navigateToBlogDetail = () => {
        navigation.navigate(COMMENT_DETAIL, { id, fullName, avatarUser, userIdCreated, type, isLocalGuide });
    };

    return (
        <>
            {
                ban ? <></>
                    :
                    <TouchableOpacity onPress={() => navigateToBlogDetail()}>
                        <View style={{ flex: 1, paddingHorizontal: 5, marginTop: 8, backgroundColor: 'white', flexDirection: 'row', borderWidth: 1, height: 114, borderRadius: 10, borderColor: Color.grey }}>
                            {/* Image */}
                            <View>
                                {/* {imagegg && imagegg?.length > 0 && */}
                                <View style={styles.imageContainer}>
                                    <View >
                                        <Image source={{
                                            uri: images.length > 0 ? images[0] : "https://www.tensorflow.org/lite/examples/images/image.png"
                                        }}
                                            style={styles.imageContent} />
                                    </View>
                                </View>
                                {/* } */}
                            </View>
                            <View>
                                {/* Image profile */}
                                <View style={{ flexDirection: 'row', paddingHorizontal: 5, paddingTop: 10, paddingBottom: 0 }}>
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
                                        <Text style={styles.textFullName}>{fullName}
                                            {isLocalGuide != undefined && isLocalGuide == true &&
                                                <AntDesign
                                                    name="checkcircle"
                                                    size={11}
                                                    color={Color.primary}
                                                />
                                            }
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <EvilIcons name="clock" size={18} color="black" />
                                            <Text style={styles.dateTime}>{moment.utc(dateCreate).local().startOf('seconds').fromNow()}.</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Content */}
                                <View style={{ width: WINDOW_WIDTH / 1.45 }}>
                                    <Text
                                        onTextLayout={onTextLayout}
                                        numberOfLines={2}
                                        style={{ lineHeight: 19, marginHorizontal: 10, marginTop: 3, fontSize: 13 }}>{content}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
            }
        </>
    );
};

export default ItemBlogOnMaps


const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: "row",
        paddingVertical: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 1000,
    },
    imageContainer: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        marginVertical: 5,
    },
    imageContent: {
        height: 100,
        width: 100,
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
