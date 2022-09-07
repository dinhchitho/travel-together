import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../redux';

const Home = () => {

  const { user, error } = useSelector(
    (state: ApplicationState) => state.userReducer
  );
  
  return (
    <View>
      <Text>{user.lastName}</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})