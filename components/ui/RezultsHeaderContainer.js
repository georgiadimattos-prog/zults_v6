import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors, typography } from "../../theme";

import addIcon from "../../assets/images/add.png";
import deleteIcon from "../../assets/images/delete-icon.png";

export default function RezultsHeaderContainer({ onAdd, onDelete }) {
  return (
    <View style={styles.container}>
      {/* Left Title */}
      <Text style={styles.title}>Your Rezults</Text>

      {/* Right Actions */}
      <View style={styles.actions}>
        {/* Delete button */}
        <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
          <Image
  source={deleteIcon}
  style={[styles.iconSmall, { tintColor: colors.neutral[0] }]} // 👈 white
  resizeMode="contain"
/>
        </TouchableOpacity>

        {/* Add button */}
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Image
            source={addIcon}
            style={styles.iconSmall}
            resizeMode="contain"
          />
          <Text style={styles.addText}>New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    ...typography.bodyMedium,
    fontSize: 18,
    fontWeight: "500",
    color: colors.foreground.default,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  addText: {
    ...typography.bodyRegular,
    fontSize: 14,
    fontWeight: "400",
    color: "#141414",
  },
  iconSmall: {
    width: 20,
    height: 20,
  },
});
