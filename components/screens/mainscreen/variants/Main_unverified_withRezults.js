import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../../theme";
import UserProfileHeader from "../../../ui/UserProfileHeader";
import RezultsCard from "../../../ui/RezultsCard";
import NotificationCard from "../../../ui/NotificationCard";
import ZultsButton from "../../../ui/ZultsButton";
import ScreenWrapper from "../../../ui/ScreenWrapper";
import { chatCache } from "../../usersearch/UserChatScreen";
import zultsLogo from "../../../../assets/images/zults.png";

// ✅ Rezults cache
import { rezultsCache } from "../../../../cache/rezultsCache";

// ✅ Expire container
import ExpireContainer from "../../../ui/ExpireContainer";

export default function MainUnverifiedWithRezults() {
  const navigation = useNavigation();
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    let users = Object.keys(chatCache)
      .map((username) => {
        const chat = chatCache[username] || {};
        const lastMsg = chat.chatData?.[chat.chatData.length - 1];
        return {
          id: username,
          name: username,
          avatar: chat.user?.image || zultsLogo,
          lastTimestamp: lastMsg ? lastMsg.timestamp : "",
        };
      })
      .sort((a, b) => (a.lastTimestamp < b.lastTimestamp ? 1 : -1));

    if (users.length === 0) {
      users = [
        {
          id: "zults-demo",
          name: "Zults (Demo)",
          avatar: zultsLogo,
          lastTimestamp: "Now",
        },
      ];
    }

    setRecentUsers(users);
  }, [chatCache]);

  const renderAvatars = () => {
    const display = recentUsers.slice(0, 4);
    const extra = recentUsers.length - display.length;

    return (
      <View style={styles.avatarRow}>
        {display.map((user, index) => (
          <Image
            key={user.id}
            source={user.avatar}
            style={[styles.avatar, { marginLeft: index === 0 ? 0 : -12 }]}
          />
        ))}
        {extra > 0 && (
          <View style={[styles.avatar, styles.extraAvatar]}>
            <Text style={styles.extraText}>+{extra}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.surface1}
      />
      <UserProfileHeader hideVerification />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ✅ Rezults card */}
        <RezultsCard
          userName={rezultsCache.card?.userName || "Unknown User"}
          providerName={rezultsCache.card?.providerName || "Unknown Provider"}
          testDate={rezultsCache.card?.testDate || "Unknown Date"}
        />

        {/* ✅ Expiry container just below card */}
        <ExpireContainer expiryDate="15 Aug 2026" daysLeft={90} />

        {/* Share button */}
        <ZultsButton
          label="Share"
          type="primary"
          size="large"
          onPress={() => navigation.navigate("Share")}
        />

        {/* Activities Section */}
        <View style={{ marginTop: 15 }}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <View style={styles.activitiesCard}>
            {renderAvatars()}
            <TouchableOpacity onPress={() => navigation.navigate("Activities")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>

        <NotificationCard />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
    gap: 24,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    marginBottom: 8,
  },
  activitiesCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.surface2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.background.surface1,
  },
  extraAvatar: {
    marginLeft: -12,
    backgroundColor: colors.background.surface1,
    justifyContent: "center",
    alignItems: "center",
  },
  extraText: {
    ...typography.captionSmallRegular,
    color: colors.foreground.default,
    fontWeight: "600",
  },
  viewAllText: {
    ...typography.captionSmallRegular,
    color: colors.brand.purple1,
    fontWeight: "600",
  },
});
