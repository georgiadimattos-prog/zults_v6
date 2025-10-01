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
        <Text style={styles.description}>{description}</Text>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: colors.foreground.default,
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    ...typography.subheadlineMedium,
    color: colors.foreground.default,
    marginBottom: 2,
  },
  description: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
  },
  chevron: {
    width: 16,
    height: 16,
    tintColor: colors.foreground.muted,
    marginLeft: 12,
  },
});
