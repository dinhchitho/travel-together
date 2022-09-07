import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SocialSignInButtons from '../../components/CustomSocialButton/SocialButton';
import { useTogglePasswordVisibility } from './useTogglePasswordVisibility';
import styles from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { onLogin } from '../../redux/actions/loginAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { FORGOTPASS, LOGIN, REGISTER } from '../../utilites/routerName';
import { ApplicationState } from '../../redux';
import AppLoading from '../../components/AppLoader/AppLoading';
import axios from 'axios';
import { BASE_URL } from '../../utilites';

const SignInScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const schema = yup.object().shape({
    username: yup.string().required('User name is required')
      .min(6, 'User name must be larger than 5 characters')
      .matches(/^(\S+$)/g, '* This field cannot contain only blankspaces'),
    password: yup.string().required("Password is required")
  })

  // set default data for form
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: ''
    },
    reValidateMode: 'onSubmit'
  });

  const { user, error } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  const [isLoad, setIsload] = useState<boolean>(false);

  // login trigger action
  const submit = async (data: any) => {

    let username = data.username;
    let password = data.password
    try {
      let response = await axios.post(`${BASE_URL}auth/signin`, {
        username,
        password
      });
      if (response.data.success) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.data.accessToken}`;
        if (response.data.data.accessToken) {
          let res2 = await axios.get(`${BASE_URL}user/current-user`);
          if (res2.data.success) {
            dispatch<any>(onLogin(response.data.data, res2.data.data));
          } else {
            Alert.alert(
              "Error",
              //body
              `Username or password incorrect!`,
              [
                {
                  text: 'OK', onPress: () => console.log("OK")

                },
              ],
              { cancelable: true },
            );
          }
        }
      } else {
        Alert.alert(
          "Error",
          //body
          `Username or password incorrect!`,
          [
            {
              text: 'OK', onPress: () => console.log("OK")

            },
          ],
          { cancelable: true },
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        //body
        `Username or password incorrect!`,
        [
          {
            text: 'OK', onPress: () => console.log("OK")
          },
        ],
        { cancelable: true },
      );
    }
  }

  const navigaToSignUp = () => {
    navigation.dispatch(CommonActions.navigate({
      name: REGISTER
    }))
  }

  const navigaToForgot = () => {
    navigation.dispatch(CommonActions.navigate({
      name: FORGOTPASS
    }))
  }

  useEffect(() => {
    (async () => {
      return () => {
        setIsload(false);
      };
    })();
  }, [isLoad]);

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  return (
    <>
      {
        isLoad == true ? <AppLoading /> : <></>
      }
      <KeyboardAwareScrollView
        extraScrollHeight={70}
        enableAutomaticScroll={true}
        contentContainerStyle={styles.container}>
        <Image
          style={styles.image}
          source={require('../../../assets/signin_logo.png')}
        />
        {/* FORM LOGIn */}
        <Controller
          name='username'
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Username'
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor="#A09E9E"
              autoCapitalize='none'
            />
          )}
        />
        {errors.username?.message ? <Text style={styles.error}>{errors.username?.message}</Text> : null}
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
        <TouchableOpacity onPress={navigaToForgot}><Text style={styles.forgotPass}>Forgot password?</Text></TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit(submit)}>
          <Text style={styles.button}>Login</Text>
        </TouchableOpacity>
        {/* END FORM LOGIn */}
        <Text style={[{ color: '#757575' }, styles.text]}>Or connect with</Text>
        {/* Here is group button sign in */}
        <SocialSignInButtons />
        {/* Here is create account */}
        <View style={styles.layoutCreateAccount}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={navigaToSignUp}><Text style={{ color: '#0094FF', }}> Sign Up</Text></TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>
    </>
  );
}

export default SignInScreen;