import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Color from '../../utilites/Color'
import { Entypo } from '@expo/vector-icons';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { COMMENT_DETAIL } from '../../utilites/routerName';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../redux';
import axios from 'axios';
import { BASE_URL } from '../../utilites';
import { updateNotification } from '../../redux/actions/notification.actions';

interface INotifications {
    id: string,
    createUser: string,
    createdDate: string,
    lastModifiedUser: string,
    updateDttm: string,
    content: string,
    thumbnail: string,
    permalink: string,
    read: boolean,
    type: string,
    fullName: string,
}

const ItemNotification = (props: INotifications) => {

    // data props
    const { id, content, createUser, read, permalink, thumbnail, createdDate, type, fullName } = props;

    // date new format
    const [dateFormat, setDateFormat] = useState('');

    const navigation = useNavigation<any>();

    const dispatch = useDispatch();

    // re render when createDate change
    useEffect(() => {
        if (props && props.createdDate) {
            setDateFormat(moment.utc(createdDate).local().startOf('seconds').fromNow())
        }
    }, [createdDate]);

    // user current in redux
    const { user, userCurrent } = useSelector(
        (state: ApplicationState) => state.userReducer
    );

    // navigation link to detail event
    const navigationToDetail = async () => {
        // update in store
        dispatch<any>(updateNotification(id));
        navigation.navigate(COMMENT_DETAIL, { id: permalink, fullName: userCurrent.fullName, thumbnail, type: type });
    }

    return (
        <TouchableOpacity>
            <View style={[styles.container, read ? { backgroundColor: 'white' } : { backgroundColor: 'rgb(230,242,255)' }]}>
                <TouchableOpacity style={{ width: '90%', flexDirection: 'row' }} onPress={() => navigationToDetail()}>
                    <View style={styles.leftContent}>
                        <View>
                            <Image
                                source={{
                                    uri: thumbnail ? thumbnail : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/OOjs_UI_icon_userAvatar-constructive.svg/2048px-OOjs_UI_icon_userAvatar-constructive.svg.png"
                                }}
                                style={styles.imageAvatar}
                            ></Image>
                        </View>
                    </View>
                    <View style={styles.rightContent}>
                        <Text style={[styles.textStyle]}>
                            <Text style={{ fontWeight: "bold" }}>{fullName}</Text>
                            <Text style={styles.textStyle}>{content}</Text>
                        </Text>
                        <View style={styles.dateTimeStyle}>
                            <Text style={styles.textDateTime}>{dateFormat}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.iconStyleRight}>
                    <TouchableOpacity>
                        <Entypo name="dots-three-horizontal" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ItemNotification

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 80,
        width: '100%',
    },
    rightContent: {
        width: '70%',
        justifyContent: 'center',
        paddingTop: 8,
        alignContent: 'center'
    },
    leftContent: {
        width: '25%',
        padding: 5,
        paddingLeft: 10,
    },
    imageAvatar: {
        backgroundColor: 'white',
        width: 65,
        height: 65,
        borderRadius: 400 / 2
    },
    layoutContent: {
        flexDirection: 'row',
        flexGrow: 1,
        flexWrap: 'wrap',
        alignContent: 'center'
    },
    textStyle: {
        fontSize: 15,
        lineHeight: 20,
        alignContent: 'center',
        alignItems: 'center',
        paddingTop: 15
    },
    iconStyleRight: {
        justifyContent: 'center',
        padding: 5,
        width: '10%'
    },
    dateTimeStyle: {
        marginBottom: 15,
    },
    textDateTime: {
        fontSize: 14,
        color: '#9b9e9c'
    }
})