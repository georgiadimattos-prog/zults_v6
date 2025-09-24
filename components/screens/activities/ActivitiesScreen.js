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
import { BlurView } from "expo-blur";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { colors, typography } from "../../../theme";

import { chatCache, hasSeededDemo, markDemoSeeded } from "../../../cache/chatCache";
import fallbackAvatar from "../../../assets/images/melany.png";
import arrowLeft from "../../../assets/images/navbar-arrow.png";

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

    // inject demo if nothing left
    if (data.length === 0) {
      data.push({
        id: "zults-demo",
        name: "Zults (Demo)",
        avatar: zultsLogo,
        lastText:
          "Hi there, this is a demo Rezults so you can see how they appear in the app. 💜 We hope you enjoy using Zults and make the most of it to stay safe, healthy, and confident! ✨",
        lastTimestamp: "Now",
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
            user: { name: item.name, image: item.avatar },
            from: "Activities", // 👈 added here
          });
        } else {
          navigation.navigate("UserChat", {
            user: { id: "zults-demo", name: "Zults (Demo)", image: zultsLogo },
            from: "Activities", // 👈 added here too
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
          <Text style={styles.lastText}>{item.lastText}</Text>
        </View>
        <Text style={styles.timestamp}>{item.lastTimestamp}</Text>
        {item.id !== "zults-demo" && (
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Image
              source={item.favorite ? starFilled : star}
              style={[
                styles.starIcon,
                { tintColor: item.favorite ? colors.brand.purple1 : colors.foreground.muted },
              ]}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Swipeable>
  );

  return (
  <View style={styles.root}>
    {/* Nav bar */}
    <BlurView intensity={40} tint="dark" style={styles.topBlur}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Back */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
  <Image source={arrowLeft} style={styles.backIcon} />
</TouchableOpacity>

        {/* Middle: Title */}
        <Text style={styles.title}>Activities</Text>

        {/* Right: Invite */}
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.invite}>Invite</Text>
        </TouchableOpacity>
      </View>
    </BlurView>

      {/* Segmented control for filters */}
<View style={styles.tabsContainer}>
  {["All", "Unread", "Favorites"].map((tab) => (
    <TouchableOpacity
      key={tab}
      style={filter === tab.toLowerCase() ? styles.tabActive : styles.tabInactive}
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
        contentContainerStyle={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 100 }}
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
    paddingTop: Platform.OS === "ios" ? 108 : 84,
    paddingBottom: 20,
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
    textAlign: "center",
    flex: 1,
  },

  invite: {
    ...typography.bodyMedium,
    color: "#0A84FF", // Apple blue (or colors.brand.blue1 if defined)
    fontWeight: "600",
  },

  // ✅ New segmented control styles
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.surface2,
    borderRadius: 18,
    height: 36,
    padding: 4,
    marginTop: Platform.OS === "ios" ? 150 : 110, // 👈 matches ShareScreen
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
    ...typography.headlineRegular,
    color: colors.background.surface1,
  },
  tabInactiveText: {
    ...typography.headlineRegular,
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
});