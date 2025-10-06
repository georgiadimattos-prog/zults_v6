import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from "react-native";
import { Video } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { colors, typography } from "../../theme";

import logoIcon from "../../assets/images/rezults-icon.png";
import expandIcon from "../../assets/images/expandIcon.png";
import collapseIcon from "../../assets/images/collapseIcon.png";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth - 32;
const CARD_HEIGHT = CARD_WIDTH / 1.586;

export default function RezultsCard({
  realName = null,
  isVerified = false,
  showRealName = false,
  providerName = "Sexual Health London (SHL)",
  testDate = "25 Sep 2025",
  videoSource = require("../../assets/videos/Card_All_GlowingBorder_25sec.mp4"),
  showExpand = false,
  onExpand,
}) {
  const [showBack, setShowBack] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const rotate = useSharedValue(0);
  const iconRotate = useSharedValue(0);
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(20);

  useEffect(() => {
    // fade + slide on mount
    fadeIn.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    });
    slideUp.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    });
  }, []);

  const flipCard = () => {
    rotate.value = withTiming(showBack ? 0 : 180, { duration: 400 });
    setShowBack(!showBack);
    if (onExpand) onExpand(false);
  };

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    if (onExpand) onExpand(next);
    iconRotate.value = withTiming(next ? 180 : 0, { duration: 300 });
  };

  // card flip auto-demo
  useEffect(() => {
    const timer = setTimeout(() => {
      rotate.value = withTiming(180, { duration: 600 });
      setTimeout(() => {
        rotate.value = withTiming(0, { duration: 600 });
      }, 1200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // reanimated styles
  const entryAnimStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }));

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [0, 180])}deg` }],
    opacity: interpolate(rotate.value, [0, 90, 180], [1, 0, 0]),
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [180, 360])}deg` }],
    opacity: interpolate(rotate.value, [0, 90, 180], [0, 0, 1]),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotate.value}deg` }],
  }));

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <Animated.View style={[styles.container, entryAnimStyle]}>
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

          <Image source={logoIcon} style={styles.logo} resizeMode="contain" />

          <View style={styles.overlay}>
            <View>
              {isVerified && showRealName && realName && (
                <Text style={styles.name}>{realName}</Text>
              )}
              <Text style={styles.provider}>{providerName}</Text>
            </View>
            <Text style={styles.link}>Show Rezults</Text>
          </View>
        </Animated.View>

        {/* Back */}
        <Animated.View style={[styles.cardBack, backAnimatedStyle]}>
          <View style={styles.backHeader}>
            <Text style={styles.testedOn}>
              Tested on <Text style={styles.testedDate}>{testDate}</Text>
            </Text>

            {showExpand && (
              <TouchableWithoutFeedback onPress={toggleExpand}>
                <View style={styles.expandButton}>
                  <Animated.Image
                    source={expanded ? collapseIcon : expandIcon}
                    style={[{ width: 20, height: 20, tintColor: "#FFF" }, iconAnimatedStyle]}
                    resizeMode="contain"
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>

          <View style={styles.pillsBottom}>
            {[
              "Tested negative:",
              "Gonorrhoea",
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
      </Animated.View>
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
    borderRadius: 20,
    overflow: "hidden",
  },
  videoCard: {
    width: "100%",
    height: "100%",
  },
  logo: {
    position: "absolute",
    top: CARD_HEIGHT * 0.06,
    right: CARD_WIDTH * 0.04,
    width: CARD_WIDTH * 0.1,
    height: CARD_WIDTH * 0.1,
    opacity: 0.7,
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: colors.background.surface1,
    padding: 16,
    justifyContent: "space-between",
  },
  backHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expandButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
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
    gap: 3,
  },
  pill: {
    backgroundColor: "#5D5D5D",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  pillText: {
    ...typography.captionSmallRegular,
    color: colors.foreground.default,
    fontSize: 14,
    lineHeight: 16,
    textAlign: "center",
  },
});
