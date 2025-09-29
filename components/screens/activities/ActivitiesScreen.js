import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { colors, typography } from "../../../theme";
import Navbar from "../../ui/Navbar";
import ScreenWrapper from "../../ui/ScreenWrapper";

import { chatCache, hasSeededDemo, markDemoSeeded } from "../../../cache/chatCache";
import fallbackAvatar from "../../../assets/images/melany.png";

// ⭐ icons
import star from "../../../assets/images/star.png";
import starFilled from "../../../assets/images/star-filled.png";
import zultsLogo from "../../../assets/images/zults.png";

export default function ActivitiesScreen() {
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");

  // 🔄 reload activities every time screen is focused
  useFocusEffect(
    React.useCallback(() => {
      buildActivities();
    }, [])
  );

  const buildActivities = () => {
    const data = Object.keys(chatCache).map((username) => {
      const chat = chatCache[username] || {};
      const lastMsg = chat.chatData?.[chat.chatData.length - 1];

      let lastText = "No activity yet";
      if (lastMsg) {
        if (lastMsg.type === "request") {
          lastText =
            lastMsg.direction === "from-user"
              ? "You requested to view Rezults"
              : `${chat.user?.name || username} requested to view Rezults`;
        } else if (lastMsg.type === "share") {
          lastText =
            lastMsg.direction === "from-user"
              ? "You shared your Rezults"
              : `${chat.user?.name || username} shared their Rezults`;
        } else if (lastMsg.type === "stop-share") {
          lastText =
            lastMsg.direction === "from-user"
              ? "You stopped sharing Rezults"
              : `${chat.user?.name || username} stopped sharing Rezults`;
        } else {
          lastText = lastMsg.type;
        }
      }

      return {
        id: username,
        name: chat.user?.name || username,
        avatar: chat.user?.image || fallbackAvatar,
        lastText,
        lastTimestamp: lastMsg ? lastMsg.timestamp : "",
        hasUnread: chat.hasUnread || false,
        favorite: chat.favorite || false,
      };
    });

    // inject demo if nothing left
if (data.length === 0) {
  // If no chats exist at all, create an empty demo chat in cache
  if (!chatCache["zults-demo"]) {
    chatCache["zults-demo"] = {
      user: { id: "zults-demo", name: "Zults (Demo)", image: zultsLogo, isBot: true },
      chatData: [],
      chatState: { hasShared: false, hasRequested: false },
      otherUserState: { hasShared: false, hasRequested: false },
      blocked: false,
    };
  }

  data.push({
    id: "zults-demo",
    name: "Zults (Demo)",
    avatar: zultsLogo,
    lastText: chatCache["zults-demo"].chatData.slice(-1)[0]?.text || "No activity yet",
    lastTimestamp: chatCache["zults-demo"].chatData.slice(-1)[0]?.timestamp || "",
    hasUnread: false,
    favorite: false,
  });
}

    setActivities(data);
  };

  const toggleFavorite = (id) => {
    const updated = activities.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    setActivities(updated);
    if (chatCache[id]) {
      chatCache[id].favorite = !chatCache[id].favorite;
    }
  };

  const handleDelete = (id) => {
    setActivities((prev) => prev.filter((item) => item.id !== id));
    delete chatCache[id]; // ✅ remove from cache so it won’t reappear
  };

  const filteredActivities = activities.filter((item) => {
    if (filter === "unread") return item.hasUnread;
    if (filter === "favorites") return item.favorite;
    return true;
  });

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(id)}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          if (item.id !== "zults-demo") {
  if (chatCache[item.id]) chatCache[item.id].hasUnread = false;
  navigation.navigate("UserChat", {
    user: { id: item.id, name: item.name, image: item.avatar, isBot: false },
    from: "Activities",
  });
} else {
  navigation.navigate("UserChat", {
    user: { id: "zults-demo", name: "Zults (Demo)", image: zultsLogo, isBot: true },
    from: "Activities",
  });
}
        }}
      >
        <Image source={item.avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>
            {item.name}{" "}
            {item.hasUnread && <Text style={styles.unreadDot}>•</Text>}
          </Text>
          <Text style={styles.lastText}>{String(item.lastText || "")}</Text>
        </View>
        <Text style={styles.timestamp}>{String(item.lastTimestamp || "")}</Text>
        {item.id !== "zults-demo" && (
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
        )}
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <ScreenWrapper>
      {/* Back arrow only */}
    <Navbar />

    {/* Large title */}
    <Text style={styles.pageTitle}>Activities</Text>

      {/* Segmented control for filters */}
      <View style={styles.tabsContainer}>
        {["All", "Unread", "Favorites"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={
              filter === tab.toLowerCase()
                ? styles.tabActive
                : styles.tabInactive
            }
            onPress={() => setFilter(tab.toLowerCase())}
          >
            <Text
              style={
                filter === tab.toLowerCase()
                  ? styles.tabActiveText
                  : styles.tabInactiveText
              }
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.surface1 },

  // ✅ Segmented control
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.surface2,
    borderRadius: 18,
    height: 36,
    padding: 4,
    marginTop: 8,       // 👈 tighter spacing under navbar
    marginBottom: 16,
    marginHorizontal: 16,
  },
  tabActive: {
    flex: 1,
    backgroundColor: colors.foreground.default,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  tabInactive: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabActiveText: {
    ...typography.bodyMedium,
    color: colors.background.surface1,
  },
  tabInactiveText: {
    ...typography.bodyMedium,
    color: colors.foreground.soft,
  },

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
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteText: {
    color: "white",
    fontWeight: "600",
  },
  pageTitle: {
  ...typography.largeTitleMedium,
  color: colors.foreground.default,
  marginTop: 8,
  marginHorizontal: 16,
  marginBottom: 12,
},
});
