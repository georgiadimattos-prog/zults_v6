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
  daysLeft = 43,
}) {
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
        <Text style={styles.label}>Expires</Text>
        <Text style={styles.date}>{expiryDate}</Text>
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
          <Text style={styles.progressText}>{daysLeft} days left</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CONTAINER_WIDTH,       // ✅ exactly same width as card
    borderRadius: 20,
    backgroundColor: colors.background.surface2,
    padding: 16,
    alignSelf: "center",          // ✅ keep it centered
    marginTop: 16,                // ✅ controlled gap below card
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    ...typography.bodyMedium,
    fontSize: 18,
    fontWeight: "500",
    color: colors.foreground.default,
  },
  date: {
    ...typography.bodyRegular,
    fontSize: 14,
    fontWeight: "400",
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
    ...typography.captionSmallRegular,
    fontSize: 12,
    fontWeight: "400",
    color: "#FFF",
    opacity: 0.8,
  },
});
