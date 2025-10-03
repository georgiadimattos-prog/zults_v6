// components/ui/RezultsCardTooltip.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { colors, typography } from "../../theme";

const { width } = Dimensions.get("window");

export default function RezultsCardTooltip({ targetLayouts, onFinish }) {
  const [stepIndex, setStepIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const steps = [
    { key: "profile", text: "This is your profile picture, username and badge." },
    { key: "realName", text: "Here’s your real name. If verified, you can hide it when sharing." },
    { key: "provider", text: "This shows the provider where your Rezults came from." },
    { key: "button", text: "And here’s the Show Rezults button to flip your card." },
  ];

  const step = steps[stepIndex];
  const highlight = targetLayouts[step.key];

  const nextStep = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    else onFinish?.();
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Dim background */}
      <View style={styles.overlay} pointerEvents="none" />

      {/* Highlight target */}
      {highlight && (
        <View
          style={[
            styles.highlight,
            {
              top: highlight.y,
              left: highlight.x,
              width: highlight.width,
              height: highlight.height,
            },
          ]}
          pointerEvents="none"
        />
      )}

      {/* Tooltip box */}
      <View style={styles.tooltipContainer}>
        <Animated.View style={[styles.tooltip, { opacity: fadeAnim }]}>
          <Text style={styles.tooltipText}>{step.text}</Text>
          <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>
              {stepIndex < steps.length - 1 ? "Next" : "Done"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  highlight: {
    position: "absolute",
    borderWidth: 2,
    borderColor: colors.brand.purple1,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  tooltipContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  tooltip: {
    backgroundColor: "rgba(0,0,0,0.85)",
    padding: 20,
    borderRadius: 14,
    maxWidth: width * 0.85,
    alignItems: "center",
  },
  tooltipText: {
    ...typography.bodyRegular,
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.brand.purple1,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
  },
  buttonText: {
    ...typography.buttonMediumMedium,
    color: "#fff",
  },
});