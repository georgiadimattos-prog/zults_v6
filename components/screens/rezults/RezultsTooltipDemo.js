import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import RezultsCard from "../../ui/RezultsCard";
import Navbar from "../../ui/Navbar";
import ScreenWrapper from "../../ui/ScreenWrapper"; // ✅ use wrapper

import avatarImg from "../../../assets/images/zults.png";
import verifiedIcon from "../../../assets/images/verified-icon.png";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth - 32;
const CARD_HEIGHT = CARD_WIDTH / 1.586;

export default function RezultsTooltipDemo() {
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const captions = [
    "This is how a Rezults card looks like.",
    "On the front you will see Name & Provider. On the back, you’ll see your test date and infections tested.",
    "You can expand for more details here.",
  ];

  useEffect(() => {
    setTimeout(() => setStep(0), 500);
    setTimeout(() => setStep(1), 2500);
    setTimeout(() => setStep(2), 5000);
  }, []);

  return (
    <ScreenWrapper>
      {/* Navbar stays top-left */}
      <Navbar onBackPress={() => navigation.goBack()} />

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile row */}
        <View style={styles.profileRow}>
          <Image source={avatarImg} style={styles.avatar} />
          <View style={styles.nameRow}>
            <Text style={styles.username}>Rezy</Text>
            <Image source={verifiedIcon} style={styles.verifiedIcon} />
          </View>
        </View>

        {/* Rezults card */}
        <RezultsCard
          realName="Demo"
          isVerified={true}
          showRealName={true}
          providerName="Planned Parenthood"
          testDate="25 Sep 2025"
          showExpand={true}
          onExpand={setExpanded}
          demoMode={true}
        />

        {/* Expanded box */}
        {expanded && (
          <View style={styles.expandedBox}>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
            >
              <Text style={styles.expandedText}>
                These Rezults were created from Planned Parenthood tests on 25 Sep 2025.
              </Text>

              <Text style={styles.expandedTitle}>Infection Window Periods</Text>
              <Text style={styles.expandedText}>
                Some STIs take time to show up in results, meaning a recent infection might not
                be detected right away.
              </Text>
              <Text style={styles.expandedText}>
                • Chlamydia & Gonorrhoea: ~2 weeks{"\n"}
                • Syphilis, Hep B & C: 6–12 weeks{"\n"}
                • HIV: ~6 weeks
              </Text>

              <Text style={styles.expandedTitle}>ID Verification</Text>
              <Text style={styles.expandedText}>
                These are at-home tests, so we can't fully guarantee who took the test. If you
                see a blue tick next to someone’s profile, it means:{"\n"}
                • We verified their name matches their test provider’s results{"\n"}
                • Their photo matches their official ID
              </Text>

              <Text style={styles.expandedText}>
                Rezults are a tool for safer dating but they don’t replace other protections.
                Using condoms is still the most reliable way to protect against STIs.
              </Text>
            </ScrollView>
          </View>
        )}

        {/* Caption */}
        <Text style={styles.caption}>{captions[step]}</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,   // ✅ match blueprint gutter
    paddingTop: 32,          // space below Navbar
    paddingBottom: 40,
    alignItems: "center",
  },
  profileRow: {
    alignItems: "center",
    marginTop: 32,           // ✅ like headerBlock spacing
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    ...typography.bodyMedium,
    color: "#fff",
    fontSize: 16,
    marginRight: 6,
  },
  verifiedIcon: {
    width: 18,
    height: 18,
  },
  caption: {
    marginTop: 24,           // ✅ match subtitle spacing
    ...typography.bodyRegular,
    color: "#fff",
    textAlign: "center",
  },
  expandedBox: {
    marginTop: 20,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: colors.background.surface1,
    padding: 16,
  },
  expandedTitle: {
    ...typography.bodyMedium,
    fontSize: 14,
    fontWeight: "500",
    color: colors.foreground.default,
    marginTop: 12,
    marginBottom: 6,
  },
  expandedText: {
    ...typography.bodyRegular,
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
    lineHeight: 18,
  },
});