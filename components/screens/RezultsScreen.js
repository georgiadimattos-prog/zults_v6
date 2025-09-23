// components/screens/RezultsScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography } from "../../theme";
import ScreenWrapper from "../ui/ScreenWrapper";

export default function RezultsScreen() {
  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Rezults</Text>
        <Text style={styles.subtitle}>
          This is where Rezults details will appear.
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background.surface1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...typography.headlineMedium,
    color: colors.foreground.default,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.muted,
  },
});
