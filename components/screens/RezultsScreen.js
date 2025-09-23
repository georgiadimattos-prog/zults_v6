import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { colors, typography } from "../../theme";
import RezultsCard from "../ui/RezultsCard";

// ✅ same back arrow asset as chat
import arrowLeft from "../../assets/images/navbar-arrow.png";

function RezultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { username, avatar, realName, providerName, testDate } =
    route.params || {};

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
        {username && <Text style={styles.username}>@{username}</Text>}
      </View>

      {/* RezultsCard → shows realName if available */}
      <RezultsCard
        userName={realName || username || "Unknown User"}
        providerName={providerName || "Sexual Health London"}
        testDate={testDate || "12 Dec 2025"}
      />
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
    paddingTop: Platform.OS === "ios" ? 110 : 90, // ✅ row 2 alignment (same as chat)
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
    marginTop: 190, // ✅ pushes avatar below the header
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
});
