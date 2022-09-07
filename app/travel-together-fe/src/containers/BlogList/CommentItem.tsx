import { StyleSheet, Text, View, Image, TouchableOpacity, ActionSheetIOS } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../redux';
import { femaleDefaultImage, maleDefaultImage } from '../../api/Const';
import { AntDesign } from "@expo/vector-icons";
import Color from '../../utilites/Color';

interface IProps {
    id?: string;
    avatar: string;
    fullName: string;
    contentComment: string;
    isLocalGuide: boolean;
}

const CommentItem = (props: IProps) => {

    const { id, fullName, avatar, contentComment, isLocalGuide } = props;

    const { userCurrent } = useSelector(
        (state: ApplicationState) => state.userReducer
    );

    const [textShownComent, setTextShownComment] = useState(false); //To show ur remaining Text
    const [lengthMoreComment, setLengthMoreComment] = useState(false); //to show the "Read more & Less Line"

    const toggleNumberOfLinesComment = () => { //To toggle the show text or hide it
        setTextShownComment(!textShownComent);
    }

    const onTextLayoutComment = useCallback(e => {
        setLengthMoreComment(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
        // console.log(e.nativeEvent);
    }, []);

    const deleteComment = (id: any) => {
        console.log('====================================');
        console.log('Trần Phi Anh Yêu THùy Vy');
        console.log('====================================');
    }

    const showStatusActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options:
                    ["Cancel", "Delete"],
                cancelButtonIndex: 0,
            },
            (buttonIndex) => {
                if (buttonIndex !== 0) {
                    if (buttonIndex == 1) {
                        deleteComment('gaga');
                    }
                }
            }
        )

    };

    return (
        <TouchableOpacity onLongPress={() => showStatusActionSheet()}>
            <View style={[styles.profileContainer]}>
                <View>
                    {
                        userCurrent.gender ? <Image
                            source={{
                                uri: avatar ? avatar : maleDefaultImage
                            }}
                            style={styles.avatar}
                        ></Image>
                            :
                            <Image
                                source={{
                                    uri: avatar ? avatar : femaleDefaultImage
                                }}
                                style={styles.avatar}
                            ></Image>
                    }
                </View>
                <View style={styles.contentComment}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.textFullName}>{fullName} </Text>
                        {isLocalGuide != undefined && isLocalGuide == true &&
                            <AntDesign
                                name="checkcircle"
                                size={11}
                                color={Color.primary}
                            />
                        }
                    </View>
                    <Text
                        onTextLayout={onTextLayoutComment}
                        numberOfLines={textShownComent ? undefined : 2}
                    >
                        {contentComment}
                    </Text>
                    {
                        lengthMoreComment ? <Text
                            onPress={toggleNumberOfLinesComment}
                            style={{ lineHeight: 21, marginTop: 5, color: 'black', fontWeight: '500' }}>{textShownComent ? 'Read less...' : 'Read more...'}</Text>
                            : null
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default CommentItem

const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: 'row',
        paddingVertical: 5
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 1000,
        marginLeft: 10
    },
    imageContainer: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginVertical: 5
    },
    textFullName: {
        fontSize: 14,
        fontWeight: '500'
    },
    contentComment: {
        width: '80%',
        marginLeft: 5,
        alignSelf: 'flex-start',
        borderRadius: 5,
        backgroundColor: '#F0F2F5',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
})