import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, Linking } from "react-native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import Navbar from "../../ui/Navbar";
import ZultsButton from "../../ui/ZultsButton";

// ✅ Provider logos
import shlLogo from "../../../assets/images/SHL.png";
import shukLogo from "../../../assets/images/SHUK.png";
import soapoliLogo from "../../../assets/images/soapoli.png";
import testformeLogo from "../../../assets/images/testforme.png";
import openhouseLogo from "../../../assets/images/openhouse.png";
import plannedParenthoodLogo from "../../../assets/images/pp-logo.png";

// ✅ Flags (flat in /assets/images/)
import flagUK from "../../../assets/images/flag-uk.png";
import flagNE from "../../../assets/images/flag-ne.png";
import flagUS from "../../../assets/images/flag-us.png";
import flagGE from "../../../assets/images/flag-ge.png";
import flagSPAIN from "../../../assets/images/flag-spain.png";

const providers = [
  {
    id: "pp",
    logo: plannedParenthoodLogo,
    flag: flagUS,
    description: "U.S. clinics offering STI testing and sexual health support.",
    url: "https://www.plannedparenthood.org/",
  },
  {
    id: "shl",
    logo: shlLogo,
    flag: flagUK,
    description: "Free NHS STI testing and results within 7 days (London).",
    url: "https://www.shl.uk/",
  },
  {
    id: "shuk",
    logo: shukLogo,
    flag: flagUK,
    description: "Free and confidential NHS STI testing for anyone in the UK.",
    url: "https://sh.uk/",
  },
  {
    id: "soapoli",
    logo: soapoliLogo,
    flag: flagNE,
    description: "Discreet testing with certified European labs (Netherlands).",
    url: "https://www.soapoli-online.nl/",
  },
  {
    id: "openhouse",
    logo: openhouseLogo,
    flag: flagSPAIN,
    description: "Trusted STI testing in Spain with certified labs.",
    url: "https://openhouse.es/en/?srsltid=AfmBOoqM25IUScDlmrNAW0cAcL7ZL9leZDw4yvQxCwL-7ZO7PT_pELWU",
  },
  {
    id: "testforme",
    logo: testformeLogo,
    flag: flagGE,
    description: "Certified STI home tests available across Germany.",
    url: "https://www.testforme.de/",
  },
];

export default function NeedToGetTestedScreen({ navigation }) {
  return (
    <ScreenWrapper topPadding={0}>
      <Navbar />

      <ScrollView
        contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: 64 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Page title + subtitle ─── */}
        <View style={styles.headerBlock}>
          <Text style={typography.largeTitleMedium} allowFontScaling={false}>
            Need to get tested?
          </Text>

          <Text
            style={[typography.bodyRegular, styles.subtitle]}
            allowFontScaling
            maxFontSizeMultiplier={1.3}
          >
            See providers you can test with to get Rezults.
          </Text>
        </View>

        {/* ─── Provider Cards ─── */}
        {providers.map((p) => (
          <View key={p.id} style={styles.card}>
            {/* flag top-right */}
            <View style={styles.flagWrapper}>
              <Image source={p.flag} style={styles.flag} resizeMode="contain" />
            </View>

            <Image source={p.logo} style={styles.logo} resizeMode="contain" />

            <Text
              style={[typography.bodyRegular, styles.cardText]}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              {p.description}
            </Text>

            <ZultsButton
              label="Visit site"
              type="secondary"
              size="medium"
              fullWidth={false}
              onPress={() => Linking.openURL(p.url)}
            />
          </View>
        ))}

        {/* ─── Footer Trust Line ─── */}
        <View style={styles.footerNote}>
          <Text
            style={[typography.captionSmallRegular, { color: colors.foreground.muted }]}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            Trusted by the NHS and certified partners
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
  },
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    color: colors.foreground.soft,
  },
  card: {
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  flagWrapper: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    padding: 4,
  },
  flag: {
    width: 26,
    height: 26,
    borderRadius: 13,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  logo: {
    width: 120,
    height: 50,
    marginBottom: 14,
    marginTop: 4,
  },
  cardText: {
    color: colors.foreground.soft,
    textAlign: "center",
    marginBottom: 16,
  },
  footerNote: {
    alignItems: "center",
    marginTop: 8,
  },
});
