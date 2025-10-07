import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { colors, typography } from "../../../../theme";
import ScreenWrapper from "../../../ui/ScreenWrapper";
import Navbar from "../../../ui/Navbar";

export default function LinkScreenSuccess() {
  const link = "https://demolink";

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(link);
    Alert.alert("Copied!", "Link copied to clipboard.");
  };

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar title="Link" />

      <View style={styles.linkCard}>
        {/* ─── Header Row ─── */}
        <View style={styles.linkRow}>
          <Text
            style={styles.linkLabel}
            allowFontScaling={false} // ✅ lock label
          >
            Rezults-link
          </Text>

          <Text
            style={styles.linkStatus}
            allowFontScaling
            maxFontSizeMultiplier={1.2} // ✅ micro text cap
          >
            ● Online
          </Text>
        </View>

        {/* ─── Link Box ─── */}
        <View style={styles.linkBox}>
          <Text
            style={styles.linkText}
            numberOfLines={1}
            ellipsizeMode="middle"
            allowFontScaling
            maxFontSizeMultiplier={1.3} // ✅ user-facing link
          >
            .../share/jonster/id8765
          </Text>

          <TouchableOpacity onPress={copyToClipboard}>
            <Text
              style={styles.copyIcon}
              allowFontScaling={false} // ✅ icon locked
            >
              📋
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Stop Sharing ─── */}
        <TouchableOpacity style={styles.stopButton}>
          <Text
            style={styles.stopButtonText}
            allowFontScaling
            maxFontSizeMultiplier={1.2} // ✅ button label cap
          >
            Stop Sharing
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  linkCard: {
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 32, // ✅ Apple rhythm
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  linkLabel: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
  },
  linkStatus: {
    ...typography.captionSmallRegular,
    color: "#00D775",
  },
  linkBox: {
    backgroundColor: colors.background.surface3,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  linkText: {
    ...typography.inputText,
    color: colors.foreground.default,
    flexShrink: 1,
  },
  copyIcon: {
    fontSize: 18,
    color: colors.foreground.default,
  },
  stopButton: {
    backgroundColor: colors.neutral[0],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  stopButtonText: {
    ...typography.bodyMedium,
    color: colors.button.activeLabelPrimary,
  },
});
