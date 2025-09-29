// components/ui/UnverifiedBadge.js
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { typography } from "../../theme";
import warningIcon from "../../assets/images/warning.png";

export default function UnverifiedBadge() {
  return (
    <View style={styles.badge}>
      <Image source={warningIcon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
        Get Verified
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B1111", // 🔴 subtle dark red container
    borderRadius: 200,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  text: {
    ...typography.captionSmallRegular,
    color: "#F13636", // bright red text
    fontSize: 12,
    letterSpacing: -0.06,
  },
});