import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { colors, typography } from "../../theme";
import star from "../../assets/images/star.png";
import starFilled from "../../assets/images/star-filled.png";

export default function ActivityCard({ user, onPress, onToggleFavorite }) {
  return (
    <View style={styles.card}>
      {/* Whole row clickable except the star */}
      <TouchableOpacity style={styles.mainContent} onPress={onPress} activeOpacity={0.8}>
        <Image source={user.avatar} style={styles.avatar} />

        <View style={styles.textSection}>
          <View style={styles.topRow}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.date}>{user.date}</Text>
          </View>

          <Text style={styles.message} numberOfLines={1}>
            {user.message}
          </Text>
        </View>

        {user.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{user.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ⭐ Favorite star — isolated pressable */}
{onToggleFavorite && (
  <TouchableOpacity
    onPress={onToggleFavorite}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} // 👈 bigger invisible touch area
    style={styles.starButton}
  >
    <Image
      source={user.favorite ? starFilled : star}
      style={[
        styles.starIcon,
        {
          tintColor: user.favorite
            ? colors.brand.purple1
            : colors.foreground.muted,
        },
      ]}
    />
  </TouchableOpacity>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.surface2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textSection: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
  },
  date: {
    ...typography.captionSmallRegular,
    color: colors.foreground.muted,
  },
  message: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
  },
  unreadBadge: {
    backgroundColor: colors.brand.purple1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  starButton: {
  padding: 8, // ✅ easier touch target
},
mainContent: {
  flexDirection: "row",
  alignItems: "center",
  flex: 1, // ✅ take all space except for the star
},
});