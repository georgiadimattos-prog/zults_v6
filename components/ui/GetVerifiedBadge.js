import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, typography } from "../../theme";

export default function NotificationCard({ text, onPress }) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Action</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.surface2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  text: {
    ...typography.captionSmallRegular, // ✅ replaced `caption`
    color: colors.foreground.soft,
    marginBottom: 12,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: colors.button.activeBackgroundPrimary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    ...typography.bodyMedium, // ✅ replaced `captionMedium`
    color: colors.button.activeLabelPrimary,
  },
});
