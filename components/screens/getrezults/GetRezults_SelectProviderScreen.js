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
        {/* Page title + subtitle */}
        <View style={styles.headerBlock}>
          <Text style={typography.largeTitleMedium} allowFontScaling={false}>
            Get Rezults
          </Text>
          <Text style={typography.bodyRegular} maxFontSizeMultiplier={1.2}>
            Choose an option below to get started.
          </Text>
        </View>

        {/* Info Cards */}
        <InfoCard
          title="Add Rezults"
          description="Link your test provider to turn your STI results into Rezults."
          icon={cardIcon}
          onPress={() => navigation.navigate("GetRezultsPasteLink")}
        />

        <InfoCard
          title="Need to get tested?"
          description="See providers you can test with and connect your Rezults."
          icon={labIcon}
          onPress={() => navigation.navigate("ProvidersList")}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,   // space below subtitle before content
  },
  content: {
    paddingHorizontal: 16, // ✅ consistent Apple gutter
  },
});