import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import RezultsCard from "../../ui/RezultsCard";
import ZultsButton from "../../ui/ZultsButton";
import Navbar from "../../ui/Navbar";
import ScreenFooter from "../../ui/ScreenFooter";

// ✅ import the cache
import { rezultsCache } from "../../../cache/rezultsCache";

export default function AddRezultsCardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { providerId, resultsLink } = route.params || {};

  const handleAddRezults = () => {
    rezultsCache.hasRezults = true;
    rezultsCache.card = {
      userName: "John Doe",
      providerName: "Sexual Health London",
      testDate: "12 Dec 2025",
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
        {/* Page title + subtitle */}
        <View style={styles.headerBlock}>
          <Text style={typography.largeTitleMedium} allowFontScaling={false}>
            Your Rezults
          </Text>
          <Text
            style={typography.bodyRegular}
            maxFontSizeMultiplier={1.2}
          >
            By clicking Add Rezults, you confirm this information is your own and accurate.{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("PolicyScreen")}
            >
              Review our policy.
            </Text>
          </Text>
        </View>

        <View style={{ width: "100%", alignItems: "center", marginTop: 24 }}>
  <RezultsCard
    userName="John Doe"
    providerName="Sexual Health London"
    testDate="12 Dec 2025"
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
  link: {
    textDecorationLine: "underline",
    color: colors.brand.primary,
  },
});
