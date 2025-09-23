import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, typography } from "../../theme";
import RezultsCard from "../ui/RezultsCard";
import ExpireContainer from "../ui/ExpireContainer";

export default function RezultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Data passed from UserChatScreen → navigation.navigate("Rezults", { ... })
  const {
    username,
    avatar,
    realName,
    providerName,
    testDate,
  } = route.params || {};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rezults</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Chat user info (same as chat screen) */}
      <View style={styles.userInfo}>
        {avatar && <Image source={avatar} style={styles.avatar} />}
        {username && <Text style={styles.username}>@{username}</Text>}
      </View>

      {/* RezultsCard → shows the REAL NAME */}
      <RezultsCard
        userName={realName || username || "Unknown User"}
        providerName={providerName || "Sexual Health London"}
        testDate={testDate || "12 Dec 2025"}
      />

      {/* Expiry info */}
      <ExpireContainer expiryDate="29 Sep 2025" daysLeft={43} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.surface1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  back: {
    color: colors.foreground.default,
    fontSize: 18,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    fontSize: 16,
  },
  close: {
    color: colors.foreground.default,
    fontSize: 18,
  },
  userInfo: {
    alignItems: "center",
    marginVertical: 16,
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
