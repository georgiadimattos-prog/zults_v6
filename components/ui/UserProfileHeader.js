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
    <BlurView intensity={20} tint="dark" style={styles.header} onLayout={onLayout}>
      {/* ─── Left: avatar + username ─── */}
      <View style={styles.headerLeft}>
        <Image source={tomas} style={styles.avatar} />
        <View style={styles.profileText}>
          <Text
            style={styles.username}
          >
            Jonster
          </Text>
        </View>
      </View>

      {/* ─── Right: settings button ─── */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate("Settings")}
        activeOpacity={0.8}
      >
        <Image
          source={settingsIcon}
          style={styles.settingsIcon}
          resizeMode="contain"
        />
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
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: "rgba(11,11,11,0.07)", // ✅ dark overlay for consistency
    position: "absolute",
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
    ...typography.title3Medium, // ✅ same as Settings header
    color: colors.foreground.default,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.surface2,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIcon: {
    width: 20,
    height: 20,
    tintColor: colors.foreground.default,
  },
});