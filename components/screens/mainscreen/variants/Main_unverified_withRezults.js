import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { colors, typography } from "../../../../theme";
import UserProfileHeader from "../../../ui/UserProfileHeader";
import RezultsCard from "../../../ui/RezultsCard";
import NotificationCard from "../../../ui/NotificationCard";
import ZultsButton from "../../../ui/ZultsButton";
import ScreenWrapper from "../../../ui/ScreenWrapper";
import { chatCache, hasSeededDemo, markDemoSeeded } from "../../../../cache/chatCache";
import zultsLogo from "../../../../assets/images/zults.png";
import { rezultsCache } from "../../../../cache/rezultsCache";
import ExpireContainer from "../../../ui/ExpireContainer";
import RezultsHeaderContainer from "../../../ui/RezultsHeaderContainer";
import ConfirmModal from "../../../ui/ConfirmModal";
import DeleteModal from "../../../ui/DeleteModal";

export default function MainUnverifiedWithRezults({ onLinkPress, onSharePress }) {
  const navigation = useNavigation();
  const [recentUsers, setRecentUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🔄 animation controller for RezultsCard
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 🔄 refresh whenever screen is focused
  useFocusEffect(
    React.useCallback(() => {
      let users = Object.keys(chatCache)
        .map((username) => {
          const chat = chatCache[username] || {};
          const lastMsg = chat.chatData?.[chat.chatData.length - 1];
          return {
            id: username,
            name: username,
            avatar: chat.user?.image || zultsLogo,
            lastTimestamp: lastMsg ? lastMsg.timestamp : "",
          };
        })
        .sort((a, b) => (a.lastTimestamp < b.lastTimestamp ? 1 : -1));

      // ✅ only seed demo once
      if (users.length === 0 && !hasSeededDemo()) {
  const demoId = "zults-demo";

  chatCache[demoId] = {
    user: { id: demoId, name: "Zults (Demo)", image: zultsLogo, isBot: true },
    chatData: [], // ⬅️ no hardcoded messages anymore
    chatState: { hasShared: false, hasRequested: false },
    otherUserState: { hasShared: false, hasRequested: false },
    blocked: false,
  };

  users = [
    {
      id: demoId,
      name: "Zults (Demo)",
      avatar: zultsLogo,
      lastTimestamp: "Now",
    },
  ];

  markDemoSeeded();
}

      console.log("🔄 [MainUnverifiedWithRezults] Rebuilt from chatCache:", chatCache);
      setRecentUsers(users);
    }, [])
  );

  const renderAvatars = () => {
    const display = recentUsers.slice(0, 4);
    const extra = recentUsers.length - display.length;

    return (
      <View style={styles.avatarRow}>
        {display.map((user, index) => (
          <Image
            key={user.id}
            source={user.avatar}
            style={[styles.avatar, { marginLeft: index === 0 ? 0 : -12 }]}
          />
        ))}
        {extra > 0 && (
          <View style={[styles.avatar, styles.extraAvatar]}>
            <Text style={styles.extraText}>+{extra}</Text>
          </View>
        )}
      </View>
    );
  };

  // 🗑 handle Rezults deletion with animation
  const handleDeleteRezults = () => {
    // animate RezultsCard fade + shrink
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // clear cache
      rezultsCache.hasRezults = false;
      rezultsCache.card = null;

      // reset navigation → MainScreen will re-render into "no Rezults" state
      navigation.reset({
        index: 0,
        routes: [{ name: "MainScreen" }],
      });
    });
  };

  return (
    <ScreenWrapper>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.surface1} />
      <UserProfileHeader hideVerification />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <RezultsHeaderContainer
          onAdd={() => setShowAddModal(true)}
          onDelete={() => setShowDeleteModal(true)}
        />

        {/* Animated Rezults card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }],
          }}
        >
          <RezultsCard
            userName={rezultsCache.card?.userName || "Unknown User"}
            providerName={rezultsCache.card?.providerName || "Unknown Provider"}
            testDate={rezultsCache.card?.testDate || "Unknown Date"}
          />
        </Animated.View>

        <ExpireContainer expiryDate="29 Sep 2025" daysLeft={43} />

        {/* ✅ Share button now calls parent onSharePress */}
        <ZultsButton
          label="Share"
          type="primary"
          size="large"
          onPress={onSharePress}
        />

        {/* Activities Section */}
        <View style={{ marginTop: 15 }}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <View style={styles.activitiesCard}>
            {renderAvatars()}
            <TouchableOpacity onPress={() => navigation.navigate("Activities")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>

        <NotificationCard />
      </ScrollView>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add a new Rezults?"
        description="By adding a new Rezults, your current card will be replaced with the latest one."
        confirmLabel="Continue"
        onConfirm={() => {
          setShowAddModal(false);
          navigation.navigate("GetRezultsProvider");
        }}
      />

      {/* Delete Modal */}
      <DeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteRezults}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 24,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    marginBottom: 8,
  },
  activitiesCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.surface2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.background.surface1,
  },
  extraAvatar: {
    marginLeft: -12,
    backgroundColor: colors.background.surface1,
    justifyContent: "center",
    alignItems: "center",
  },
  extraText: {
    ...typography.captionSmallRegular,
    color: colors.foreground.default,
    fontWeight: "600",
  },
  viewAllText: {
    ...typography.bodyMedium,
    fontSize: 16,
    color: colors.brand.purple1,
    fontWeight: "600",
  },
});
