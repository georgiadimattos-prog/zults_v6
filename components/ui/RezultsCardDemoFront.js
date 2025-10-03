import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const CARD_BG = "#0F0F10";
const CARD_INSET = "rgba(255,255,255,0.08)";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth - 32;
const CARD_HEIGHT = CARD_WIDTH / 1.586;

export default function RezultsCardDemoFront({
  realName = "John Doe",
  provider = "Sexual Health London",
  onFlip,
  realNameRef,
  providerRef,
  buttonRef,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.overlay}>
        <View>
          <Text ref={realNameRef} style={styles.name}>
            {realName}
          </Text>
          <Text ref={providerRef} style={styles.provider}>
            {provider}
          </Text>
        </View>
        <Text ref={buttonRef} style={styles.link} onPress={onFlip}>
          Show Rezults
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_INSET,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
  },
  provider: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
  },
  link: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
  },
});
