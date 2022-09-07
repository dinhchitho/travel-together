import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, LogBox, StatusBar, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import { store } from "./src/redux";
import AppNavContainer from "./src/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OverlayProvider, DeepPartial, Theme } from "stream-chat-expo";
import "react-native-gesture-handler";
import "./src/components/usePagination";
const theme: DeepPartial<Theme> = {
  messageSimple: {
    file: {
      container: {
        backgroundColor: "red",
      },
    },
  },
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();

    // when turn off app will disconnect
    // return () => client.disconnectUser();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  const ignoreWarns = [
    "Setting a timer for a long period of time",
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation",
    "ViewPropTypes will be removed",
    "AsyncStorage has been extracted from react-native",
    "EventEmitter.removeListener",
    "Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in %s.%s, a useEffect cleanup function"
  ];
  const warn = console.warn;
  console.warn = (...arg) => {
    for (let i = 0; i < ignoreWarns.length; i++) {
      if (arg[0].startsWith(ignoreWarns[i])) return;
    }
    warn(...arg);
  };

  LogBox.ignoreLogs(ignoreWarns);
  //Ignore all log notifications
  LogBox.ignoreAllLogs();
  return (
    <SafeAreaProvider
      style={{ flex: 1, backgroundColor: "white" }}
      onLayout={onLayoutRootView}
    >
      <OverlayProvider value={{ style: theme }}>
        <Provider store={store}>
          <AppNavContainer />
        </Provider>
      </OverlayProvider>
    </SafeAreaProvider>
  );
}
