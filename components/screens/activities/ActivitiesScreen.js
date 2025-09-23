import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../theme";

import { chatCache } from "../usersearch/UserChatScreen";
import fallbackAvatar from "../../../assets/images/melany.png";
import arrowLeft from "../../../assets/images/navbar-arrow.png";

// ⭐ icons from assets
import star from "../../../assets/images/star.png";
import starFilled from "../../../assets/images/star-filled.png";

export default function ActivitiesScreen() {
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all"); // all | unread | favorites

  useEffect(() => {
    const data = Object.keys(chatCache).map((username) => {
      const chat = chatCache[username] || {};
      const lastMsg = chat.chatData?.[chat.chatData.length - 1];

      // friendly last action text
      let lastText = "No activity yet";
      if (lastMsg) {
        if (lastMsg.type === "request") {
          lastText =
            lastMsg.direction === "from-user"
              ? "You requested to view Rezults"
              : `${username} requested to view Rezults`;
        } else if (lastMsg.type === "share") {
          lastText =
            lastMsg.direction === "from-user"
              ? "You shared your Rezults"
              : `${username} shared their Rezults`;
        } else if (lastMsg.type === "stop-share") {
          lastText =
            lastMsg.direction === "from-user"
              ? "You stopped sharing Rezults"
              : `${username} stopped sharing Rezults`;
        } else {
          lastText = lastMsg.type;
        }
      }

      return {
        id: username,
        name: username,
        avatar: chat.user?.image || fallbackAvatar,
        lastText,
        lastTimestamp: lastMsg ? lastMsg.timestamp : "",
        hasUnread: chat.hasUnread || false,
        favorite: chat.favorite || false,
      };
    });

    // ✅ always sort by last activity (latest on top)
    const sorted = data.sort((a, b) =>
      a.lastTimestamp < b.lastTimestamp ? 1 : -1
    );

    setActivities(sorted);
  }, [chatCache]);

  const toggleFavorite = (id) => {
    const updated = activities.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    setActivities(updated);
    if (chatCache[id]) {
      chatCache[id].favorite = !chatCache[id].favorite;
    }
  };

  const filteredActivities = activities.filter((item) => {
    if (filter === "unread") return item.hasUnread;
    if (filter === "favorites") return item.favorite;
    return true;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        if (chatCache[item.id]) chatCache[item.id].hasUnread = false;
        navigation.navigate("UserChat", {
          user: { name: item.name, image: item.avatar },
        });
      }}
    >
      <Image source={item.avatar} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.username}>
          {item.name} {item.hasUnread && <Text style={styles.unreadDot}>•</Text>}
        </Text>
        <Text style={styles.lastText}>{item.lastText}</Text>
      </View>
      <Text style={styles.timestamp}>{item.lastTimestamp}</Text>
      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
        <Image
          source={item.favorite ? starFilled : star}
          style={[
            styles.starIcon,
            {
              tintColor: item.favorite
                ? colors.brand.purple1
                : colors.foreground.muted,
            },
          ]}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* Nav bar */}
      <BlurView intensity={40} tint="dark" style={styles.topBlur}>
        <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
          <Image source={arrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Activities</Text>
      </BlurView>

      {/* Filter tabs */}
      <View style={styles.tabs}>
        {["all", "unread", "favorites"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, filter === tab && styles.tabActive]}
            onPress={() => setFilter(tab)}
          >
            <Text
              style={[styles.tabText, filter === tab && styles.tabTextActive]}
            >
              {tab === "all"
                ? "View All"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 140, paddingHorizontal: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {filter === "all"
              ? "No activities yet"
              : filter === "unread"
              ? "No unread chats"
              : "No favorites yet"}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.surface1 },
  topBlur: {
    paddingTop: Platform.OS === "ios" ? 72 : 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backIcon: { width: 28, height: 28, tintColor: colors.foreground.default },
  title: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Platform.OS === "ios" ? 100 : 80,
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.background.surface2,
  },
  tabActive: { backgroundColor: colors.brand.purple1 },
  tabText: { ...typography.captionSmallRegular, color: colors.foreground.muted },
  tabTextActive: { color: colors.neutral[0], fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.background.surface2,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  username: { ...typography.bodyMedium, color: colors.foreground.default },
  unreadDot: { color: colors.brand.purple1, fontWeight: "bold" },
  lastText: { ...typography.captionSmallRegular, color: colors.foreground.muted },
  timestamp: {
    ...typography.captionSmallRegular,
    color: colors.foreground.muted,
    marginRight: 8,
  },
  starIcon: { width: 20, height: 20, marginLeft: 8 },
  empty: {
    textAlign: "center",
    marginTop: 200,
    color: colors.foreground.muted,
  },
});
