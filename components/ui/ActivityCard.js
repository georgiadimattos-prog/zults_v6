import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { colors, typography } from "../../theme";
import star from "../../assets/images/star.png";
import starFilled from "../../assets/images/star-filled.png";

export default function ActivityCard({ user, onPress, onToggleFavorite }) {
  return (
    <View style={styles.card}>
      {/* Whole row clickable except the star */}
      <TouchableOpacity style={styles.mainContent} onPress={onPress} activeOpacity={0.85}>
        <Image source={user.avatar} style={styles.avatar} />

        <View style={styles.textSection}>
          {/* ─── Top Row: Name + Right cluster ─── */}
          <View style={styles.topRow}>
            <Text
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user.name}
            </Text>

            <View style={styles.rightCluster}>
              <Text
                style={styles.date}
              >
                {user.date}
              </Text>

              {user.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{user.unreadCount}</Text>
                </View>
              )}

              {user.isBot ? (
                <Image
                  source={require("../../assets/images/pin-icon.png")}
                  style={[styles.starIcon, { tintColor: colors.brand.purple1 }]}
                />
              ) : (
                onToggleFavorite && (
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
                )
              )}
            </View>
          </View>

          {/* ─── Message preview ─── */}
          <Text
            style={styles.message}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
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
    minHeight: 64,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textSection: { flex: 1 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  rightCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // ─── Typography ───
  name: {
    ...typography.headlineMedium, // 16 / 20 / -0.08
    color: colors.foreground.default,
  },
  date: {
    ...typography.captionSmallRegular, // 12 / 16
    color: colors.foreground.muted,
  },
  message: {
    ...typography.captionLargeRegular, // 14 / 18
    color: colors.foreground.soft,
    opacity: 0.6,
    includeFontPadding: false,
  },

  // ─── Icons + badges ───
  unreadBadge: {
    backgroundColor: colors.brand.purple1,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  unreadText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  starIcon: { width: 20, height: 20 },
  starButton: { padding: 4 },
  mainContent: { flexDirection: "row", alignItems: "center", flex: 1 },
});