import React, { useEffect, useImperativeHandle, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  log,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Color from "../../utilites/Color";
import { WINDOW_HEGIHT } from "../../utilites/Dimensions";

interface BottomSheetProps {
  maxHeight: number;
  children?: React.ReactNode;
  onClose: () => void;
}

export interface BottomSheetRefProps {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
}

const MAX_HEIGHT = -WINDOW_HEGIHT / 1.5;

const BottomModal = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ maxHeight, children, onClose }, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const context = useSharedValue({ y: 0 });

    const [enable, setEnable] = useState<boolean>(false);

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((e) => {
        translateY.value = e.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, -WINDOW_HEGIHT + 350);
      })
      .onEnd((e) => {
        if (translateY.value > -450) {
          translateY.value = withSpring(WINDOW_HEGIHT, { damping: 50 });
        }
        if (translateY.value < -WINDOW_HEGIHT / 2) {
          translateY.value = withSpring(maxHeight, { damping: 50 });
        }
      });

    const scrollTo = (destination: number) => {
      active.value = destination !== 0;
      translateY.value = withSpring(destination, { damping: 50 });
    };

    const isActive = () => {
      return active.value;
    };

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    useEffect(() => {
      translateY.value = withSpring(200, { damping: 50 });
    }, []);

    const rBottomSheetStyle = useAnimatedStyle((): any => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    return (
      <>
        {/* {enable ? ( */}
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.botomContainer, rBottomSheetStyle]}>
            {children}
          </Animated.View>
        </GestureDetector>
        {/* ) : null} */}
      </>
    );
  }
);

export default BottomModal;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
  },
  botomContainer: {
    height: WINDOW_HEGIHT,
    width: "100%",
    backgroundColor: Color.white,
    position: "absolute",
    top: WINDOW_HEGIHT / 1.5,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
  button: {
    aspectRatio: 1,
    width: 50,
    backgroundColor: Color.grey,
    borderRadius: 25,
    opacity: 0.6,
  },
  content: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
