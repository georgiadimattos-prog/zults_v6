// components/ui/RezultsCardDemo.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from "react-native-reanimated";

import RezultsCardDemoFront from "./RezultsCardDemoFront";
import RezultsCardDemoBack from "./RezultsCardDemoBack";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth - 32;
const CARD_HEIGHT = CARD_WIDTH / 1.586;

export default function RezultsCardDemo() {
  const [step, setStep] = useState(0); // 0 = front, 1 = back, 2 = expanded caption
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Play scripted sequence
    setTimeout(() => setStep(0), 500); // front
    setTimeout(() => {
      rotate.value = withTiming(180, { duration: 600 }, () => runOnJS(setStep)(1));
    }, 2500); // flip to back
    setTimeout(() => setStep(2), 5000); // expanded caption stage
  }, []);

  // Animated flip styles
  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [0, 180])}deg` }],
    opacity: interpolate(rotate.value, [0, 90, 180], [1, 0, 0]),
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [180, 360])}deg` }],
    opacity: interpolate(rotate.value, [0, 90, 180], [0, 0, 1]),
  }));

  const captions = [
    "This is your Rezults card.",
    "On the back, you’ll see your test date and infections tested.",
    "You can expand for more details here.",
  ];

  return (
    <View style={styles.container}>
      {/* Card wrapper */}
      <View style={styles.cardWrap}>
        <Animated.View style={[styles.card, frontStyle]}>
          <RezultsCardDemoFront realName="John Doe" provider="Sexual Health London" />
        </Animated.View>

        <Animated.View style={[styles.card, backStyle]}>
          <RezultsCardDemoBack />
        </Animated.View>
      </View>

      {/* Caption */}
      <View style={styles.captionWrap}>
        <Text style={styles.caption}>{captions[step]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 40 },
  cardWrap: { width: CARD_WIDTH, height: CARD_HEIGHT },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
  },
  captionWrap: { marginTop: 20, paddingHorizontal: 24 },
  caption: { fontSize: 16, color: "#fff", textAlign: "center" },
});
