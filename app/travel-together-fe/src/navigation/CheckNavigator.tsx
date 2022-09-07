import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EDIT_INFORMATION_PROFILE } from '../utilites/routerName';
import EditProfileFirstLogin from '../containers/ProfileScreen/EditProfileFirstLogin';

const CheckNavigator = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator >
            <Stack.Screen
                name={EDIT_INFORMATION_PROFILE}
                component={EditProfileFirstLogin}
                options={{
                    headerShown: true,
                    title: "Update information",
                    headerBackVisible: false,
                }}
            />

        </Stack.Navigator>
    )
}

export default CheckNavigator

const styles = StyleSheet.create({})