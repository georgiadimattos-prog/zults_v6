// components/screens/getrezults/ProvidersListScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "../../ui/ScreenWrapper";
import Navbar from "../../ui/Navbar";
import { colors, typography } from "../../../theme";

// Logos and flags
import ppLogo from "../../../assets/images/pp-logo.png";
import soapoliLogo from "../../../assets/images/soapoli.png";
import shlLogo from "../../../assets/images/SHL.png";
import shUKLogo from "../../../assets/images/SHUK.png";
import testMeLogo from "../../../assets/images/testforme.png";
import openHouseLogo from "../../../assets/images/openhouse.png";

// Flags
import flagUS from "../../../assets/images/flag-us.png";
import flagNL from "../../../assets/images/flag-ne.png";
import flagUK from "../../../assets/images/flag-uk.png";
import flagDE from "../../../assets/images/flag-ge.png";
import flagES from "../../../assets/images/flag-spain.png";

const PROVIDERS = [
  {
    name: "Planned Parenthood",
    logo: ppLogo,
    flag: flagUS,
    url: "https://www.plannedparenthood.org/",
  },
  {
    name: "Soapoli-Online",
    logo: soapoliLogo,
    flag: flagNL,
    url: "https://www.soapoli-online.nl/",
  },
  {
    name: "SHL",
    logo: shlLogo,
    flag: flagUK,
    url: "https://www.shl.uk/",
  },
  {
    name: "SH.UK",
    logo: shUKLogo,
    flag: flagUK,
    url: "https://www.sh.uk/",
  },
  {
    name: "TestForMe",
    logo: testMeLogo,
    flag: flagDE,
    url: "https://www.testforme.de/",
  },
  {
    name: "Open House",
    logo: openHouseLogo,
    flag: flagES,
    url: "https://openhouse.es/",
  },
];

export default function ProvidersListScreen() {
  const navigation = useNavigation();

  const handleVisit = (url) => {
    Linking.openURL(url).catch((err) =>
      console.warn("Failed to open URL:", url, err)
    );
  };

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Get Tested
        </Text>
        <Text
          style={styles.subtitle}
        >
          Get tested with one of our trusted providers to access your Rezults.
        </Text>

        {PROVIDERS.map((prov, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.flagContainer}>
              <Image source={prov.flag} style={styles.flag} resizeMode="contain" />
            </View>

            <Image source={prov.logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.providerName}>{prov.name}</Text>

            <TouchableOpacity
              style={styles.visitButton}
              onPress={() => handleVisit(prov.url)}
              activeOpacity={0.85}
            >
              <Text style={styles.visitText}>Visit Website</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.trustedWrapper}>
          <Text style={styles.trustedText}>
            All providers are NHS-trusted or certified laboratories.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  title: {
    ...typography.largeTitleMedium,
    marginTop: 32,
    marginBottom: 12,
    color: colors.foreground.default,
  },
  subtitle: {
    ...typography.bodyRegular,
    marginBottom: 24,
    color: colors.foreground.soft,
  },
  card: {
    backgroundColor: colors.background.surface2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    position: "relative",
  },
  flagContainer: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  flag: {
    width: 32,
    height: 20,
    borderRadius: 3,
  },
  logo: {
    width: 100,
    height: 40,
    marginBottom: 12,
    marginTop: 8,
  },
  providerName: {
    ...typography.headlineMedium,
    color: colors.foreground.default,
    marginBottom: 12,
  },
  visitButton: {
    backgroundColor: "rgba(255,255,255,0.08)", // neutral translucent background
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  visitText: {
    ...typography.buttonMediumMedium,
    color: colors.foreground.default, // calm off-white text
  },
  trustedWrapper: {
    marginTop: 24,
    alignItems: "center",
  },
  trustedText: {
    ...typography.captionLargeRegular,
    color: colors.foreground.soft,
    textAlign: "center",
    opacity: 0.8,
  },
});
