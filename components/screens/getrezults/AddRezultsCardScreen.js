import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import RezultsCard from "../../ui/RezultsCard";
import ZultsButton from "../../ui/ZultsButton";

export default function AddRezultsCardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { providerId, resultsLink } = route.params || {};

  const handleAddRezults = () => {
    navigation.navigate("MainUnverifiedWithRezults");
  };

  const handleCancel = () => {
    navigation.navigate("MainScreen");
  };

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ Title + subtitle with spacing */}
        <Text style={styles.pageTitle}>Your Rezults</Text>
        <Text style={styles.paragraph}>
          By clicking “Add Rezults”, you confirm the information is yours and it
          is accurate.
        </Text>

        {/* RezultsCard */}
        <RezultsCard
          userName="John Doe"
          providerName="Sexual Health London"
          testDate="12 Dec 2025"
        />

        {/* Hint under card */}
        <Text style={styles.flipHint}>Tap your Rezults to see reverse</Text>
      </ScrollView>

      {/* Buttons */}
      <ZultsButton
        label="Add Rezults"
        type="primary"
        size="large"
        fullWidth
        onPress={handleAddRezults}
        style={styles.button}
      />
      <ZultsButton
        label="Cancel"
        type="secondary"
        size="large"
        fullWidth
        onPress={handleCancel}
        style={[styles.button, { bottom: 100 }]}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 48, // ✅ added: push everything down from status bar
    paddingBottom: 200,
    gap: 24,
    alignItems: "center",
  },
  pageTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 16,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
  },
  paragraph: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 32, // ✅ extra breathing space before RezultsCard
    lineHeight: 20,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
  },
  flipHint: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
    marginTop: 16,
    textAlign: "center",
  },
  button: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 40,
    zIndex: 100,
  },
});
