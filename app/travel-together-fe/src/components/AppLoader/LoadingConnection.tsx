import { StyleSheet, Text, View, Image, Button } from 'react-native'
import React from 'react'
import NetInfo from '@react-native-community/netinfo';
import Color from '../../utilites/Color';

export const checkConnected = () => {
    return NetInfo.fetch().then(state => {
        return state.isConnected;
    });
}

interface IProps {
    checkConnection: Function
}

const LoadingConnection = (props: IProps) => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://png.pngtree.com/png-vector/20220615/ourmid/pngtree-lost-wireless-connection-or-disconnected-cable-png-image_5085743.png' }}
                style={{ width: '100%', height: '50%' }}
                resizeMode="contain"
            />
            <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '500', color: Color.text_grey }}>No internet connection found. Check your connection or <Text style={{ color: Color.primary }} onPress={() => props.checkConnection}>try again</Text></Text>
        </View>
    )
}

export default LoadingConnection

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});