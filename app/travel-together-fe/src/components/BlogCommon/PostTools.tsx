import { Animated, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { PanGestureHandler } from 'react-native-gesture-handler';

const PostTools = () => {
    return (
        <KeyboardAvoidingView style={styles.parentContainer} enabled behavior="height">
            <SafeAreaView style={styles.container}>
                <View style={styles.navigationBar}>
                    <TouchableOpacity style={styles.naviIcon}>
                        {/* <FontAwesome5Icon color="#000" name="arrow-left" size={20}></FontAwesome5Icon> */}
                    </TouchableOpacity>
                    <Text style={styles.naviTitle}>Create post</Text>
                    <TouchableOpacity style={styles.btnPost}>
                        <Text style={{ fontSize: 16 }}>POST</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoWrapper}>
                    {/* <Image style={styles.avatar} source={{ uri: user.avatar_url }}></Image> */}
                    <View>
                        <Text style={styles.name}>AnhtP</Text>
                        <View style={styles.areaWrapper}>
                            <TouchableOpacity style={styles.areaOption}>
                                {/* <FontAwesome5 style={{ marginRight: 3 }} name="globe-asia" size={14}> </FontAwesome5> */}
                                <Text>Public</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.areaOption}>
                                {/* <FontAwesome5 style={{ marginRight: 3 }} name="plus" size={14}></FontAwesome5> */}
                                <Text>Public</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </SafeAreaView >
        </KeyboardAvoidingView>
    )
}

export default PostTools

const styles = StyleSheet.create({
    parentContainer: {
        position: 'relative'
    },
    container: {
        height: "100%",
        width: '100%',
        backgroundColor: '#fff'
    },
    navigationBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        height: 50,
    },
    naviIcon: {
        padding: 10,
    },
    naviTitle: {
        paddingHorizontal: 10,
        fontSize: 16
    },
    btnPost: {
        position: 'absolute',
        right: 10,
        justifyContent: 'center'
    },
    infoWrapper: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    areaWrapper: {
        flexDirection: 'row'
    },
    areaOption: {
        marginRight: 10,
        paddingHorizontal: 5,
        paddingVertical: 2.5,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        marginRight: 10,
        borderRadius: 50,
        width: 40,
        height: 40
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    editorWrapper: {
        overflow: 'hidden',
        padding: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
    },
    editor: {
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    },
    toolOptionsWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        paddingBottom: 55,
    },
    optionsWrapper: {
        backgroundColor: '#fff',
        position: 'absolute',
        width: '100%',
        left: 0,
        zIndex: 999999
    },
    optionTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 55,
        alignItems: 'center',
        borderTopColor: '#ddd',
        borderTopWidth: 1
    },
    optionImagesWrapper: {
        flexDirection: 'row',
        zIndex: 1
    },
    optionImage: {
        height: 25,
        resizeMode: "contain"
    },
    bgColorsWrapper: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50
    },
    bgColorsScrollView: {
        flexDirection: 'row'
    },
    btnBgColor: {
        height: 30,
        width: 30,
    },
    bgColor: {
        height: 30,
        width: 30,
        marginHorizontal: 5,
    },
    bgImage: {
        resizeMode: 'cover',
        height: 30,
        width: 30,
        borderRadius: 10,
        borderWidth: 1,

    },
    toggleBgColors: {
        padding: 5,
        borderWidth: 0,
        position: 'absolute',
        top: 0,
        left: 0
    },
    moreBgColors: {

    }
})