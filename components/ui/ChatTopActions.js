import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { colors, typography } from "../../theme";

export default function ChatTopActions({ status, onRequest, onTooltip, highlightViewCTA }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (highlightViewCTA && status === "view") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [highlightViewCTA, status]);

  return (
    <View style={styles.container}>
      {status === "request" && (
        <TouchableOpacity
          style={[styles.button, styles.primary]}
          onPress={onRequest}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText} allowFontScaling maxFontSizeMultiplier={1.3}>
            Request Rezults
          </Text>
        </TouchableOpacity>
      )}

      {status === "requested" && (
        <View style={[styles.button, styles.disabled]}>
          <Text style={styles.buttonText} allowFontScaling maxFontSizeMultiplier={1.3}>
            Requested
          </Text>
        </View>
      )}

      {status === "view" && (
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primary,
              highlightViewCTA && { backgroundColor: colors.brand.purple1 },
            ]}
            onPress={onTooltip}
            activeOpacity={0.85}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]} allowFontScaling maxFontSizeMultiplier={1.3}>
              View Rezults
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },

  // ─── Buttons ───
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999, // full pill
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: colors.foreground.default, // white button base
  },
  disabled: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  // ─── Text ───
  buttonText: {
    ...typography.buttonMediumMedium, // ✅ 15 / 20 medium weight
    color: colors.background.surface1, // black text for white button
    includeFontPadding: false,
    textAlign: "center",
  },
});
