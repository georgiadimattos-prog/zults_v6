import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { colors, typography } from "../../theme";

const screenWidth = Dimensions.get("window").width;
const CONTAINER_WIDTH = screenWidth - 32; // ✅ match RezultsCard + Share button

export default function ExpireContainer({
  expiryDate = "29 Sep 2025",
}) {
  const daysLeft = 43; // ✅ demo lock
  const percentLeft = daysLeft / 90;

  // animate fill
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(percentLeft, { duration: 1200 });
  }, [percentLeft]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.label} maxFontSizeMultiplier={1.2}>
          Expires
        </Text>
        <Text style={styles.date} maxFontSizeMultiplier={1.2}>
          {expiryDate}
        </Text>
      </View>

      <View style={styles.progressWrapper}>
        <View style={styles.progressBg} />
        <Animated.View style={[styles.fillWrapper, animatedStyle]}>
          <LinearGradient
            colors={["#1E1E1E", "#4C4C4C"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.progressFill}
          />
        </Animated.View>
        <View style={styles.progressLabelWrapper}>
          <Text style={styles.progressText} maxFontSizeMultiplier={1.2}>
            {daysLeft} days left
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CONTAINER_WIDTH,
    borderRadius: 20,
    backgroundColor: colors.background.surface2,
    padding: 16,
    alignSelf: "center",
    marginTop: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    ...typography.bodyMedium,     // ✅ body size (scales to 1.2)
    fontWeight: "500",
    color: colors.foreground.default,
  },
  date: {
    ...typography.bodyRegular,    // ✅ subtitle baseline
    color: colors.foreground.default,
  },
  progressWrapper: {
    width: "100%",
    height: 24,
    borderRadius: 100,
    overflow: "hidden",
    justifyContent: "center",
  },
  progressBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#292929",
    borderRadius: 100,
  },
  fillWrapper: {
    height: "100%",
    borderRadius: 100,
    overflow: "hidden",
  },
  progressFill: {
    flex: 1,
  },
  progressLabelWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    ...typography.subheadlineRegular,  // ✅ smaller, but scales to 1.2
    color: "#FFF",
    opacity: 0.8,
  },
});