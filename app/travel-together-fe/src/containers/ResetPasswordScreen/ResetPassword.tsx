import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import Color from '../../utilites/Color';
import axios from 'axios';
import { BASE_URL } from '../../utilites';
import ModalComponent from '../../components/Modal/ModalComponent';
import { navigationRef } from '../../navigation/RootNavigator';
import { LOGIN } from '../../utilites/routerName';

const ResetPassword = () => {

    const route = useRoute();

    const navigation = useNavigation<any>();

    const [visible, setVisible] = React.useState(false);

    const { userId }: any = route.params || {};

    // console.log('====================================');
    // console.log(userId);
    // console.log('====================================');
    const schema = yup.object().shape({
        newPass: yup.string().required("Password is required"),
        confirmNewPass: yup.string().required("Confirm password is required")
            .oneOf([yup.ref("newPass")], "Passwords do not match")
    })

    // set default data for form
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            newPass: '',
            confirmNewPass: ''
        },
        reValidateMode: 'onSubmit'
    });

    const submitReset = async (data: any) => {
        try {
            await axios.post(BASE_URL + `change-password?userId=${userId}&newPassword=${data.newPass}`)
                .then(response => {
                    // console.log('====================================');
                    // console.log(response.data);
                    // console.log('====================================');
                    if (response.data.success) {
                        setVisible(true);
                    }
                })
        } catch (error: any) {
            Alert.alert(
                "Error",
                //body
                `${error.response.data.error[0].message}`,
                [
                    {
                        text: 'OK', onPress: () => console.log("OK")
                    },
                ],
                { cancelable: true },
            );
        }
    }

    return (
        <SafeAreaView style={styles.container}>


            {/* Modal success */}
            <ModalComponent visible={visible}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.header}>
                        <TouchableOpacity>
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
                    Change password was successful
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate(LOGIN)}>
                    <Text style={styles.buttonModal}>Go to Login</Text>
                </TouchableOpacity>
            </ModalComponent>
            <View style={styles.layout}>
                <Text style={styles.title}>Create new password</Text>
                <Text style={styles.text}>
                    Your new password must be diffrent from previous used passwords
                </Text>
            </View>
            <Controller
                name='newPass'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder='New Password'
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={true}
                        placeholderTextColor="#A09E9E"

                    />
                )}
            />
            {errors.newPass?.message ? <Text style={styles.error}>{errors.newPass?.message}</Text> : null}

            <Controller
                name='confirmNewPass'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder='Confirm new password'
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={true}
                        placeholderTextColor="#A09E9E"
                    />
                )}
            />
            {errors.confirmNewPass?.message ? <Text style={styles.error}>{errors.confirmNewPass?.message}</Text> : null}

            <TouchableOpacity
                onPress={handleSubmit(submitReset)}>
                <Text style={styles.button}>Reset Password</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default ResetPassword

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    layout: {
        width: 345
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'left',
        color: Color.primary
    },
    text: {
        marginTop: 15,
        marginBottom: 15
    },
    input: {
        fontSize: 15,
        borderWidth: 1,
        padding: 13,
        width: 345,
        borderRadius: 3,
        backgroundColor: 'white',
        borderColor: '#D6D6D6',
        marginTop: 15
    },
    button: {
        fontSize: 18,
        color: 'white',
        marginTop: 20,
        borderRadius: 3,
        width: 345,
        backgroundColor: '#0094FF',
        padding: 10,
        textAlign: 'center',
    },
    buttonModal: {
        fontSize: 18,
        color: 'white',
        marginTop: 20,
        borderRadius: 3,
        backgroundColor: '#0094FF',
        padding: 10,
        textAlign: 'center',
    },
    error: {
        fontSize: 11,
        color: 'red',
        marginTop: 5,
        marginBottom: 0,
        marginLeft: 36,
        marginRight: 36,
        textAlign: 'left',
        width: 345
    },
    header: {
        width: '100%',
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
})