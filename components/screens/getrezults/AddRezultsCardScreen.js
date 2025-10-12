import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import RezultsCard from "../../ui/RezultsCard";
import ZultsButton from "../../ui/ZultsButton";
import Navbar from "../../ui/Navbar";
import ScreenFooter from "../../ui/ScreenFooter";
import { rezultsCache } from "../../../cache/rezultsCache";

export default function AddRezultsCardScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ Provider name passed from previous screen
  const { providerId, fromManualUpload } = route.params || {};
  const isManual = fromManualUpload === true;

  // ✅ Provider name mapping (expanded list)
  const PROVIDERS = {
    pp: "Planned Parenthood",
    soapoli: "Soapoli-Online",
    shl: "Sexual Health London",
    shuk: "SH.UK",
    sh24: "SH:24",
    randox: "Randox Health",
    testme: "TestMe",
    testforme: "TestForMe",
    openhouse: "Open House",
    luud: "Luud Health",
  };

  const providerName = PROVIDERS[providerId?.toLowerCase()] || "Manual Upload";

  // ✅ Use manual-upload card if it exists
  const existingCard = rezultsCache?.card;

  const handleAddRezults = () => {
    // Manual uploads already have full info — just save and go home
    if (isManual && existingCard) {
      console.log("💾 Confirmed manual upload card:", existingCard);
    } else if (!existingCard) {
      // Provider-link (demo) fallback → use fake John Doe card
      rezultsCache.hasRezults = true;
      rezultsCache.card = {
        realName: "John Doe",
        isVerified: true,
        showRealName: true,
        providerName,
        testDate: "20 Oct 2025",
      };
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "MainScreen" }],
    });
  };

  const handleCancel = () => {
    rezultsCache.hasRezults = false;
    rezultsCache.card = null;
    navigation.reset({
      index: 0,
      routes: [{ name: "MainScreen" }],
    });
  };

  // ✅ Pick which card to display in preview
  const cardToShow =
    isManual && existingCard
      ? {
          realName: existingCard.realName,
          isVerified: existingCard.isVerified,
          showRealName: existingCard.showRealName,
          providerName: existingCard.providerName,
          testDate: existingCard.testDate,
        }
      : {
          realName: "John Doe",
          isVerified: true,
          showRealName: true,
          providerName,
          testDate: "12 Dec 2025",
        };

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar
        onBackPress={() =>
          navigation.reset({
            index: 1,
            routes: [
              { name: "MainScreen" },
              { name: "GetRezultsSelectProvider" },
            ],
          })
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Your Rezults</Text>

          <Text style={[typography.bodyRegular, styles.subtitle]}>
            By tapping <Text style={styles.highlight}>Add Rezults</Text>, you confirm this
            information is your own and accurate.{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("PolicyScreen")}
            >
              Review our policy.
            </Text>
          </Text>
        </View>

        <View style={styles.cardWrapper}>
          <RezultsCard
            realName={cardToShow.realName}
            isVerified={cardToShow.isVerified}
            showRealName={cardToShow.showRealName}
            providerName={cardToShow.providerName}
            testDate={cardToShow.testDate}
          />
        </View>
      </ScrollView>

      <ScreenFooter>
        <ZultsButton
          label="Add Rezults"
          type="primary"
          size="large"
          fullWidth
          onPress={handleAddRezults}
        />
        <ZultsButton
          label="Cancel"
          type="secondary"
          size="large"
          fullWidth
          onPress={handleCancel}
          style={{ marginTop: 8 }}
        />
      </ScreenFooter>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
  },
  title: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.foreground.soft,
    flexWrap: "wrap",
  },
  highlight: {
    color: colors.foreground.default,
    fontWeight: "500",
  },
  link: {
    color: colors.info.onContainer,
    textDecorationLine: "underline",
  },
  cardWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 24,
  },
});