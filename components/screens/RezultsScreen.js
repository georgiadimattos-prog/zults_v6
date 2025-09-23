import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { colors, typography } from "../../theme";

import expandIcon from "../../assets/images/expandIcon.png";
import collapseIcon from "../../assets/images/collapseIcon.png";

const CARD_WIDTH = 343;
const CARD_HEIGHT = 216;
const CARD_HEIGHT_EXPANDED = 520;

export default function RezultsCard({
  userName = "John Doe",
  providerName = "Sexual Health London",
  testDate = "12 Dec 2025",
  videoSource = require("../../assets/videos/Card_All_GlowingBorder_25sec.mp4"),
}) {
  const [showBack, setShowBack] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const rotate = useSharedValue(0);
  const cardHeight = useSharedValue(CARD_HEIGHT);

  const flipCard = () => {
    rotate.value = withTiming(showBack ? 0 : 180, { duration: 400 });
    setShowBack(!showBack);
  };

  const toggleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    cardHeight.value = withTiming(
      newExpanded ? CARD_HEIGHT_EXPANDED : CARD_HEIGHT,
      { duration: 400 }
    );
  };

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [0, 180])}deg` }],
    opacity: interpolate(rotate.value, [0, 90, 180], [1, 0, 0]),
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [180, 360])}deg` }],
    opacity: interpolate(rotate.value, [0, 90, 180], [0, 0, 1]),
    height: cardHeight.value,
  }));

  return (
    <TouchableWithoutFeedback onPress={!expanded ? flipCard : undefined}>
      <View style={styles.container}>
        {/* Front */}
        <Animated.View style={[styles.frontWrapper, frontAnimatedStyle]}>
          {/* Glow video background */}
          <Video
            source={videoSource}
            style={styles.glowVideo}
            isLooping
            shouldPlay
            isMuted
            resizeMode="cover"
          />

          {/* Card overlay */}
          <View style={styles.cardOverlay}>
            <View>
              <Text style={styles.name}>{userName}</Text>
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
            <TouchableWithoutFeedback onPress={toggleExpand}>
              <View style={styles.expandButton}>
                <Image
                  source={expanded ? collapseIcon : expandIcon}
                  style={{ width: 16, height: 16 }}
                  resizeMode="contain"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.pillsContainer}>
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

          {expanded && (
            <ScrollView
              style={styles.expandedBox}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.expandedText}>
                These Rezults were created from home-tests completed on 12 Dec
                2025, using{" "}
                <Text style={styles.linkText}>Sexual Health London (SHL)</Text>.
              </Text>

              <Text style={styles.expandedTitle}>Infection Window Periods</Text>
              <Text style={styles.expandedText}>
                Some STIs take time to show up in results, meaning a recent
                infection might not be detected right away.
              </Text>
              <Text style={styles.expandedText}>
                • Chlamydia & Gonorrhoea: ~2 weeks{"\n"}
                • Syphilis, Hep B & C: 6–12 weeks{"\n"}
                • HIV: ~6 weeks
              </Text>

              <Text style={styles.expandedTitle}>ID Verification</Text>
              <Text style={styles.expandedText}>
                These are at-home tests, we can't fully guarantee who took the
                test. If you see a blue tick next to someone’s profile, it
                means:{"\n"}
                • We verified their name matches their test provider’s results{"\n"}
                • Their photo matches their official ID
              </Text>

              <Text style={styles.expandedText}>
                Rezults are a tool for safer dating but they don’t replace other
                protections. Using condoms is still the most reliable way to
                protect against STIs.
              </Text>
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    alignSelf: "center",
  },
  frontWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    borderRadius: 13,
    overflow: "visible", // ✅ allow glow to bleed out
  },
  glowVideo: {
    position: "absolute",
    width: CARD_WIDTH + 80, // ✅ extend beyond
    height: CARD_HEIGHT + 80,
    top: -40,
    left: -40,
  },
  cardOverlay: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.neutral[0],
    backgroundColor: "rgba(0,0,0,0.3)", // ✅ subtle overlay so text is readable
    padding: 16,
    justifyContent: "space-between",
    flexDirection: "row",
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
    backgroundColor: colors.background.surface1,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.neutral[0],
    padding: 16,
  },
  backHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  testedOn: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
  },
  testedDate: {
    color: colors.foreground.default,
    fontWeight: "500",
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
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
  expandedBox: {
    marginTop: 8,
  },
  expandedTitle: {
    ...typography.bodyMedium,
    fontSize: 14,
    fontWeight: "500",
    color: colors.foreground.default,
    marginTop: 16,
    marginBottom: 8,
  },
  expandedText: {
    ...typography.bodyRegular,
    fontSize: 14,
    color: colors.foreground.soft,
    marginBottom: 8,
    lineHeight: 18,
  },
  linkText: {
    color: colors.neutral[0],
    textDecorationLine: "underline",
  },
});
