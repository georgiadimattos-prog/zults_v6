import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";

const sampleActivities = [
  {
    id: "1",
    name: "Binkey",
    avatar: require("../../../assets/images/melany.png"),
    action: "shared Rezults with you",
    time: "10:12 AM",
    unread: true,
  },
  {
    id: "2",
    name: "TomasB.",
    avatar: require("../../../assets/images/tomas.png"),
    action: "requested your Rezults",
    time: "Yesterday",
    unread: false,
  },
];

export default function ActivitiesScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState("All");

  const filtered =
    tab === "Unread"
      ? sampleActivities.filter((a) => a.unread)
      : tab === "Favorites"
      ? [] // placeholder for future favorites logic
      : sampleActivities;

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Activities</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["All", "Unread", "Favorites"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text
              style={[styles.tabText, tab === t && styles.tabTextActive]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.row,
              item.unread && styles.unreadRow,
            ]}
          >
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.name,
                  item.unread && styles.unreadText,
                ]}
              >
                {item.name}
              </Text>
              <Text style={styles.action}>{item.action}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background.surface1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.surface2,
  },
  backArrow: {
    fontSize: 22,
    color: colors.foreground.default,
    marginRight: 12,
  },
  title: {
    ...typography.headlineMedium,
    color: colors.foreground.default,
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.brand.purple1,
  },
  tabText: {
    ...typography.bodyMedium,
    color: colors.foreground.muted,
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.surface2,
  },
  unreadRow: {
    backgroundColor: colors.background.surface2, // subtle highlight
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
  },
  action: {
    ...typography.bodyRegular,
    color: colors.foreground.muted,
  },
  unreadText: {
    fontWeight: "700",
  },
  time: {
    ...typography.captionSmallRegular,
    color: colors.foreground.muted,
    marginLeft: 8,
  },
});
