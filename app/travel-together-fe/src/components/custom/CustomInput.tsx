import * as React from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import Color from '../../utilites/Color';

interface IProps {
  value: any;
  onChange: Function;
  placeholder?: string;
}

const CustomInput = (props: IProps) => {
  const { value, onChange, placeholder } = props;

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        onChangeText={(val) => {
          onChange(val);
        }}
        value={value}
        placeholder={placeholder}
      />
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    //   flex: 0.8,
    flexDirection: 'row',
    borderColor: Color.grey,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 10,
    gap: 4,
  },
  input: {
    width: '100%',
    marginLeft: 10,
  },
});
