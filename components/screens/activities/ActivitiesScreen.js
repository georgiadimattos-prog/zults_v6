import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,   // 👈 add this back
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { DeviceEventEmitter } from "react-native";
import { colors, typography } from "../../../theme";
import Navbar from "../../ui/Navbar";
import ScreenWrapper from "../../ui/ScreenWrapper";
import ZultsButton from "../../ui/ZultsButton";
import ActivityCard from "../../ui/ActivityCard";   // ✅ new import

import { chatCache, hasSeededDemo, markDemoSeeded } from "../../../cache/chatCache";
import zultsLogo from "../../../assets/images/zults.png";

export default function ActivitiesScreen() {
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");

  // ⭐ Add toggleFavorite here
  const toggleFavorite = (id) => {
    const updated = activities.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    setActivities(updated);

    if (chatCache[id]) {
      chatCache[id].favorite = !chatCache[id].favorite; // keep cache in sync
    }
  };

  // 🔄 reload activities every time screen is focused
  useFocusEffect(
    React.useCallback(() => {
      buildActivities();
    }, [])
  );

  const buildActivities = () => {
    const data = Object.keys(chatCache).map((key) => {
      const chat = chatCache[key] || {};
      const lastMsg = chat.chatData?.[chat.chatData.length - 1];

      let lastText = "No activity yet";
      if (lastMsg) {
        if (lastMsg.type === "request") {
          lastText =
            lastMsg.direction === "from-user"
              ? "You requested to view Rezults"
              : `${chat.user?.name || key} requested to view Rezults`;
        } else if (lastMsg.type === "share") {
          lastText =
            lastMsg.direction === "from-user"
              ? "You shared your Rezults"
              : `${chat.user?.name || key} shared their Rezults`;
        } else if (lastMsg.type === "stop-share") {
          lastText =
            lastMsg.direction === "from-user"
              ? "You stopped sharing Rezults"
              : `${chat.user?.name || key} stopped sharing Rezults`;
        } else {
          lastText = lastMsg.type;
        }
      }

      return {
        id: chat.user?.id || key,
        name: chat.user?.name || key,
        avatar: chat.user?.image,
        lastText,
        lastTimestamp: lastMsg ? lastMsg.timestamp : "",
        hasUnread: chat.hasUnread || false,
        favorite: chat.favorite || false,
      };
    });

    // inject demo if nothing left
    if (data.length === 0) {
      if (!chatCache["zults-demo"]) {
        chatCache["zults-demo"] = {
          user: { id: "zults-demo", name: "Zults Bot", image: zultsLogo, isBot: true },
          chatData: [],
          chatState: { hasShared: false, hasRequested: false },
          otherUserState: { hasShared: false, hasRequested: false },
          blocked: false,
        };
      }

      data.push({
        id: "zults-demo",
        name: "Zults Bot",
        avatar: zultsLogo,
        lastText: chatCache["zults-demo"].chatData.slice(-1)[0]?.text || "No activity yet",
        lastTimestamp: chatCache["zults-demo"].chatData.slice(-1)[0]?.timestamp || "",
        hasUnread: false,
        favorite: false,
      });
    }

    setActivities(data);
  };

  const handleDelete = (id) => {
    setActivities((prev) => prev.filter((item) => item.id !== id));
    delete chatCache[id];
  };

  const renderRightActions = (id) => (
  <TouchableOpacity
    style={styles.deleteButton}
    onPress={() => handleDelete(id)}
    activeOpacity={0.7}
  >
    <Image
      source={require("../../../assets/images/close-cross.png")}
      style={styles.deleteIcon}
    />
  </TouchableOpacity>
);

  const renderItem = ({ item }) => (
  <Swipeable renderRightActions={() => renderRightActions(item.id)}>
    <ActivityCard
      user={{
        id: item.id,
        name: item.name,
        avatar: item.avatar,
        date: item.lastTimestamp,
        message: item.lastText,
        unreadCount: item.hasUnread ? 1 : 0,
        favorite: item.favorite, // 👈 current favorite state (true/false)
      }}
      onPress={() => {
        if (item.id !== "zults-demo") {
          if (chatCache[item.id]) {
            chatCache[item.id].hasUnread = false;
            DeviceEventEmitter.emit("chat-updated");
          }
          navigation.navigate("UserChat", {
            user: chatCache[item.id]?.user,
            from: "Activities",
          });
        } else {
          navigation.navigate("UserChat", {
            user: {
              id: "zults-demo",
              name: "Zults Bot",
              image: zultsLogo,
              isBot: true,
            },
            from: "Activities",
          });
        }
      }}
      onToggleFavorite={() => toggleFavorite(item.id)} // 👈 toggles heart
    />
  </Swipeable>
);

  return (
    <ScreenWrapper>
      <Navbar />
      <Text style={styles.pageTitle}>Activities</Text>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {["All", "Unread", "Favorites"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={filter === tab.toLowerCase() ? styles.tabActive : styles.tabInactive}
            onPress={() => setFilter(tab.toLowerCase())}
          >
            <Text style={filter === tab.toLowerCase() ? styles.tabActiveText : styles.tabInactiveText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={activities.filter((item) =>
          filter === "unread" ? item.hasUnread : filter === "favorites" ? item.favorite : true
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 16, paddingBottom: 160 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
    {filter === "all"
      ? "No recent activity"
      : filter === "unread"
      ? "No unread chats"
      : "No favorites yet"}
  </Text>
}
/>

      {/* Footer */}
      <View style={styles.footer}>
        <ZultsButton
          label="Get Full Access"
          type="secondary"
          size="medium"
          fullWidth={false}
          onPress={() => navigation.navigate("PolicyScreen")}
          style={{ borderRadius: 0 }}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.surface2,
    borderRadius: 18,
    height: 36,
    padding: 4,
    marginTop: 8,
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
  pageTitle: {
  ...typography.largeTitleMedium,
  color: colors.foreground.default,
  marginTop: 8,
  marginHorizontal: 16,
  marginBottom: 12,
  },
  empty: {
  ...typography.subheadlineRegular,   // 👈 lighter, smaller than before
  textAlign: "center",
  marginTop: 200,
  color: colors.foreground.muted,
},
  deleteButton: {
  backgroundColor: colors.error.container,
  justifyContent: "center",
  alignItems: "center",
  width: 72,
  height: "90%",              // slightly shorter, more “button” feel
  borderRadius: 20,           // round all corners
  alignSelf: "center",        // center vertically in the row
  marginVertical: 4,          // little breathing space
},
deleteIcon: {
  width: 24,
  height: 24,
  tintColor: colors.error.onContainer,
},
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});