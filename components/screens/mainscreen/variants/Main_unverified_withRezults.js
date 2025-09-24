import React, { useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // 👈 useFocusEffect
import { colors, typography } from "../../../../theme";
import UserProfileHeader from "../../../ui/UserProfileHeader";
import RezultsCard from "../../../ui/RezultsCard";
import NotificationCard from "../../../ui/NotificationCard";
import ZultsButton from "../../../ui/ZultsButton";
import ScreenWrapper from "../../../ui/ScreenWrapper";
import { chatCache, hasSeededDemo, markDemoSeeded } from '../../../../cache/chatCache';
import zultsLogo from "../../../../assets/images/zults.png";

// ✅ Rezults cache
import { rezultsCache } from "../../../../cache/rezultsCache";

// ✅ Expire container
import ExpireContainer from "../../../ui/ExpireContainer";

// ✅ Header container
import RezultsHeaderContainer from "../../../ui/RezultsHeaderContainer";

// ✅ Confirm modal
import ConfirmModal from "../../../ui/ConfirmModal";

// ✅ Delete modal
import DeleteModal from "../../../ui/DeleteModal";

export default function MainUnverifiedWithRezults() {
  const navigation = useNavigation();
  const [recentUsers, setRecentUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
          lastTimestamp: lastMsg ? lastMsg.timestamp : '',
        };
      })
      .sort((a, b) => (a.lastTimestamp < b.lastTimestamp ? 1 : -1));

    // ✅ only seed demo once
    if (users.length === 0 && !hasSeededDemo()) {
      users = [
        {
          id: 'zults-demo',
          name: 'Zults (Demo)',
          avatar: zultsLogo,
          lastTimestamp: 'Now',
        },
      ];
      markDemoSeeded(); // 👈 sets the flag so we don’t reseed again
    }

    console.log("🔄 [MainUnverifiedNoRezults] Rebuilt from chatCache:", chatCache);
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

  const handleAddRezults = () => setShowAddModal(true);
  const handleDeleteRezults = () => setShowDeleteModal(true);

  return (
    <ScreenWrapper>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.surface1}
      />
      <UserProfileHeader hideVerification />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <RezultsHeaderContainer
          onAdd={handleAddRezults}
          onDelete={handleDeleteRezults}
        />

        <RezultsCard
          userName={rezultsCache.card?.userName || "Unknown User"}
          providerName={rezultsCache.card?.providerName || "Unknown Provider"}
          testDate={rezultsCache.card?.testDate || "Unknown Date"}
        />

        <ExpireContainer expiryDate="29 Sep 2025" daysLeft={43} />

        <ZultsButton
          label="Share"
          type="primary"
          size="large"
          onPress={() => navigation.navigate("Share")}
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

      {/* ✅ Confirm Modal */}
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

      {/* ✅ Delete Modal */}
      <DeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          rezultsCache.hasRezults = false;
          rezultsCache.card = null;
          navigation.navigate("MainScreen"); // ✅ unified entry
        }}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
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
  ...typography.bodyMedium,   // 👈 bump up base style
  fontSize: 16,               // 👈 explicit font size
  color: colors.brand.purple1,
  fontWeight: "600",
  },
});
