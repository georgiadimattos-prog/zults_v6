import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { colors, typography } from "../../theme";
import RezultsCard from "../ui/RezultsCard";

// ✅ same back arrow asset as chat
import arrowLeft from "../../assets/images/navbar-arrow.png";

// get screen height for responsive expanded box
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

function RezultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    username,
    avatar,
    realName,
    providerName,
    testDate,
    showExpand,
  } = route.params || {};

  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header with BlurView → back arrow aligned like chat */}
      <BlurView intensity={40} tint="dark" style={styles.topBlur}>
        <View style={styles.userRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={arrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Chat user info */}
      <View style={styles.userInfo}>
        {avatar && <Image source={avatar} style={styles.avatar} />}
        {realName === "Melany J Rabideau" ? (
          <Text style={styles.username}>{realName}</Text>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.username}>{username}</Text>
            <Image
              source={require("../../assets/images/verified-icon.png")}
              style={styles.verifiedIcon}
            />
          </View>
        )}
      </View>

      {/* RezultsCard → Melany shows realName, others show no name */}
      <RezultsCard
        realName={realName === "Melany J Rabideau" ? realName : null}
        providerName={providerName}
        testDate={testDate || "12 Dec 2025"}
        showExpand={showExpand}
        onExpand={setExpanded}
      />

      {/* Expanded info box */}
      {expanded && (
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.expandedBox}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 64 }}
          >
            <Text style={styles.expandedText}>
              These Rezults were created from home-tests completed on{" "}
              {testDate},{" "}
              using{" "}
              <Text
                style={{
                  color: colors.neutral[0],
                  textDecorationLine: "underline",
                }}
              >
                {providerName === "Planned Parenthood"
                  ? "Planned Parenthood"
                  : "Sexual Health London (SHL)"}
              </Text>
              .
            </Text>

            <Text style={styles.expandedTitle}>Infection Window Periods</Text>
            <Text style={styles.expandedText}>
              Some STIs take time to show up in results, meaning a recent
              infection might not be detected right away.
            </Text>
            <Text style={styles.expandedText}>
              • Chlamydia & Gonorrhoea: ~2 weeks{"\n"}
              • Syphilis, Hep B & C: 6–12 weeks{"\n"}
              • HIV: ~6 weeks
            </Text>

            <Text style={styles.expandedTitle}>ID Verification</Text>
            <Text style={styles.expandedText}>
              These are at-home tests, we can't fully guarantee who took the
              test. If you see a blue tick next to someone’s profile, it means:{"\n"}
              • We verified their name matches their test provider’s results{"\n"}
              • Their photo matches their official ID
            </Text>

            <Text style={styles.expandedText}>
              Rezults are a tool for safer dating but they don’t replace other
              protections. Using condoms is still the most reliable way to protect
              against STIs.
            </Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export default RezultsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.surface1,
  },
  topBlur: {
    paddingTop: Platform.OS === "ios" ? 110 : 90,
    paddingBottom: 20,
    paddingHorizontal: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backIcon: {
    width: 28,
    height: 28,
    tintColor: colors.foreground.default,
  },
  userInfo: {
    alignItems: "center",
    marginVertical: 16,
    marginTop: 190,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  username: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    fontSize: 16,
  },
  verifiedIcon: {
    width: 18,
    height: 18,
    marginLeft: 6,
  },
  expandedBox: {
  borderRadius: 16,
  marginHorizontal: 16,
  marginTop: 16,
  marginBottom: 32,
  padding: 16,
  minHeight: 200,
  maxHeight: SCREEN_HEIGHT * 0.95,

  // ✨ Add this for subtle card look
  backgroundColor: "rgba(255,255,255,0.02)", // faint inner fill
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",     // soft stroke visible on dark
  overflow: "hidden",
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2, // for Android
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
    color: colors.foreground.soft,
    marginBottom: 8,
    lineHeight: 18,
  },
});
