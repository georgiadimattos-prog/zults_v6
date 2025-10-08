import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function RezultsActionButton({ status, onPress }) {
  const disabled = status === "requested";
  const label =
    status === "view"
      ? "View Rezults"
      : status === "requested"
      ? "Rezults Requested"
      : "Request Rezults";

  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : null}
      activeOpacity={0.8}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#9747FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 28,
    alignSelf: "center",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  disabled: { opacity: 0.5 },
});
