import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import ModalComponent from './ModalComponent'

const ModalMain = (vs: any) => {

    const [visible, setVisible] = React.useState(true);
   
    return (
        <ModalComponent visible={visible}>
            <View style={{ alignItems: 'center' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setVisible(false)}>
                        <Image
                            source={require('../../../assets/x.png')}
                            style={{ height: 30, width: 30 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('../../../assets/success.png')}
                    style={{ height: 150, width: 150, marginVertical: 10 }}
                />
            </View>
            <Text style={{ marginVertical: 30, fontSize: 20, textAlign: 'center' }}>
                Congratulations registration was successful
            </Text>
        </ModalComponent>
    )
}

export default ModalMain

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
})