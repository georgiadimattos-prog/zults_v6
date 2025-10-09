// ✅ RezultsCard.js (final Zults baseline)
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
  providerName = "Planned Parenthood",
  testDate = "20 Oct 2025",
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
    fadeIn.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
    slideUp.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) });
  }, []);

  const flipCard = () => {
    rotate.value = withTiming(showBack ? 0 : 180, { duration: 400 });
    setShowBack(!showBack);
    onExpand?.(false);
  };

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    onExpand?.(next);
    iconRotate.value = withTiming(next ? 180 : 0, { duration: 300 });
  };

  // quick flip teaser
  useEffect(() => {
    const timer = setTimeout(() => {
      rotate.value = withTiming(180, { duration: 600 });
      setTimeout(() => {
        rotate.value = withTiming(0, { duration: 600 });
      }, 1200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
      <Animated.View style={[styles.container, entryAnimStyle, styles.tooltipBorder]}>
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
                <Text
                  style={styles.name}
                >
                  {realName}
                </Text>
              )}
              <Text
                style={styles.provider}
              >
                {providerName}
              </Text>
            </View>
            <Text
              style={styles.link}
            >
              Show Rezults
            </Text>
          </View>
        </Animated.View>

        {/* Back */}
        <Animated.View style={[styles.cardBack, backAnimatedStyle]}>
          <View style={styles.backHeader}>
            <Text
              style={styles.testedOn}
            >
              Tested on{" "}
              <Text style={styles.testedDate}>
                {testDate}
              </Text>
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
              "Ureaplasma",
            ].map((label, idx) => (
              <View key={idx} style={styles.pill}>
                <Text
                  style={styles.pillText}
                >
                  {label}
                </Text>
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
  tooltipBorder: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 24,
    padding: 6,
  },
  cardFront: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
  },
  videoCard: { width: "100%", height: "100%" },
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

  // ─── Front ───
  name: {
    ...typography.bodyMedium,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600",
    color: colors.foreground.default,
  },
  provider: {
    ...typography.bodyRegular,
    fontSize: 15,
    lineHeight: 20,
    color: colors.foreground.soft,
  },
  link: {
    ...typography.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.foreground.soft,
    fontWeight: "500",
  },

  // ─── Back ───
  cardBack: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
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

  // ─── Text (back side) ───
  testedOn: {
    ...typography.captionLargeRegular, // ✅ 14 / 18 / -0.07
    color: colors.foreground.soft,
  },
  testedDate: {
    color: colors.foreground.default,
    fontWeight: "600",
  },

  // ─── Pills ───
  pillsBottom: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  pill: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  pillText: {
    ...typography.captionLargeRegular, // ✅ 14pt matches expanded info hierarchy
    color: colors.foreground.default,
    textAlign: "center",
  },
});