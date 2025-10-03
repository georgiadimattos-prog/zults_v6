import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const CARD_BG = "#0F0F10";
const CARD_INSET = "rgba(255,255,255,0.2)";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth - 32;
const CARD_HEIGHT = CARD_WIDTH / 1.586;

export default function RezultsCardDemoBack({
  testDate = "25 Sep 2025",
  results = ["Gonorrhoea", "HIV", "Syphilis", "Chlamydia"],
}) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.backHeader}>
        <Text style={styles.testedOn}>
          Tested on <Text style={styles.testedDate}>{testDate}</Text>
        </Text>
      </View>

      {/* Pills */}
      <View style={styles.pillsRow}>
        {results.map((r, i) => (
          <View key={i} style={styles.pill}>
            <Text style={styles.pillText}>{r}</Text>
          </View>
        ))}
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
    padding: 16,
    justifyContent: "space-between",
  },
  backHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  testedOn: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
  },
  testedDate: {
    fontWeight: "600",
    color: "#fff",
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  pill: {
    backgroundColor: "#5D5D5D",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    margin: 2,
  },
  pillText: {
    fontSize: 12,
    color: "#fff",
  },
});