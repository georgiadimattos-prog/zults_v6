import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../theme";
import ZultsButton from "./ZultsButton";

// 👇 Wrap Rect to make it animatable
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth - 32; // 16px margin each side
const cardHeight = cardWidth / 1.586; // credit card ratio

export default function RezultsCardPlaceholder() {
  const navigation = useNavigation();

  // Animated value for marching ants
  const dashOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(dashOffset, {
        toValue: 20, // dash movement
        duration: 1200,
        useNativeDriver: false, // must be false for SVG
      })
    ).start();
  }, [dashOffset]);

  return (
    <View style={[styles.wrapper, { width: cardWidth, height: cardHeight }]}>
      <Svg height={cardHeight} width={cardWidth} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="19%" stopColor="#4817B2" />
            <Stop offset="36%" stopColor="#3FDBEA" />
            <Stop offset="49%" stopColor="#775DEC" />
            <Stop offset="63%" stopColor="#F200F3" />
            <Stop offset="77%" stopColor="#FA5F21" />
          </LinearGradient>
        </Defs>

        <AnimatedRect
          x="1"
          y="1"
          rx="20"
          ry="20"
          width={cardWidth - 2}
          height={cardHeight - 2}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeDasharray="10,10"
          strokeDashoffset={dashOffset} // 👈 animates!
        />
      </Svg>

      <View style={styles.content}>
        <Text style={styles.title}>No Rezults yet</Text>
        <Text style={styles.subtitle}>Turn your STI results into Rezults</Text>

        <ZultsButton
          label="Get started!"
          type="primary"
          size="medium"
          fullWidth={false}
          onPress={() => navigation.navigate("GetRezultsProvider")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  content: {
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 12,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    marginBottom: -5, // tighter spacing with subtitle
  },
  subtitle: {
    ...typography.bodyRegular,
    fontSize: 14,
    fontWeight: "500",
    color: colors.foreground.soft, // lighter than title
    textAlign: "center",
    marginTop: 0,
  },
});
