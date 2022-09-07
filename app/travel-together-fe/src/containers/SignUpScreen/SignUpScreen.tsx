import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTogglePasswordVisibility } from './useTogglePasswordVisibility';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { LOGIN } from '../../utilites/routerName';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AlertComponent from '../../components/Alert/AlertComponent';
import axios from 'axios';
import { BASE_URL } from '../../utilites/';
import { UserModel } from '../../model/ModelUser';
import PhoneInput from 'react-native-phone-number-input';
import ModalComponent from '../../components/Modal/ModalComponent';
import AppLoading from '../../components/AppLoader/AppLoading';

const SignUpScreen = () => {

  const [isLoading, setIsLoading] = useState(false);

  const phoneRegExp = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
  const inValidSpace = /\s/;
  // alert state
  const [statusRegis, setStatusRegis] = useState<boolean>(false);

  let dataConfigPopup = {
    title: "Account Created",
    navigation: LOGIN,
    message: "Your account had been created successfully. Please sign in to use your account and enjoy.",
    textButton: "Go To Login"
  }
  const navigation = useNavigation<any>();
  const schema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    username: yup.string().required('User name is required')
      .min(6, 'User name must be larger than 5 characters')
      .matches(/^(\S+$)/g, '* This field cannot contain only blankspaces'),
    email: yup.string().email("Email must be '@' please try again")
      .required("Email is required"),
    phone: yup.string()
      .required('A phone number is required')
      .matches(phoneRegExp, 'Phone number is not valid'),
    password: yup.string().required("Password is required"),
    confirmPassword: yup.string().required("Confirm password is required")
      .oneOf([yup.ref("password")], "Passwords do not match")
  })

  // set default data for form
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    reValidateMode: 'onSubmit'
  });

  // login trigger action
  const submit = async (data: any) => {
    try {
      // set loading
      setIsLoading(true);
      // new phone 
      let newPhone = data.phone.slice(1);
      // user data
      let userRegister: UserModel = {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
        phone: newPhone,
      }
      // model register
      await axios.post(BASE_URL + 'auth/signup', userRegister)
        .then(response => {
          if (response.data.success) {
            setStatusRegis(true);
            setIsLoading(false);
          }
        })
    } catch (error: any) {
      setIsLoading(false);
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

  const navigaToSignIn = () => {
    navigation.dispatch(CommonActions.navigate({
      name: LOGIN
    }))
  }

  // error common like not match password, email exist .etc
  const [error, setError] = useState('');

  // take state
  const { passwordVisibility,
    confirmPasswordVisibility,
    rightIcon, rightIconConfirm,
    handlePasswordVisibility,
    handleConfirmPasswordVisibility
  } = useTogglePasswordVisibility();
  // render
  return (
    <>
      {
        isLoading == true ? <AppLoading /> : <></>
      }
      <SafeAreaProvider>
        <SafeAreaView>
          {/* Modal success */}
          <ModalComponent visible={statusRegis}>
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
              Register account successful
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(LOGIN)}>
              <Text style={styles.buttonModal}>Go to Login</Text>
            </TouchableOpacity>
          </ModalComponent>
          <KeyboardAwareScrollView
            extraScrollHeight={70}
            enableAutomaticScroll={true}
            contentContainerStyle={styles.container}
          >
            <Image
              style={styles.image}
              source={require('../../../assets/register_account_logo.png')}
            />
            {/* FORM Register */}

            <Controller
              name='fullName'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder='Full Name'
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholderTextColor="#A09E9E"
                />
              )}
            />

            {errors.fullName?.message ? <Text style={styles.error}>{errors.fullName?.message}</Text> : null}
            <Controller
              name='username'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder='User Name'
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholderTextColor="#A09E9E"
                />
              )}
            />
            {errors.username?.message ? <Text style={styles.error}>{errors.username?.message}</Text> : null}
            <Controller
              name='phone'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <PhoneInput
                  containerStyle={[styles.input, { height: 54, padding: 0 }]}
                  textContainerStyle={styles.textInput}
                  onChangeFormattedText={onChange}
                  defaultCode="VN"
                  layout='first'
                  withShadow
                />
              )}
            />
            {errors.phone?.message ? <Text style={styles.error}>{errors.phone?.message}</Text> : null}
            <Controller
              name='email'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder='Email'
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholderTextColor="#A09E9E"
                />
              )}
            />
            {errors.email?.message ? <Text style={styles.error}>{errors.email?.message}</Text> : null}

            <Controller
              name='password'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[{ flexDirection: 'row' }, styles.input]}>
                  <TextInput
                    placeholder='Password'
                    onBlur={onBlur}
                    secureTextEntry={passwordVisibility}
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                    style={{
                      width: '95%'
                    }}
                    placeholderTextColor="#A09E9E"
                  />
                  <Pressable onPress={handlePasswordVisibility}>
                    {rightIcon == 'eye' ? <MaterialCommunityIcons name='eye' size={22} color="#B3B3B3" />
                      : <MaterialCommunityIcons name='eye-off' size={22} color="#B3B3B3" />}
                  </Pressable>
                </View>
              )}
            />
            {errors.password?.message ? <Text style={styles.error}>{errors.password?.message}</Text> : null}

            <Controller
              name='confirmPassword'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[{ flexDirection: 'row' }, styles.input]}>
                  <TextInput
                    placeholder='Confirm password'
                    onBlur={onBlur}
                    secureTextEntry={confirmPasswordVisibility}
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                    style={{
                      width: '95%'
                    }}
                    placeholderTextColor="#A09E9E"
                  />
                  <Pressable onPress={handleConfirmPasswordVisibility}>
                    {rightIconConfirm === 'eye' ? <MaterialCommunityIcons name='eye' size={22} color="#B3B3B3" />
                      : <MaterialCommunityIcons name='eye-off' size={22} color="#B3B3B3" />}
                  </Pressable>
                </View>
              )}
            />
            {errors.confirmPassword?.message ? <Text style={styles.error}>{errors.confirmPassword?.message}</Text> : null}
            <TouchableOpacity
              onPress={handleSubmit(submit)}>
              <Text style={styles.button}>Registration</Text>
            </TouchableOpacity>
            {/* END FORM register */}
            {/* Here is create account */}
            <View style={styles.layoutCreateAccount}>
              <Text>Already have an account?</Text>
              <TouchableOpacity onPress={navigaToSignIn}><Text style={{ color: '#0094FF', }}> Sign In</Text></TouchableOpacity>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}

          </KeyboardAwareScrollView>
        </SafeAreaView>
      </SafeAreaProvider >
    </>
  );
}

export default SignUpScreen;