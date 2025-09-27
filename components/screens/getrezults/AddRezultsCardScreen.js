import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import RezultsCard from "../../ui/RezultsCard";
import ZultsButton from "../../ui/ZultsButton";
import Navbar from '../../ui/Navbar';

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
      <Text allowFontScaling={false} style={styles.pageTitle}>
        Your Rezults
      </Text>
      <Text allowFontScaling={false} style={styles.subtitle}>
        By clicking Add Rezults, you confirm this information is your own and accurate.{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('PolicyScreen')}
        >
          Review our policy.
        </Text>
      </Text>
    </View>

    {/* Rezults card preview */}
    <RezultsCard
      userName="John Doe"
      providerName="Sexual Health London"
      testDate="12 Dec 2025"
    />

    {/* Helper text */}
    <Text allowFontScaling={false} style={styles.flipHint}>
      Tap the card to view the reverse.
    </Text>
  </ScrollView>

  {/* Footer actions */}
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
    onPress={() => navigation.navigate('MainScreen')}
    style={[styles.button, { bottom: 100 }]}
  />
</ScreenWrapper>

  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 200,
  },
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  pageTitle: {
  ...typography.largeTitleMedium,
  color: colors.foreground.default,
  marginBottom: 6,
},
subtitle: {
  ...typography.bodyRegular,  // consistent everywhere
  color: colors.foreground.soft,
  marginBottom: 24,
},
  paragraph: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
    lineHeight: 20,
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
  link: {
  textDecorationLine: 'underline',
  color: colors.brand.primary,  // or colors.foreground.default if you want subtle
},
});
