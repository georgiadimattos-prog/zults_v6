import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import Navbar from "../../ui/Navbar";
import InfoCard from "../../ui/InfoCard";

// Icons
import cardIcon from "../../../assets/images/card-icon.png";
import labIcon from "../../../assets/images/lab-icon.png";

export default function GetRezults_SelectProviderScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar />

      <ScrollView
        contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Page title + subtitle ─── */}
        <View style={styles.headerBlock}>
          <Text
            style={typography.largeTitleMedium}
            allowFontScaling={false}         // ✅ Apple titles never scale
          >
            Get Rezults
          </Text>

          <Text
            style={[typography.bodyRegular, styles.subtitle]}
            allowFontScaling
            maxFontSizeMultiplier={1.3}      // ✅ consistent with system body scaling
          >
            Choose an option below to get started.
          </Text>
        </View>

        {/* ─── Info Cards ─── */}
        <InfoCard
          title="Already tested?"
          description="Find your test provider to turn your STI results into Rezults."
          icon={cardIcon}
          onPress={() => navigation.navigate("GetRezultsPasteLink")}
        />

        <InfoCard
          title="Need to get tested?"
          description="See providers you can test with to get Rezults."
          icon={labIcon}
          onPress={() => navigation.navigate("NeedToGetTested")}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    marginTop: 32,
    marginBottom: 24, // space below subtitle before content
  },
  subtitle: {
    marginTop: 8, // ✅ Apple-style rhythm between title & subtitle
  },
  content: {
    paddingHorizontal: 16, // ✅ standard gutter
  },
});