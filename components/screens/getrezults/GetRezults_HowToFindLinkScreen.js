import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import Navbar from "../../ui/Navbar";

const COMMON_STEPS = [
  "Open your results report.",
  "Scroll to the end of the report.",
  "Tap “Share results link.”",
  "Copy the generated link.",
  "Paste it into the previous screen.",
  "Only your latest results link can be used. Links older than 3 months are not valid.",
];

const PROVIDER_INTROS = {
  shl: "Sign in to your SHL account.",
  randox: "Sign in to your Randox account.",
  pp: "Sign in to your Planned Parenthood account.",
};

const PROVIDER_NAMES = {
  shl: "Sexual Health London",
  randox: "Randox Health",
  pp: "Planned Parenthood",
};

export default function GetRezults_HowToFindLinkScreen() {
  const route = useRoute();
  const providerId = route.params?.providerId ?? "shl";

  const steps = useMemo(() => {
    const intro = PROVIDER_INTROS[providerId] || "Open your provider account.";
    return [intro, ...COMMON_STEPS];
  }, [providerId]);

  const providerName = useMemo(
    () => PROVIDER_NAMES[providerId] || "your provider",
    [providerId]
  );

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar />

      <ScrollView
        contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── Header ─── */}
        <View style={styles.headerBlock}>
          <Text style={typography.largeTitleMedium}>
            How to find your link
          </Text>

          <Text
            style={[typography.bodyRegular, styles.subtitle]}
          >
            Follow these steps in your {providerName} account to find and copy your results link.
          </Text>
        </View>

        {/* ─── Steps ─── */}
        {steps.map((s, i) => (
          <View key={i} style={styles.stepRow}>
            <Text
              style={styles.stepNumber}
            >
              {i + 1}.
            </Text>
            <View style={{ flex: 1 }}>
              <Text
                style={styles.stepText}
              >
                {s}
              </Text>
            </View>
          </View>
        ))}

        {/* ─── Video Tutorial Section ─── */}
        <View style={styles.videoContainer}>
          <Text
            style={styles.tutorialTitle}
          >
            Watch the video tutorial
          </Text>

          <View style={styles.tutorialBox}>
            <Text style={styles.tutorialStub}>Video placeholder</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
  },
  subtitle: {
    flexShrink: 1,
    flexWrap: "wrap",
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 16,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepNumber: {
    ...typography.bodyMedium, // ✅ 15/20 medium
    color: colors.foreground.default,
    marginRight: 8,
  },
  stepText: {
    flex: 1,
    flexWrap: "wrap",
    ...typography.bodyRegular, // ✅ 15/20 regular
    color: colors.foreground.soft,
    lineHeight: 22,
  },
  videoContainer: {
    marginTop: 32,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.background.surface2,
  },
  tutorialTitle: {
    ...typography.title4Medium, // ✅ 18 / 24 / -0.18
    color: colors.foreground.default,
    marginBottom: 12,
  },
  tutorialBox: {
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.background.surface2,
    alignItems: "center",
    justifyContent: "center",
  },
  tutorialStub: {
    ...typography.captionSmallRegular, // ✅ 12 / 16
    color: colors.foreground.soft,
  },
});