import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActionSheetIOS, Button, InputAccessoryView, Dimensions, KeyboardAvoidingView, ScrollView, FlatList, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { AntDesign } from "@expo/vector-icons";
import Color from "../../utilites/Color";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { ApplicationState } from '../../redux';
import { useSelector } from 'react-redux';
import { femaleDefaultImage, maleDefaultImage } from '../../api/Const';
import BottomModal, { BottomSheetRefProps } from '../../components/custom/BottomModal';
import AutoCompleteComponent from '../map/components/AutoCompleteComponent';
import { WINDOW_HEGIHT } from '../../utilites/Dimensions';
import firebase from "../../../config";
import AppLoading from '../../components/AppLoader/AppLoading';
import axios from 'axios';
import { BASE_URL } from '../../utilites';
import { BLOG_LIST, BLOG_NAVIGATION } from '../../utilites/routerName';
import LoadingImage from '../../components/AppLoader/LoadingImage';

const EditBlog = () => {

    const route = useRoute<any>();

    const navigation = useNavigation<any>();

    const [text, setText] = useState('');

    const [regionName, setRegionName] = useState<any>('');

    const [locationName, setLocationName] = useState<any>("");

    const [regionAddress, setRegionAddress] = useState<any>();

    const [typeBlog, setTypeBlog] = useState<string>('BLOG');

    const [loading, setLoading] = useState<boolean>(false);

    const [loadingWhenSave, setLoadingWhenSave] = useState<boolean>(false);

    const [dataSourceImage, setDataSourceImage] = useState<any>([
    ]);

    const MAX_HEIGHT = -WINDOW_HEGIHT / 2;

    const checkinRef = useRef<BottomSheetRefProps>(null);

    // current user from redux
    const { userCurrent } = useSelector(
        (state: ApplicationState) => state.userReducer
    );

    const [dataSource, setDataSource] = useState<any>({});

    const handleUpdata = (photo: any) => {
        setLoading(true);
        const data = new FormData();
        data.append('file', photo);
        data.append('upload_preset', 'travel_together');
        data.append("cloud_name", "df66mvytc");
        fetch("https://api.cloudinary.com/v1_1/df66mvytc/image/upload", {
            method: "POST",
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-type': 'multipart/form-data',
            }
        }).then(res => res.json())
            .then(data => {
                setLoading(false);
                setDataSourceImage([...dataSourceImage, data.url]);
            }).catch(err => {
                setLoading(false);
                Alert.alert(
                    "Fail to upload image",
                    //body
                    `${err}`,
                    [
                        {
                            text: 'OK', onPress: () => console.log("OK")
                        },
                    ],
                    { cancelable: true },
                );
            })
    }

    // pick ảnh lên
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            const uri = result.uri;
            const type = result.type;
            const name = 'ajbfs'
            const source = { uri, type, name };
            handleUpdata(source);
        }
    };

    // chọn loại bài viết
    const showStatusActionSheet = () => {
        {
            userCurrent.localGuide == true ?
                ActionSheetIOS.showActionSheetWithOptions(
                    {
                        options:
                            ["Cancel", "Blog", "Asking", "Advertisement"],
                        cancelButtonIndex: 0,
                    },
                    (buttonIndex) => {
                        if (buttonIndex !== 0) {
                            if (buttonIndex == 1) {
                                setTypeBlog('BLOG');
                            } else if (buttonIndex == 2) {
                                setTypeBlog('QA');
                            } else {
                                setTypeBlog('ADS');
                            }
                        }
                    }
                )
                :
                ActionSheetIOS.showActionSheetWithOptions(
                    {
                        options:
                            ["Cancel", "Blog", "Asking"],
                        cancelButtonIndex: 0,
                    },
                    (buttonIndex) => {
                        if (buttonIndex !== 0) {
                            if (buttonIndex == 1) {
                                setTypeBlog('BLOG');
                            } else if (buttonIndex == 2) {
                                setTypeBlog('QA');
                            }
                        }
                    }
                );
        }
    };

    const navigateGoback = () => {
        if (dataSourceImage.length > 0 || text != "") {
            Alert.alert(
                "Are you sure to leave?",
                "If you quit now, you will lose this post.",
                [
                    {
                        text: "Cancel",
                        onPress: () => navigation.goBack(),
                        style: "cancel"
                    },
                    { text: "Continue edit" }
                ]
            )
        } else {
            navigation.goBack();
        }
    };

    // get địa chỉ
    const getCoordsFromName = (loc: any) => {
        if (loc) {
            setRegionAddress(loc);
        }
    };

    const getDetailData = (data: any) => {
        if (data && data.name) {
            setRegionName(data.name);
            setLocationName(data.formatted_address);
            closeBottomModal()
        }
    }
    // end get địa chỉ

    // open modal checkin
    const openBottomModal = () => {
        const isActive = checkinRef?.current?.isActive();
        checkinRef?.current?.scrollTo(MAX_HEIGHT);
    };

    // close modal checkin
    const closeBottomModal = () => {
        checkinRef?.current?.scrollTo(1000);
    };

    // save blog
    const save = async () => {
        // validate checkin
        if (regionName == '') {
            Alert.alert(
                "Something required!",
                //body
                'Please choice place you want to ask or sharing',
                [
                    {
                        text: 'OK', onPress: () => console.log("OK")
                    },
                ],
                { cancelable: true },
            );
        } else {
            try {
                setLoadingWhenSave(true);
                let url = '';
                if (route.params.type == "BLOG") {
                    url = 'blog';
                } else if (route.params.type == "QA") {
                    url = 'qa';
                }

                const response = await axios.put(
                    route.params.type == 'ADS' ? `${BASE_URL}local-guild` : `${BASE_URL}user/${url}`,
                    {
                        id: route.params.id,
                        content: text,
                        images: dataSourceImage,
                        location: locationName,
                        lat: regionAddress.lat,
                        lng: regionAddress.lng,
                        // eTypeBlog: typeBlog && typeBlog == 'Asking' ? 'QA' : typeBlog == 'ADS' ? 'ADS' : "BLOG",
                    }
                );
                if (response.data.success) {
                    setLoadingWhenSave(false);
                    navigation.navigate(BLOG_NAVIGATION);
                }
            } catch (error) {
                setLoadingWhenSave(false);
                console.log("error :", error);
            }
        }
    }

    useEffect(() => {
        // get current blog by id
        if (route.params.id != "") {
            getCurrentBlog(route.params.id);
        }
    }, []);

    const deleteImage = (item: string) => {

        const index = dataSourceImage.indexOf(item);
        if (index > -1) { // only splice array when item is found
            dataSourceImage.splice(index, 1); // 2nd parameter means remove one item only
        }
        setDataSourceImage([...dataSourceImage])
    }

    const getCurrentBlog = async (id: string) => {
        setLoading(true);
        let url = '';
        let params = '';
        if (route.params.type == "BLOG") {
            url = 'blog';
            params = 'blogId';
        } else {
            url = 'qa';
            params = 'qaId';
        }
        try {
            const response = await axios.get(
                route.params.type == "ADS" ? `${BASE_URL}local-guild/getById?qaId=${id}` : `${BASE_URL}user/${url}/getById?${params}=${id}`
            );
            if (response && response.data.success) {
                // setDataSource({
                //     avatarUser: route.params.avatarUser,
                //     fullName: route.params.fullName,
                //     createdDate: response.data.data.createdDate,
                //     images: response.data.data.images,
                //     likedUsers: route.params.type == 'BLOG' || route.params.type == 'ADS' ? response.data.data.likedUsers : response.data.data.likes,
                //     content: response.data.data.content,
                //     comments: response.data.data.comments,
                //     location: response.data.data.location,
                //     localGuide: route.params.isLocalGuide,
                // });

                // set list comments
                setLoading(false);
                if (response.data.data.images && response.data.data.images.length > 0) {
                    setDataSourceImage([...response.data.data.images])
                }
                setText(response.data.data.content);
                setRegionName(response.data.data.location);
                setLocationName(response.data.data.location);
                let region = {
                    lat: response.data.data.lat,
                    lng: response.data.data.lng
                }
                setRegionAddress(region);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <>
            <View style={{ marginTop: 50 }}>
                {loadingWhenSave && <AppLoading />}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={{ width: 50, alignItems: "flex-start" }}
                        onPress={() => navigateGoback()}
                    >
                        <AntDesign name="close" size={24} color={Color.icon_grey} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Edit</Text>
                    <TouchableOpacity onPress={() => save()}>
                        <Text
                            style={{
                                textAlign: "center",
                                fontWeight: "600",
                                color: dataSourceImage.length > 0 || text != "" ? Color.primary : Color.grey,
                                fontSize: 17,
                            }}
                        >
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 600 }}>
                    {/* Images video */}
                    <View style={{ marginTop: 10 }}>
                        <FlatList
                            keyboardShouldPersistTaps='handled'
                            ListHeaderComponent={
                                <>
                                    <View style={styles.container}>
                                        <View style={{ flexDirection: "row" }}>
                                            {
                                                userCurrent.gender ? <Image
                                                    source={{
                                                        uri: userCurrent.avatar ? userCurrent.avatar : maleDefaultImage
                                                    }}
                                                    style={styles.avatar}
                                                ></Image>
                                                    :
                                                    <Image
                                                        source={{
                                                            uri: userCurrent.avatar ? userCurrent.avatar : femaleDefaultImage
                                                        }}
                                                        style={styles.avatar}
                                                    ></Image>
                                            }
                                            <View style={{ paddingLeft: 10 }}>
                                                <Text style={{ fontWeight: '500' }}>{userCurrent.fullName}
                                                    <Text style={{ fontWeight: '300' }}> {route.params.type && route.params.type == 'QA' ? 'is asking' : route.params.type == "BLOG" ? 'share story' : "advertisement"}</Text>
                                                </Text>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: "center",
                                                    paddingTop: 5
                                                }}>
                                                    <FontAwesome5 name="map-marker-alt" size={15} color="#F5533D" />
                                                    <Text style={{ fontSize: 13, color: Color.text_grey, paddingLeft: 5 }}>
                                                        {regionName ? regionName : "checkin"}
                                                        {/* {typeBlog && typeBlog == 'Asking' ? 'Asking' : "Blog"} */}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.inputContent}>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={setText}
                                            value={text}
                                            placeholder={`What's on your mind?`}
                                            inputAccessoryViewID="Next"
                                            autoFocus
                                            multiline={true}
                                        />
                                    </View>
                                </>
                            }
                            ListHeaderComponentStyle={{ paddingBottom: 10 }}
                            data={dataSourceImage}
                            renderItem={({ item, index }) => (
                                <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                                    {
                                        <View>
                                            <Image style={styles.imageThumbnail} source={{ uri: item }} />
                                            <TouchableOpacity
                                                style={{ position: 'absolute', top: 5, right: 5 }}
                                                onPress={() => deleteImage(item)}
                                            >
                                                <AntDesign name="close" size={24} color={Color.icon_grey} />
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>

                            )}
                            //Setting the number of column
                            numColumns={3}
                            ListFooterComponent={
                                <>
                                    {/* add image */}
                                    {
                                        dataSourceImage && dataSourceImage.length > 0 && <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: Color.grey, justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => pickImage()}>
                                                <AntDesign name="plus" size={50} color={Color.grey} />
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </>
                            }
                        />
                    </View>
                    {loading && <LoadingImage />}
                </View>
                <View style={styles.accessory}>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => showStatusActionSheet()}>
                            <MaterialCommunityIcons name="format-list-bulleted-type" size={25} color="#F9CD66" />
                            <Text style={styles.textToolBottom}>Type</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => pickImage()}>
                            <FontAwesome name="image" size={25} color="#41B35D" />
                            <Text style={styles.textToolBottom}>Image</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                        <TouchableOpacity onPress={() => { openBottomModal() }}>
                            <FontAwesome5 name="map-marker-alt" size={25} color="#F5533D" />
                        </TouchableOpacity>
                        <Text style={styles.textToolBottom}>Checkin</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../../assets/background_icon.png')}
                            style={{ height: 25, width: 25, borderRadius: 5 }}
                        ></Image>
                        <Text style={styles.textToolBottom}>Background</Text>
                    </View>
                </View>

                <InputAccessoryView nativeID="Next">
                    <View style={styles.accessory}>
                        <TouchableOpacity onPress={() => showStatusActionSheet()}>
                            <MaterialCommunityIcons name="format-list-bulleted-type" size={25} color="#F9CD66" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImage()}>
                            <FontAwesome name="image" size={25} color="#41B35D" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { openBottomModal() }}>
                            <FontAwesome5 name="map-marker-alt" size={25} color="#F5533D" />
                        </TouchableOpacity>
                        <Image source={require('../../../assets/background_icon.png')}
                            style={{ height: 25, width: 25, borderRadius: 5 }}
                        ></Image>
                    </View>
                </InputAccessoryView>
                <BottomModal
                    ref={checkinRef}
                    maxHeight={MAX_HEIGHT}
                    onClose={() => { }}
                >
                    <AutoCompleteComponent notifyChange={(loc: any) => getCoordsFromName(loc)} dataChange={(data: any) => getDetailData(data)} />
                </BottomModal>
            </View>
        </>
    )
}

export default EditBlog

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        alignItems: "center",
        paddingHorizontal: 5
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 1000
    },
    input: {
        paddingLeft: 10
    },
    text: {

    },
    header: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#ffffff",
        borderWidth: 0.3,
        borderColor: "transparent",
        borderBottomColor: "#DDDDDD",
    },
    headerText: {
        color: Color.black,
        fontSize: 17,
        fontWeight: "500",
    },
    button: {
        fontSize: 16,
        color: 'black',
        width: 65,
        height: 40,
        padding: 8,
        textAlign: 'center',
        alignItems: 'center'
    },
    inputContent: {
        paddingTop: 25,
        width: '100%'
    },
    accessory: {
        width: Dimensions.get('window').width,
        height: 60,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 25,
        shadowColor: 'black',
        shadowOpacity: 0.1,
    },
    textToolBottom: {
        fontSize: 12,
        marginTop: 5,
        color: Color.text_grey
    },
    imageThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 120,
    },
    bottomModal: {
        width: Dimensions.get('window').width,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 25,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        borderTopWidth: 1
    }
})