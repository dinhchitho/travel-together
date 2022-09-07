import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Color from '../../utilites/Color';

interface IProps {
  minAge: number;
  maxAge: number;
  setMinAge: any;
  setMaxAge: any;
}

const TIME = { min: 18, max: 60 };
const SliderPad = 12;

const CustomSlide = (props: IProps) => {
  const { min, max } = TIME;
  const [width, setWidth] = React.useState(280);
  const [selected, setSelected] = React.useState<any>(null);

  const { minAge, maxAge, setMinAge, setMaxAge } = props;

  if (!selected) {
    setSelected([min, max]); // we are only selected min, since it is single slider
  }

  // Callbacks
  const onLayout = (event: any) => {
    setWidth(event.nativeEvent.layout.width - SliderPad * 2);
  };
  const onValuesChange = (values: any) => {
    setSelected(values);
    setMinAge(values[0]);
    setMaxAge(values[1]);
  };

  return (
    <View
      onLayout={onLayout}
      style={{
        justifyContent: 'center',
        paddingHorizontal: 12,
      }}
    >
      <MultiSlider
        min={min}
        max={max}
        allowOverlap
        onValuesChange={onValuesChange}
        values={selected}
        sliderLength={width}
        // onValuesChangeFinish={onValuesChangeFinish}
        // enableLabel={true}
        trackStyle={{
          height: 8,
          borderRadius: 8,
        }}
        markerOffsetY={3}
        selectedStyle={{
          backgroundColor: Color.primary,
        }}
        unselectedStyle={{
          backgroundColor: '#EEF3F7',
        }}
      />
    </View>
  );
};

export default CustomSlide;

const styles = StyleSheet.create({
  container: {},
});
