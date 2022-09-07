import React, { useEffect, useContext, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { navigationRef } from './RootNavigator';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../redux';
import HomeNavigator from './MainNavigator';
import LoadingConnection, { checkConnected } from '../components/AppLoader/LoadingConnection';



const AppNavContainer = () => {

  const { user, error } = useSelector(
    (state: ApplicationState) => state.userReducer
  );

  //   const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  //   const [authLoaded, setAuthLoaded] = React.useState(false);

  //   const getUser = async () => {
  //     try {
  //       const user = await AsyncStorage.getItem('user');
  //       if (user) {
  //         setAuthLoaded(true);

  //         setIsAuthenticated(true);
  //       } else {
  //         setAuthLoaded(true);

  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {}
  //   };
  //   useEffect(() => {
  //     getUser();
  //   }, [isLoggedIn]);

  // take access token
  const token = user ? user.accessToken : null;

  const [loading, setLoading] = useState(true);

  const [connectStatus, setConnectStatus] = useState<Boolean>(false)

  checkConnected().then((res: any) => {
    setConnectStatus(res)
  })

  const init = async () => {
    // await dispatch(Init());
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };

  return (
    <NavigationContainer theme={navTheme} ref={navigationRef}>
      <StatusBar backgroundColor='black' barStyle='light-content' />
      {
        connectStatus == true ? token == null || undefined ? <AuthNavigator /> : <HomeNavigator /> :
          <LoadingConnection checkConnection={checkConnected} />
      }
    </NavigationContainer>
  );
};

export default AppNavContainer;
