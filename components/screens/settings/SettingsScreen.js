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
      {/* ✅ Navbar */}
      <Navbar onBackPress={() => navigation.goBack()} />

      {/* ✅ Profile header */}
      <View style={styles.headerCentered}>
        <Image source={tomas} style={styles.avatarLarge} />
        <Text
          style={styles.usernameCentered}
          allowFontScaling={false} // ✅ lock for optical rhythm
        >
          Jonster
        </Text>

        {/* ✅ Unverified / Verified badge */}
        <UnverifiedBadge />
        {/* <VerifiedBadge /> if verified */}
      </View>

      {/* ✅ Scrollable grid content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.card}>
            <View style={styles.iconBox}>
              <Image source={userIcon} style={styles.icon} resizeMode="contain" />
            </View>
            <Text
              style={styles.cardLabel}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              Personal details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.iconBox}>
              <Image source={keyIcon} style={styles.icon} resizeMode="contain" />
            </View>
            <Text
              style={styles.cardLabel}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              Privacy settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.iconBox}>
              <Image source={infoIcon} style={styles.icon} resizeMode="contain" />
            </View>
            <Text
              style={styles.cardLabel}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              Legal info
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.iconBox}>
              <Image
                source={supportIcon}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text
              style={styles.cardLabel}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ Sticky footer */}
      <ScreenFooter>
        <ZultsButton
          label="Log Out"
          type="secondary"
          size="large"
          fullWidth
          onPress={() => console.log("Log Out")}
        />
        <Text
          style={styles.version}
          allowFontScaling
          maxFontSizeMultiplier={1.2} // ✅ small label cap
        >
          Version 2.0.0
        </Text>
      </ScreenFooter>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  // ✅ Centered header
  headerCentered: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32, // ✅ matches other hero spacing
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  usernameCentered: {
    ...typography.title3Medium,
    color: colors.foreground.default,
    marginBottom: 12,
  },

  // ✅ Grid of cards
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 40,
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

  // ✅ Footer
  version: {
    ...typography.captionSmallRegular,
    color: colors.foreground.muted,
    textAlign: "center",
    marginTop: 12,
  },
});
