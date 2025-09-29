import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import RezultsCard from "../../ui/RezultsCard";
import ZultsButton from "../../ui/ZultsButton";
import Navbar from '../../ui/Navbar';
import ScreenFooter from "../../ui/ScreenFooter";

// ✅ import the cache
import { rezultsCache } from "../../../cache/rezultsCache";

export default function AddRezultsCardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { providerId, resultsLink } = route.params || {};

  const handleAddRezults = () => {
    // ✅ Save into cache
    rezultsCache.hasRezults = true;
    rezultsCache.card = {
      userName: "John Doe",
      providerName: "Sexual Health London",
      testDate: "12 Dec 2025",
    };

    // ✅ Back to MainScreen
    navigation.navigate("MainScreen");
  };

  const handleCancel = () => {
    // ✅ Reset cache and go back
    rezultsCache.hasRezults = false;
    rezultsCache.card = null;
    navigation.navigate("MainScreen");
  };

  return (
    <ScreenWrapper topPadding={0}>
  {/* Navbar with back arrow */}
  <Navbar onBackPress={() => navigation.navigate('GetRezultsProvider')} />

  <ScrollView
  contentContainerStyle={styles.scrollContent}
  showsVerticalScrollIndicator={false}
>
  {/* Page title + subtitle */}
  <View style={styles.headerBlock}>
  <Text style={styles.pageTitle}>
    Your Rezults
  </Text>
  <Text style={styles.subtitle}>
    By clicking Add Rezults, you confirm this information is your own and accurate.{' '}
    <Text
      style={styles.link}
      onPress={() => navigation.navigate('PolicyScreen')}
    >
      Review our policy.
    </Text>
  </Text>
</View>

<RezultsCard
  userName="John Doe"
  providerName="Sexual Health London"
  testDate="12 Dec 2025"
/>

</ScrollView>

  {/* ✅ Footer actions (inside ScreenFooter, no absolute positioning) */}
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
    paddingHorizontal: 16,   // ✅ consistent inset
  },
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
  },
  pageTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 6,
  },
  subtitle: {
  ...typography.bodyRegular,
  color: colors.foreground.soft,
  marginBottom: 24,
},
  link: {
    textDecorationLine: 'underline',
    color: colors.brand.primary,
  },
});
