// components/settings/SettingsScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ScreenWrapper from "../../ui/ScreenWrapper";
import ScreenFooter from "../../ui/ScreenFooter";
import ZultsButton from "../../ui/ZultsButton";
import { colors, typography } from "../../../theme";
import Navbar from "../../ui/Navbar";

// icons
import userIcon from "../../../assets/images/user-icon.png";
import keyIcon from "../../../assets/images/key-icon.png";
import infoIcon from "../../../assets/images/info-icon.png";
import supportIcon from "../../../assets/images/support-icon.png";
import tomas from "../../../assets/images/tomas.png";
import VerifiedBadge from "../../ui/VerifiedBadge";
import UnverifiedBadge from "../../ui/UnverifiedBadge";


export default function SettingsScreen({ navigation }) {
  return (
    <ScreenWrapper>
  {/* ✅ Navbar at the top with back arrow */}
  <Navbar onBackPress={() => navigation.goBack()} />

  {/* Profile header */}
  <View style={styles.header}>
  <View style={styles.headerLeft}>
  
{/* ✅ use new photo */}
<Image source={tomas} style={styles.avatar} />
    <View style={styles.profileText}>
      <Text style={styles.username}>Jonster</Text>
      <UnverifiedBadge />
    </View>
  </View>

    <ZultsButton
      label="Get Full Access"
      type="primary"
      size="small"
      pill
      fullWidth={false}
      onPress={() => console.log("Get Full Access")}
    />
  </View>

  {/* Scrollable content */}
  <ScrollView contentContainerStyle={styles.scrollContent}>
    {/* Grid of cards */}
    <View style={styles.grid}>
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconBox}>
          <Image source={userIcon} style={styles.icon} resizeMode="contain" />
        </View>
        <Text style={styles.cardLabel}>Personal details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <View style={styles.iconBox}>
          <Image source={keyIcon} style={styles.icon} resizeMode="contain" />
        </View>
        <Text style={styles.cardLabel}>Privacy settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <View style={styles.iconBox}>
          <Image source={infoIcon} style={styles.icon} resizeMode="contain" />
        </View>
        <Text style={styles.cardLabel}>Legal info</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <View style={styles.iconBox}>
          <Image source={supportIcon} style={styles.icon} resizeMode="contain" />
        </View>
        <Text style={styles.cardLabel}>Support</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>

  {/* ✅ Sticky footer (always at bottom) */}
  <ScreenFooter>
    <ZultsButton
      label="Log Out"
      type="secondary"
      size="large"
      fullWidth
      onPress={() => console.log("Log Out")}
    />
    <Text style={styles.version}>Version 2.0.0</Text>
  </ScreenFooter>
</ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120, // leaves room above footer
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // button pushed right
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileText: {
    marginLeft: 12,
  },
  username: {
    ...typography.bodyLargeMedium,
    color: colors.foreground.default,
    marginBottom: 4,
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
    marginTop: 12,
  },
  card: {
    width: "48%",
    height: 167,
    backgroundColor: colors.background.surface2,
    borderRadius: 12,
    marginBottom: 16,
    padding: 20,
    justifyContent: "flex-start",
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: colors.background.surface3,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: colors.foreground.default,
  },
  cardLabel: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
  },

  // Footer
  version: {
    ...typography.captionSmallRegular,
    color: colors.foreground.muted,
    textAlign: "center",
    marginTop: 12,
  },
});
