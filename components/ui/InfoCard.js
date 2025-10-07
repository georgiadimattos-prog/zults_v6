import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors, typography } from "../../theme";
import arrowRight from "../../assets/images/navbar-arrow-right.png";

export default function InfoCard({ title, description, icon, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Left Icon */}
      {icon && <Image source={icon} style={styles.icon} />}

      {/* Text Block */}
      <View style={styles.textBlock}>
  <Text style={styles.title}>{title}</Text>
  <Text
    style={styles.description}
    allowFontScaling={true}
    maxFontSizeMultiplier={1.3}   // 👈 makes it behave exactly like the page subtitle
  >
    {description}
  </Text>
</View>

      {/* Chevron */}
      <Image source={arrowRight} style={styles.chevron} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.surface2,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: colors.foreground.default,
    marginRight: 12,
  },
  textBlock: { flex: 1 },
  title: {
  ...typography.bodyMedium,
  fontSize: 15,        // ⬇️ slightly smaller than subtitle
  lineHeight: 20,
  color: colors.foreground.default,
  marginBottom: 3,
  includeFontPadding: false,
},

description: {
  ...typography.bodyRegular,
  fontSize: 14,                // ⬇️ slightly smaller
  lineHeight: 20,
  color: colors.foreground.soft,
  opacity: 0.8,                // 👈 reduces brightness so it sits back visually
  includeFontPadding: false,
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.3,  // ✅ scales just like subtitle
},
  chevron: {
    width: 20,
    height: 20,
    tintColor: colors.foreground.muted,
    marginLeft: 12,
  },
});
