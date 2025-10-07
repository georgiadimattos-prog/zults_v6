import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { colors, typography } from "../../theme";
import * as Haptics from "expo-haptics";

export default function ZultsButton({
  label,
  type = "primary",
  size = "large",
  fullWidth = true,
  disabled = false,
  pill = false,
  onPress,
  style,
  icon,
  iconPosition = "left",
}) {
  const containerStyles = [
    styles.base,
    styles[size],
    styles[`${type}${disabled ? "Disabled" : "Active"}`],
    fullWidth && { alignSelf: "stretch" },
    pill && { borderRadius: 9999 },
    style,
  ];

  const textStyle =
    size === "large"
      ? disabled
        ? typography.buttonLargeRegular
        : typography.buttonLargeMedium
      : size === "small"
      ? disabled
        ? typography.buttonSmallRegular
        : typography.buttonSmallMedium
      : disabled
      ? typography.buttonMediumRegular
      : typography.buttonMediumMedium;

  const colorStyle = styles[`text_${type}${disabled ? "Disabled" : "Active"}`];

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
            style={[styles.icon, { tintColor: colorStyle.color }]}
            resizeMode="contain"
          />
        )}
        <Text style={[textStyle, colorStyle]} maxFontSizeMultiplier={1.2}>
          {label}
        </Text>
        {icon && iconPosition === "right" && (
          <Image
            source={icon}
            style={[styles.icon, { tintColor: colorStyle.color }]}
            resizeMode="contain"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  large: { height: 56, paddingHorizontal: 20, borderRadius: 12 },
  medium: { height: 48, paddingHorizontal: 20, borderRadius: 10 },
  small: { height: 40, paddingHorizontal: 20, borderRadius: 8 },

  // Variants
  primaryActive: { backgroundColor: colors.neutral[0] },
  primaryDisabled: { backgroundColor: "#7B7B7B" },

  secondaryActive: { backgroundColor: "#292929" },
  secondaryDisabled: { backgroundColor: "#292929" },

  ghostActive: { backgroundColor: "transparent" },
  ghostDisabled: { backgroundColor: "transparent" },

  brandActive: { backgroundColor: colors.brand.purple1 },
  brandDisabled: { backgroundColor: "#7B7B7B" },

  // Text colors
  text_primaryActive: { color: colors.button.activeLabelPrimary },
  text_primaryDisabled: { color: "#404040" },
  text_secondaryActive: { color: "#D5D5D5" },
  text_secondaryDisabled: { color: "#5D5D5D" },
  text_ghostActive: { color: "#C2C2C2" },
  text_ghostDisabled: { color: "#5D5D5D" },
  text_brandActive: { color: colors.neutral[0] },
  text_brandDisabled: { color: "#404040" },
});