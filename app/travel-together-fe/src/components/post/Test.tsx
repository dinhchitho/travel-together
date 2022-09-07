import React, { useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';

import { Dimensions } from 'react-native';

interface componentNameProps {}

const Test = (props: componentNameProps) => {
  const translation = useRef(
    new Animated.Value(Dimensions.get('window').width)
  ).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: 0,
      delay: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });

  return (
    <View>
      <Animated.View
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'orange',
          transform: [{ translateX: translation }],
        }}
      ></Animated.View>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {},
});
