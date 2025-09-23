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

export default function ActivitiesScreen() {
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const data = Object.keys(chatCache).map((username) => {
      const chat = chatCache[username] || {};
      const lastMsg = chat.chatData?.[chat.chatData.length - 1];
      return {
        id: username,
        name: username,
        avatar: chat.user?.image || fallbackAvatar,
        lastText: lastMsg ? lastMsg.type : "No activity yet",
        lastTimestamp: lastMsg ? lastMsg.timestamp : "",
      };
    });
    setActivities(data);
  }, [chatCache]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() =>
        navigation.navigate("UserChat", {
          user: { name: item.name, image: item.avatar },
        })
      }
    >
      <Image source={item.avatar} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.username}>{item.name}</Text>
        <Text style={styles.lastText}>{item.lastText}</Text>
      </View>
      <Text style={styles.timestamp}>{item.lastTimestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <BlurView intensity={40} tint="dark" style={styles.topBlur}>
        <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
          <Image source={arrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Activities</Text>
      </BlurView>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 100, paddingHorizontal: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No activities yet</Text>}
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
  title: { ...typography.bodyMedium, color: colors.foreground.default, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.background.surface2,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  username: { ...typography.bodyMedium, color: colors.foreground.default },
  lastText: { ...typography.captionSmallRegular, color: colors.foreground.muted },
  timestamp: { ...typography.captionSmallRegular, color: colors.foreground.muted },
  empty: { textAlign: "center", marginTop: 200, color: colors.foreground.muted },
});
