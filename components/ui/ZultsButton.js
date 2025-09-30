// components/ui/ZultsButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
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
  icon,                // 👈 NEW: optional icon source (require(...))
  iconPosition = "left", // 👈 "left" | "right"
}) {
  const containerStyles = [
    styles.base,
    styles[size],
    styles[`${type}${disabled ? "Disabled" : "Active"}`],
    fullWidth && { alignSelf: "stretch" },
    pill && { borderRadius: 9999 },
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
    <View style={styles.content}>
      {icon && iconPosition === "left" && (
        <Image
          source={icon}
          style={[styles.icon, { tintColor: textStyles?.color || "#C2C2C2" }]}
          resizeMode="contain"
        />
      )}
      <Text style={textStyles} allowFontScaling>
        {label}
      </Text>
      {icon && iconPosition === "right" && (
        <Image
          source={icon}
          style={[styles.icon, { tintColor: textStyles?.color || "#C2C2C2" }]}
          resizeMode="contain"
        />
      )}
    </View>
  </TouchableOpacity>
);
}

const styles = StyleSheet.create({
  // Base
  base: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 18,
    height: 18,
    marginHorizontal: 6,
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
    backgroundColor: colors.neutral[0],
  },
  primaryDisabled: {
    backgroundColor: "#7B7B7B",
  },

  secondaryActive: {
    backgroundColor: "#292929",
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

  brandActive: {
    backgroundColor: colors.brand.purple1,
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
    color: colors.button.activeLabelPrimary,
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
  text_brandActive: {
    color: colors.neutral[0],
  },
  text_brandDisabled: {
    color: "#404040",
  },
});