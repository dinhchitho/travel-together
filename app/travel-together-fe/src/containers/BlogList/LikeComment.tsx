import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Color from '../../utilites/Color';
interface IProps {
    id: string;
    comments: Comment[];
}
const LikeComment = () => {

    // const {
    //     id,
    //     comments,
    //   } = props

    return (
        <View style={styles.likeCommentContainer}>
            <View style={styles.like}>
                <AntDesign name="hearto" size={24} color="black" />
                <Text style={styles.textLikeComment}>18 Likes</Text>
            </View>
            <View style={styles.comment}>
                <Ionicons name="chatbox-outline" size={24} color="black" />
                <TouchableOpacity
                // onPress={() => {
                //     openBottomModal();
                // }}
                >
                    <Text style={[styles.textLikeComment, { textAlign: 'right' }]}>200 Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LikeComment

const styles = StyleSheet.create({
    likeCommentContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Color.grey
    },
    like: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    comment: {
        flexDirection: 'row',
        alignContent: "flex-end",
        textAlign: 'end',
        width: '50%',
    },
    textLikeComment: {
        fontSize: 14,
        paddingLeft: 10,
        fontWeight: '500',
        marginTop: 2
    },
})