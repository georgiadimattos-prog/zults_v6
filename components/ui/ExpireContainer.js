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

export default function ExpireContainer({ expiryDate = "20 Jan 2026" }) {
  const daysLeft = 75; // demo lock
  const percentLeft = daysLeft / 92;

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(percentLeft, { duration: 1200 });
  }, [percentLeft]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.wrapper}>
      {/* ─── Header row ─── */}
      <View style={styles.row}>
        <Text style={styles.label} allowFontScaling={1.3}>
          Expires
        </Text>
        <Text
          style={styles.date}
          allowFontScaling
          maxFontSizeMultiplier={1.2}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {expiryDate}
        </Text>
      </View>

      {/* ─── Progress bar ─── */}
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

        {/* ─── Centered “days left” label ─── */}
        <View style={styles.progressLabelWrapper}>
          <Text style={styles.progressText} allowFontScaling maxFontSizeMultiplier={1.2}>
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

  // ─── Title & Date ───
  label: {
    ...typography.title4Medium,     // ✅ 18 / 24 / -0.18
    color: colors.foreground.default,
  },
  date: {
    ...typography.captionLargeRegular, // ✅ 14 / 18
    color: colors.foreground.soft,
  },

  // ─── Progress bar ───
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
    fontFamily: typography.captionSmallRegular.fontFamily, // ✅ Zults Diatype regular
    fontSize: 12,
    lineHeight: 16,
    color: "rgba(255,255,255,0.8)", // ✅ 80% white opacity
    textAlign: "center",
  },
});
