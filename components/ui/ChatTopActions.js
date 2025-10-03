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
        <TouchableOpacity style={styles.button} onPress={onRequest}>
          <Text style={styles.buttonText}>Request Rezults</Text>
        </TouchableOpacity>
      )}

      {status === "requested" && (
        <View style={[styles.button, styles.disabled]}>
          <Text style={styles.buttonText}>Requested</Text>
        </View>
      )}

      {status === "view" && (
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.button, highlightViewCTA && { backgroundColor: colors.brand.purple1 }]}
            onPress={onTooltip}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>View Rezults</Text>
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
  borderRadius: 9999,   // 👈 full pill
  backgroundColor: colors.brand.purple1,
},
buttonText: {
  ...typography.buttonMediumMedium,
  color: colors.button.activeLabelPrimary,
},
  disabled: {
    opacity: 0.4,
  },
});
