import React, { useRef, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { colors, typography } from "../../theme";

export default function ChatTopActions({ status, onRequest, onTooltip, highlightViewCTA }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [lockRequested, setLockRequested] = useState(false);

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

  // 🕒 Temporary lock after pressing "Request Rezults"
  useEffect(() => {
    if (lockRequested) {
      const t = setTimeout(() => setLockRequested(false), 5000);
      return () => clearTimeout(t);
    }
  }, [lockRequested]);

  return (
    <View style={styles.container}>
      {/* 🟢 Request Rezults */}
      {status === "request" && (
        <TouchableOpacity
          style={[styles.button, styles.primary]}
          onPress={() => {
            if (lockRequested) return; // prevent spam
            setLockRequested(true);
            onRequest?.();
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText} allowFontScaling maxFontSizeMultiplier={1.3}>
            Request Rezults
          </Text>
        </TouchableOpacity>
      )}

      {/* 🟡 Rezults Requested */}
      {(status === "requested" || lockRequested) && (
        <View style={[styles.button, styles.disabled]}>
          <Text style={styles.buttonText} allowFontScaling maxFontSizeMultiplier={1.3}>
            Rezults Requested
          </Text>
        </View>
      )}

      {/* 🩵 View Rezults */}
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
            <Text
              style={[styles.buttonText, { color: "#fff" }]}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
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
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: colors.foreground.default,
  },
  disabled: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  buttonText: {
    ...typography.buttonMediumMedium,
    color: colors.background.surface1,
    includeFontPadding: false,
    textAlign: "center",
  },
});