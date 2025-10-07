import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  DeviceEventEmitter,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { colors, typography } from "../../../../theme";
import UserProfileHeader from "../../../ui/UserProfileHeader";
import RezultsCardPlaceholder from "../../../ui/RezultsCardPlaceholder";
import NotificationCard from "../../../ui/NotificationCard";
import ZultsButton from "../../../ui/ZultsButton";
import ScreenWrapper from "../../../ui/ScreenWrapper";

import {
  chatCache,
  hasSeededDemo,
  markDemoSeeded,
} from "../../../../cache/chatCache";
import zultsLogo from "../../../../assets/images/zults.png";

export default function MainUnverifiedNoRezults({ onLinkPress, onSharePress }) {
  const navigation = useNavigation();
  const [recentUsers, setRecentUsers] = useState([]);
  const [headerHeight, setHeaderHeight] = useState(0);

  // refresh whenever screen is focused
  useFocusEffect(
    React.useCallback(() => {
      let users = Object.keys(chatCache)
        .filter((k) => {
          const v = chatCache[k];
          return v && typeof v === "object" && v.user;
        })
        .map((username) => {
          const chat = chatCache[username] || {};
          const lastMsg = chat.chatData?.[chat.chatData.length - 1];
          return {
            id: username,
            name: chat.user?.name || username,
            avatar: chat.user?.image || zultsLogo,
            lastTimestamp: lastMsg ? lastMsg.timestamp : "",
            hasUnread: chat.hasUnread ?? false,
          };
        })
        .sort((a, b) => (a.lastTimestamp < b.lastTimestamp ? 1 : -1));

      if (users.length === 0 && !hasSeededDemo()) {
        const demoId = "zults-demo";
        chatCache[demoId] = {
          user: { id: demoId, name: "Rezy", image: zultsLogo, isBot: true },
          chatData: [],
          chatState: { hasShared: false, hasRequested: false },
          otherUserState: { hasShared: false, hasRequested: false },
          blocked: false,
          hasUnread: true,
        };

        users = [
          {
            id: demoId,
            name: "Rezy",
            avatar: zultsLogo,
            lastTimestamp: "Now",
            hasUnread: true,
          },
        ];

        markDemoSeeded();
      }

      setRecentUsers(users);
    }, [])
  );

  useEffect(() => {
  const sub = DeviceEventEmitter.addListener("chat-updated", () => {
    // 🩵 Schedule the UI update safely for the next frame
    requestAnimationFrame(() => {
      let users = Object.keys(chatCache)
        .filter((k) => {
          const v = chatCache[k];
          return v && typeof v === "object" && v.user;
        })
        .map((username) => {
          const chat = chatCache[username] || {};
          const lastMsg = chat.chatData?.[chat.chatData.length - 1];
          return {
            id: username,
            name: chat.user?.name || username,
            avatar: chat.user?.image || zultsLogo,
            lastTimestamp: lastMsg ? lastMsg.timestamp : "",
            hasUnread: chat.hasUnread ?? false,
          };
        })
        .sort((a, b) => (a.lastTimestamp < b.lastTimestamp ? 1 : -1));

      setRecentUsers(users);
    });
  });

  return () => sub.remove();
}, []);

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

  const unreadUsers = recentUsers.filter((u) => u.hasUnread);

  return (
    <ScreenWrapper>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <UserProfileHeader
        hideVerification
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight }]}
      >
        {/* ─── Rezults Placeholder ─── */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("GetRezultsSelectProvider")}
        >
          <RezultsCardPlaceholder />
        </TouchableOpacity>

        {/* ─── Share Button ─── */}
        <ZultsButton
          label="Share"
          type="primary"
          size="large"
          onPress={onSharePress ?? (() => navigation.navigate("Share"))}
        />

        {/* ─── Activities Section ─── */}
        <View style={{ marginTop: 24 }}>
          <View style={styles.activitiesHeader}>
            <Text style={styles.sectionTitle}>Activities</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Activities")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.activitiesCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Activities")}
          >
            {recentUsers.length > 0 ? (
              <View style={styles.row}>
                {renderAvatars()}
                <Text style={styles.activityText}>
                  {unreadUsers.length > 0
                    ? `${unreadUsers.length} unread message${
                        unreadUsers.length > 1 ? "s" : ""
                      }`
                    : "No recent activity"}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.emptyTitle}>No recent activity</Text>
                <Text style={styles.emptySubtitle}>
                  You’ll see Rezults shared here
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ─── Notification Card ─── */}
        <NotificationCard />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 24,
  },

  // ─── Activities ───
  activitiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    ...typography.title4Medium,       // ✅ 18 / 24 — Apple section header
    color: colors.foreground.default,
  },
  viewAll: {
    ...typography.subheadlineRegular, // ✅ 14 / 18
    color: colors.info.onContainer,   // ✅ Zults blue
  },
  activitiesCard: {
    backgroundColor: colors.background.surface2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.background.surface1,
  },
  extraAvatar: {
    marginLeft: -12,
    backgroundColor: colors.background.surface3,
    justifyContent: "center",
    alignItems: "center",
  },
  extraText: {
    ...typography.captionSmallRegular,
    color: colors.foreground.default,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityText: {
    ...typography.bodyRegular,        // ✅ matches general body text
    color: colors.foreground.soft,
    marginLeft: 12,
  },
  emptyTitle: {
    ...typography.subheadlineMedium,
    color: colors.foreground.default,
    textAlign: "center",
    marginBottom: 4,
  },
  emptySubtitle: {
    ...typography.subheadlineRegular,
    color: colors.foreground.muted,
    textAlign: "center",
  },
});