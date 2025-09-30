// components/ui/UserProfileHeader.js
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../theme";
import tomas from "../../assets/images/tomas.png";
import settingsIcon from "../../assets/images/settings.png";
import { BlurView } from "expo-blur";

export default function UserProfileHeader({ onLayout }) {
  const navigation = useNavigation();

  return (
    <BlurView intensity={15} tint="dark" style={styles.header} onLayout={onLayout}>
      {/* Left side: avatar + username */}
      <View style={styles.headerLeft}>
        <Image source={tomas} style={styles.avatar} />
        <View style={styles.profileText}>
          <Text style={styles.username}>Jonster</Text>
        </View>
      </View>

      {/* Right side: settings button */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <Image source={settingsIcon} style={styles.settingsIcon} resizeMode="contain" />
      </TouchableOpacity>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 25,
    paddingBottom: 25,
    backgroundColor: "#0b0b0b07", // Surface1 (#0B0B0B) with alpha
    position: "absolute",             // ✅ make it overlay if you want
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileText: {
    marginLeft: 12,
  },
  username: {
    ...typography.title3Medium,  // 🔄 match Settings header style
    color: colors.foreground.default,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.background.surface2,
  },
  settingsIcon: {
    width: 20,
    height: 20,
    tintColor: colors.foreground.default,
  },
});