import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LottieView from 'lottie-react-native';
import animationJson from '../../../assets/animation.json'
import { CommonActions, useNavigation } from '@react-navigation/native';
import { LOGIN } from '../../utilites/routerName';
import { Platform, ViewPropTypes  } from 'react-native'
const SplashScreen = () => {

    const navigation = useNavigation();
    useEffect(() => {
        setTimeout(() => {
            navigation.dispatch(CommonActions.navigate({
                name: LOGIN
            }))
        }, 2000);
    }, [])
    
  return (
    <View style={styles.container}>
      <LottieView source={animationJson} autoPlay loop resizeMode='contain'/>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'white',
        height: '100%'
      },
      text: {
        color: "#0094FF",
        fontSize: 24,
        fontWeight: '600',
        marginTop: 150
      }
})