import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { colors, typography } from "../../../theme";
import Navbar from "../../ui/Navbar";
import ScreenWrapper from "../../ui/ScreenWrapper";
import ZultsButton from "../../ui/ZultsButton";
import ActivityCard from "../../ui/ActivityCard";

import { chatCache } from "../../../cache/chatCache";
import zultsLogo from "../../../assets/images/zults.png";

export default function ActivitiesScreen() {
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");

  const toggleFavorite = (id) => {
    const updated = activities.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    setActivities(updated);
    if (chatCache[id]) chatCache[id].favorite = !chatCache[id].favorite;
  };

  useFocusEffect(
    React.useCallback(() => {
      buildActivities();
    }, [])
  );

  const buildActivities = () => {
    const keys = Object.keys(chatCache).filter((k) => {
      const v = chatCache[k];
      return v && typeof v === "object" && v.user;
    });

    const data = keys.map((key) => {
      const chat = chatCache[key] || {};
      const lastMsg = chat.chatData?.[chat.chatData.length - 1];

      let lastText = "No activity yet";
      if (chat.user?.isBot && chat.user?.id === "zults-demo") {
        lastText = "Ask me anything about sexual health...";
      } else if (lastMsg) {
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
        hasUnread: chat.hasUnread ?? false,
        favorite: chat.favorite || false,
        isBot: chat.user?.isBot || false,
      };
    });

    if (data.length === 0) {
      if (!chatCache["zults-demo"]) {
        chatCache["zults-demo"] = {
          user: { id: "zults-demo", name: "Rez", image: zultsLogo, isBot: true },
          chatData: [],
          chatState: {},
          otherUserState: {},
          blocked: false,
          hasUnread: true,
        };
      }
      data.push({
        id: "zults-demo",
        name: "Rez",
        avatar: zultsLogo,
        lastText: "Ask me anything about sexual health...",
        lastTimestamp: "",
        hasUnread: true,
        favorite: false,
        isBot: true,
      });
    }

    setActivities(data);
  };

  const handleDelete = (id) => {
    setActivities((prev) => prev.filter((item) => item.id !== id));
    delete chatCache[id];
  };

  const renderRightActions = (progress, dragX, id) => {
    const scale = dragX.interpolate({
      inputRange: [-120, -80, 0],
      outputRange: [1.05, 1, 0.8],
      extrapolate: "clamp",
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -20, 0],
      outputRange: [1, 0.9, 0],
      extrapolate: "clamp",
    });

    return (
      <Animated.View style={[styles.deleteButton, { transform: [{ scale }], opacity }]}>
        <TouchableOpacity onPress={() => handleDelete(id)} activeOpacity={0.8}>
          <Image
            source={require("../../../assets/images/close-cross.png")}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
      <ActivityCard
        user={{
          id: item.id,
          name: item.name,
          avatar: item.avatar,
          date: item.lastTimestamp,
          message: item.lastText,
          unreadCount: item.hasUnread ? 1 : 0,
          favorite: item.favorite,
          isBot: item.isBot,
        }}
        onPress={() => {
          navigation.navigate("UserChat", {
            user: item.isBot
              ? { id: "zults-demo", name: "Rez", image: zultsLogo, isBot: true }
              : chatCache[item.id]?.user,
            from: "Activities",
          });
        }}
        onToggleFavorite={() => toggleFavorite(item.id)}
      />
    </Swipeable>
  );

  return (
    <ScreenWrapper>
      <Navbar />

      {/* ─── Header Block ─── */}
      <View style={styles.headerBlock}>
        <Text style={styles.pageTitle}>
          Activities
        </Text>
      </View>

      {/* ─── Tabs ─── */}
      <View style={styles.tabsContainer}>
        {["All", "Unread", "Favorites"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={filter === tab.toLowerCase() ? styles.tabActive : styles.tabInactive}
            onPress={() => setFilter(tab.toLowerCase())}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              adjustsFontSizeToFit
              minimumFontScale={0.9}
              style={filter === tab.toLowerCase() ? styles.tabActiveText : styles.tabInactiveText}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ─── List ─── */}
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

      {/* ─── Footer ─── */}
      <View style={styles.footer}>
        <ZultsButton
          label="Get Full Access"
          type="secondary"
          size="medium"
          fullWidth={false}
          onPress={() => navigation.navigate("PolicyScreen")}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  pageTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.surface2,
    borderRadius: 18,
    padding: 4,
    marginBottom: 16,
    marginHorizontal: 16,
    minHeight: 36,
  },
  tabActive: {
    flex: 1,
    backgroundColor: colors.foreground.default,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  tabInactive: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  tabActiveText: {
    ...typography.bodyMedium,
    color: colors.background.surface1,
  },
  tabInactiveText: {
    ...typography.bodyMedium,
    color: colors.foreground.soft,
  },
  empty: {
    ...typography.captionLargeRegular,
    textAlign: "center",
    marginTop: 200,
    color: colors.foreground.soft,
  },
  deleteButton: {
    backgroundColor: colors.error.container,
    justifyContent: "center",
    alignItems: "center",
    width: 72,
    height: "90%",
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 4,
  },
  deleteIcon: { width: 24, height: 24, tintColor: colors.error.onContainer },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
