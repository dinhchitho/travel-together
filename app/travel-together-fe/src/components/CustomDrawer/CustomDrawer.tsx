import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react';
import { DrawerContentScrollView, DrawerItemList, } from '@react-navigation/drawer';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { Logout } from '../../redux/actions/loginAction';
import { useChatContext } from 'stream-chat-expo';
const CustomDrawer = (props: any) => {
    const dispatch = useDispatch();

    // take client from connected chat
    const { client } = useChatContext();

    const logoutAction = () => {
        dispatch<any>(Logout());
        // disconnect user from chat
        client.disconnectUser();
    }
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}
                contentContainerStyle={{ backgroundColor: '#9DF5DC' }}>
                <ImageBackground source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_bK7XvxmuU3LjHFOPVqhphYfVy14H8afzpA&usqp=CAU' }} style={{ padding: 20 }}>
                    <Image source={{ uri: 'https://reactjs.org/logo-og.png' }} style={{
                        height: 80, width: 80, borderRadius: 40, marginBottom: 10
                    }} />
                    <Text style={{ color: 'white', fontSize: 18 }}>AnhTP</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'white' }}>200 coins</Text>
                        <FontAwesome5 name="coins" size={24} color="#fff" />
                    </View>
                </ImageBackground>
                <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
      
                <TouchableOpacity onPress={() => { logoutAction() }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name='exit-outline' size={22} />
                        <Text style={{fontSize: 15, marginLeft: 5, fontWeight: '500'}}>Sign Out</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomDrawer

const styles = StyleSheet.create({})