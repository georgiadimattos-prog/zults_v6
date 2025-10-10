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

const PROVIDER_NAMES = {
  pp: "Planned Parenthood",
  shl: "Sexual Health London",
  nhs: "NHS",
  randox: "Randox Health",
};

export default function AddRezultsCardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { providerId } = route.params || {};
  const PROVIDERS = {
  pp: "Planned Parenthood",
  soapoli: "Soapoli-Online",
  shl: "Sexual Health London",
  shuk: "SH.UK",
  testme: "TestMe",
  openhouse: "Open House",
};

const providerName = PROVIDERS[providerId] || "Manual Upload";

  const handleAddRezults = () => {
    rezultsCache.hasRezults = true;
    rezultsCache.card = {
      realName: "John Doe",
      isVerified: true,
      showRealName: true,
      providerName, // ✅ dynamically applied
      testDate: "20 Oct 2025",
    };

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
        {/* ─── Header ─── */}
        <View style={styles.headerBlock}>
          <Text style={styles.title}>
            Your Rezults
          </Text>

          <Text
            style={[typography.bodyRegular, styles.subtitle]}
          >
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

        {/* ─── Rezults Card Preview ─── */}
        <View style={styles.cardWrapper}>
          <RezultsCard
            realName="John Doe"
            isVerified={true}
            showRealName={true}
            providerName={providerName}
            testDate="12 Dec 2025"
          />
        </View>
      </ScrollView>

      {/* ─── Footer ─── */}
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
    paddingHorizontal: 16, // ✅ baseline gutter
  },

  // ─── Header ───
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
  },
  title: {
    ...typography.largeTitleMedium, // ✅ Apple-style hero title
    color: colors.foreground.default,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.foreground.soft,
    flexWrap: "wrap",
  },
  highlight: {
    color: colors.foreground.default,
    fontWeight: "500", // ✅ subtle visual anchor
  },
  link: {
    color: colors.info.onContainer, // ✅ Zults blue link
    textDecorationLine: "underline",
  },

  // ─── Card Preview ───
  cardWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 24,
  },
});
