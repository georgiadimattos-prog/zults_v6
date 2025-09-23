import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Video } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { colors, typography } from "../../theme";

const CARD_WIDTH = 343;
const CARD_HEIGHT = 216;

export default function RezultsCard({
  userName = "John Doe",
  providerName = "Sexual Health London",
  testDate = "12 Dec 2025",
  videoSource = require("../../assets/videos/Card_All_GlowingBorder_25sec.mp4"),
}) {
  const [showBack, setShowBack] = useState(false);

  const rotate = useSharedValue(0);

  const flipCard = () => {
    rotate.value = withTiming(showBack ? 0 : 180, { duration: 400 });
    setShowBack(!showBack);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [0, 180])}deg` }],
    opacity: interpolate(rotate.value, [0, 90, 180], [1, 0, 0]),
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [180, 360])}deg` }],
    opacity: interpolate(rotate.value, [0, 90, 180], [0, 0, 1]),
  }));

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View style={styles.container}>
        {/* Front */}
        <Animated.View style={[styles.cardFront, frontAnimatedStyle]}>
          <Video
            source={videoSource}
            style={styles.videoCard}
            isLooping
            shouldPlay
            isMuted
            resizeMode="cover"
          />

          <View style={styles.overlay}>
            <View>
              <Text style={styles.name}>{userName}</Text>
              <Text style={styles.provider}>{providerName}</Text>
            </View>
            <Text style={styles.link}>Show Rezults</Text>
          </View>
        </Animated.View>

        {/* Back */}
        <Animated.View style={[styles.cardBack, backAnimatedStyle]}>
          {/* Top: test date */}
          <View style={styles.backHeader}>
            <Text style={styles.testedOn}>
              Tested on <Text style={styles.testedDate}>{testDate}</Text>
            </Text>
          </View>

          {/* Bottom: pills */}
          <View style={styles.pillsBottom}>
            {[
              "Tested negative:",
              "Gonorrhea",
              "HIV",
              "Syphilis",
              "Chlamydia",
              "Hepatitis B",
              "Hepatitis C",
              "Gardnerella",
              "Trichomoniasis",
              "Ureaplasma",
              "Mycoplasma",
            ].map((label, idx) => (
              <View key={idx} style={styles.pill}>
                <Text style={styles.pillText}>{label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  cardFront: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 13,
    overflow: "hidden",
  },
  videoCard: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  name: {
    ...typography.bodyMedium,
    fontSize: 18,
    fontWeight: "500",
    color: colors.neutral[0],
  },
  provider: {
    ...typography.bodyRegular,
    fontSize: 14,
    color: colors.foreground.soft,
  },
  link: {
    ...typography.bodyMedium,
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
  cardBack: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)", // ✅ lighter border
    backgroundColor: colors.background.surface1,
    padding: 16,
    justifyContent: "space-between", // ✅ space test date top / pills bottom
  },
  backHeader: {
    alignItems: "flex-start",
  },
  testedOn: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
  },
  testedDate: {
    color: colors.foreground.default,
    fontWeight: "500",
  },
  pillsBottom: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  pill: {
    backgroundColor: "#5D5D5D",
    borderRadius: 36,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pillText: {
    ...typography.captionSmallRegular,
    color: colors.foreground.default,
    fontSize: 12,
  },
});
