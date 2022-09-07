import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { POST_BLOG } from '../../utilites/routerName';
import { ApplicationState } from '../../redux';
import { useSelector } from 'react-redux';
import { femaleDefaultImage, maleDefaultImage } from '../../api/Const';

const PostTool = () => {

    const navigation = useNavigation<any>();

    const navigateToPostBlog = () => {
        navigation.navigate(POST_BLOG);
    }

    // current user from redux
    const { user, error, userCurrent } = useSelector(
        (state: ApplicationState) => state.userReducer
    );

    return (
        <View style={styles.container}>
            <View>
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
            </View>
            <TouchableOpacity onPress={() => navigateToPostBlog()}>
                <View style={styles.input}>
                    <Text>What's on your mind?</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default PostTool

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        alignItems: "center",
        paddingHorizontal: 5,
        marginTop: 2
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

    }
})