import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography } from "../../theme";

export default function DisclaimerCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Zults doesn’t provide testing. We connect you securely to trusted
        providers to import your Rezults 💜
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    padding: 20,       // same as NotificationCard
    marginTop: 20,
  },
  text: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
    textAlign: "center"
  },
});
