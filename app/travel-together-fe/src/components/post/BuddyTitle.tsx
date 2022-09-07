import React, { useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { WINDOW_WIDTH } from '../../utilites/Dimensions';

interface IProps {
  title: string;
  description: string;
  flex?: number;
}

const BuddyTitle = (props: IProps) => {
  const { title, description, flex } = props;

  const translation = useRef(new Animated.Value(WINDOW_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: 0,
      delay: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  });

  return (
    <Animated.View
      style={{ flex: flex, transform: [{ translateX: translation }] }}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Animated.View>
  );
};

export default BuddyTitle;

const styles = StyleSheet.create({
  title: { textAlign: 'center', fontSize: 20, fontWeight: '600' },
  description: { textAlign: 'center' },
});
