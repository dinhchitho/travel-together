import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from "@expo/vector-icons";
import Color from '../../utilites/Color';
interface IProps {
    dataSourceImage: any[]
}
const ImageItem = (props: IProps) => {
    const { dataSourceImage } = props

    return (
        <FlatList
            data={dataSourceImage}
            renderItem={({ item, index }) => (
                <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                    <Image style={styles.imageThumbnail} source={{ uri: item }} />
                </View>

            )}
            //Setting the number of column
            numColumns={3}
        />
    )
}


export default ImageItem

const styles = StyleSheet.create({
    imageThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 120,
    },
})