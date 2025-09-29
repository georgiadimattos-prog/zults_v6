// components/ui/ZultsButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, typography } from "../../theme";
import * as Haptics from "expo-haptics";

export default function ZultsButton({
  label,
  type = "primary",   // "primary" | "secondary" | "ghost" | "brand"
  size = "large",      // "large" | "medium" | "small"
  fullWidth = true,
  disabled = false,
  pill = false,        // 👈 NEW: force pill style
  onPress,
  style,
}) {
  const containerStyles = [
    styles.base,
    styles[size],
    styles[`${type}${disabled ? "Disabled" : "Active"}`],
    fullWidth && { alignSelf: "stretch" },
    pill && { borderRadius: 9999 }, // 👈 override with pill radius
    style,
  ];

  const textStyles = [
    styles.textBase,
    styles[`text_${size}`],
    styles[`text_${type}${disabled ? "Disabled" : "Active"}`],
  ];

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.();
    }
  };

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <Text style={textStyles} allowFontScaling>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Base
  base: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Sizes
  large: {
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  medium: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  small: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  // Variants
  primaryActive: {
    backgroundColor: colors.neutral[0], // white
  },
  primaryDisabled: {
    backgroundColor: "#7B7B7B",
  },

  secondaryActive: {
    backgroundColor: "#292929", // dark gray
  },
  secondaryDisabled: {
    backgroundColor: "#292929",
  },

  ghostActive: {
    backgroundColor: "transparent",
  },
  ghostDisabled: {
    backgroundColor: "transparent",
  },

  // NEW: Brand purple variant
  brandActive: {
    backgroundColor: colors.brand.purple1, // ✅ brand purple
  },
  brandDisabled: {
    backgroundColor: "#7B7B7B",
  },

  // Text
  textBase: {
    textAlign: "center",
  },
  text_large: {
    ...typography.buttonLargeRegular,
  },
  text_medium: {
    ...typography.buttonMediumRegular,
  },
  text_small: {
    ...typography.buttonSmallRegular,
  },

  // Text colors per variant
  text_primaryActive: {
    color: colors.button.activeLabelPrimary, // #141414
  },
  text_primaryDisabled: {
    color: "#404040",
  },

  text_secondaryActive: {
    color: "#D5D5D5",
  },
  text_secondaryDisabled: {
    color: "#5D5D5D",
  },

  text_ghostActive: {
    color: "#C2C2C2",
    fontFamily: "ZultsDiatype-Medium",
  },
  text_ghostDisabled: {
    color: "#5D5D5D",
  },

  // Text colors for brand
  text_brandActive: {
    color: colors.neutral[0], // white text on purple
  },
  text_brandDisabled: {
    color: "#404040",
  },
});
