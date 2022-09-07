import React, { useState, useRef, useEffect } from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { Checkbox } from 'react-native-paper';

import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import BuddyTitle from './BuddyTitle';

import { TRIP_TYPE } from '../../api/Const';
import Color from '../../utilites/Color';
import TripTypeIcon from './TripTypeIcon';
import { WINDOW_WIDTH } from '../../utilites/Dimensions';

interface IProps {
  value: any;
  onChange: any;
}

const SelectTripType = (props: IProps) => {
  const { value, onChange } = props;

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
        title='My Trip...'
        description='What is your trip plan?'
        flex={0.1}
      ></BuddyTitle>
      <Animated.View
        style={{
          flex: 0.8,
          paddingTop: 20,
          transform: [{ translateX: translation }],
        }}
      >
        {TRIP_TYPE?.length > 0 &&
          TRIP_TYPE.map(
            ({ id, icon, name, radio_object }: any, index: number) => (
              <TripTypeItem
                radio_object={radio_object}
                key={id}
                icon={icon}
                name={name}
                id={id}
                value={value}
                index={index}
                onPress={(value: any) => {
                  onChange(value, name);
                }}
              ></TripTypeItem>
            )
          )}
      </Animated.View>
    </>
  );
};

export default SelectTripType;

interface TripTypeItemProps {
  id: number;
  icon: any;
  name: string;
  radio_object: any;
  onPress: Function;
  index: number;
  value: any;
}

const TripTypeItem = (props: TripTypeItemProps) => {
  const { id, icon, name, radio_object, onPress, index, value } = props;

  return (
    <RadioForm formHorizontal={true}>
      <TouchableOpacity
        style={styles.tripTypeWrapper}
        onPress={() => {
          onPress(index);
        }}
      >
        <View style={styles.tripTypeIcon}>
          <TripTypeIcon name={name}></TripTypeIcon>
        </View>
        <View style={styles.tripTypeContent}>
          <View style={styles.tripTypeTitle}>
            <Text style={styles.tripTypeTitleText}>{name}</Text>
          </View>
          <View style={styles.tripTypeCheckbox}>
            <RadioButton labelHorizontal={true} key={id}>
              <RadioButtonInput
                obj={radio_object}
                index={id}
                isSelected={value === index}
                buttonInnerColor={Color.primary}
                buttonOuterColor={'#909293'}
                buttonSize={20}
                buttonOuterSize={20}
                buttonStyle={{ borderWidth: 2 }}
                onPress={(value) => {
                  onPress(value);
                }}
                // buttonWrapStyle={{ marginLeft: 10 }}
              />
            </RadioButton>
          </View>
        </View>
      </TouchableOpacity>
    </RadioForm>
  );
};

const styles = StyleSheet.create({
  stepContent: {
    flex: 0.8,
    paddingTop: 20,
  },
  tripTypeWrapper: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  tripTypeIcon: {
    flex: 0.1,
    justifyContent: 'center',
  },
  tripTypeContent: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#ECEDEE',
    padding: 15,
    paddingRight: 0,
    paddingLeft: 5,
  },
  tripTypeTitle: {
    flex: 1,
  },
  tripTypeTitleText: {
    fontSize: 16,
    color: '#909293',
  },
  tripTypeCheckbox: {},
});
