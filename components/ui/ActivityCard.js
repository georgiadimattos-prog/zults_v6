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

            {/* 👇 Right-side cluster */}
            <View style={styles.rightCluster}>
              <Text style={styles.date}>{user.date}</Text>
              {user.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{user.unreadCount}</Text>
                </View>
              )}
              {onToggleFavorite && (
                <TouchableOpacity
                  onPress={onToggleFavorite}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
          </View>

          <Text style={styles.message} numberOfLines={1}>
            {user.message}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)", // 👈 softer divider
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
    alignItems: "center",
    marginBottom: 6,
  },
  rightCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // 👈 equal spacing
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
    color: colors.foreground.muted, // 👈 lighter preview text
    lineHeight: typography.bodyRegular.fontSize + 4,
  },
  unreadBadge: {
    backgroundColor: colors.brand.purple1,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  starButton: {
    padding: 4,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});