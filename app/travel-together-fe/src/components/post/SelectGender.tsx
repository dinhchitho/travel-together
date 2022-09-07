import React, { useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { GENDER } from '../../api/Const';
import Color from '../../utilites/Color';
import { WINDOW_WIDTH } from '../../utilites/Dimensions';
import BuddyTitle from './BuddyTitle';

interface IProps {
  genderSelect: string;
  onChange: Function;
}

const SelectGender = (props: IProps) => {
  const { genderSelect, onChange } = props;

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
    <>
      <BuddyTitle
        flex={0.35}
        title='Whom you are looking for?'
        description='Type of traveller you are looking for to travel together?'
      ></BuddyTitle>
      <Animated.View
        style={{ flex: 0.8, transform: [{ translateX: translation }] }}
      >
        <View style={styles.genderWrapper}>
          {GENDER.map((item, index) => (
            <TouchableOpacity
              style={[
                styles.genderCard,
                genderSelect === item.name ? styles.genderActive : null,
              ]}
              key={index}
              onPress={() => onChange(item.name)}
            >
              <Image
                style={styles.genderImage}
                source={{
                  uri: item.imageURL,
                }}
              ></Image>
              <Text style={styles.genderText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
};

export default SelectGender;

const styles = StyleSheet.create({
  stepContent: {
    flex: 0.8,
  },
  genderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderCard: {
    padding: 10,
    borderColor: '#C3C6C9',
    borderWidth: 2,
    // border: '1px solid #C3C6C9',
    borderRadius: 10,
  },
  genderActive: {
    borderColor: Color.primary,
  },
  genderImage: {
    width: 80,
    height: 90,
  },
  genderText: {
    textAlign: 'center',
  },
});
