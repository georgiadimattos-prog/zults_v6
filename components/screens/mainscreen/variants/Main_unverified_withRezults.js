// components/screens/mainscreen/variants/MainUnverifiedWithRezults.js
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
import {
  chatCache,
  hasSeededDemo,
  markDemoSeeded,
} from "../../../../cache/chatCache";
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
  const [headerHeight, setHeaderHeight] = useState(0); // ✅ dynamic header height

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
            name: chat.user?.name || username,
            avatar: chat.user?.image || zultsLogo,
            lastTimestamp: lastMsg ? lastMsg.timestamp : "",
          };
        })
        .sort((a, b) => (a.lastTimestamp < b.lastTimestamp ? 1 : -1));

      if (users.length === 0 && !hasSeededDemo()) {
  const demoId = "zults-demo";
  chatCache[demoId] = {
    user: {
      id: demoId,
      name: "Rezy",
      image: zultsLogo,
      isBot: true,
    },
    chatData: [],
    chatState: { hasShared: false, hasRequested: false },
    otherUserState: { hasShared: false, hasRequested: false },
    blocked: false,
    hasUnread: true,   // ✅ mark Rezy unread on seed
  };

  users = [
    {
      id: demoId,
      name: "Rezy",
      avatar: zultsLogo,
      lastTimestamp: "Now",
      hasUnread: true,  // ✅ carry through to recentUsers
    },
  ];

  markDemoSeeded();
}

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
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      rezultsCache.hasRezults = false;
      rezultsCache.card = null;

      navigation.reset({
        index: 0,
        routes: [{ name: "MainScreen" }],
      });
    });
  };

  // ✅ declare unreadUsers right here, before return
  const unreadUsers = recentUsers.filter((u) => u.hasUnread);

  return (
    <ScreenWrapper>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <UserProfileHeader
        hideVerification
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight }, // ✅ dynamic push-down
        ]}
      >
        {/* Rezults block (actions + card + expiry) */}
<View style={{ marginBottom: 12 }}></View>
        <RezultsHeaderContainer
          onAdd={() => setShowAddModal(true)}
          onDelete={() => setShowDeleteModal(true)}
          onWallet={() => navigation.navigate("AddToWallet")} // 👈 wire it here
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
  <View style={{ marginTop: 12 }}>
    <ExpireContainer expiryDate="29 Sep 2025" daysLeft={43} />
  </View>
</Animated.View>

<ZultsButton
  label="Share"
  type="primary"
  size="large"
  onPress={onSharePress}
  style={{ marginTop: 16 }}   // 👈 spacing below expiry
/>

{/* Activities Section */}
<View style={{ marginTop: 24 }}>
  <View style={styles.activitiesHeader}>
    <Text style={styles.sectionTitle}>Activities</Text>
    <TouchableOpacity
      onPress={() => navigation.navigate("Activities")}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={styles.viewAll}>View All</Text>
    </TouchableOpacity>
  </View>

  <TouchableOpacity
    style={styles.activitiesCard}
    activeOpacity={0.8}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    onPress={() => navigation.navigate("Activities")}
  >
    {recentUsers.length > 0 ? (
      <View style={styles.row}>
        <View style={styles.avatarRow}>
          {recentUsers.slice(0, 3).map((user, index) => (
            <Image
              key={user.id}
              source={user.avatar}
              style={[styles.avatar, { marginLeft: index === 0 ? 0 : -12 }]}
            />
          ))}
          {recentUsers.length > 3 && (
            <View style={[styles.avatar, styles.extraAvatar]}>
              <Text style={styles.extraText}>+{recentUsers.length - 3}</Text>
            </View>
          )}
        </View>

        <Text style={styles.activityText}>
          {unreadUsers.length > 0
            ? `${unreadUsers.length} unread message${unreadUsers.length > 1 ? "s" : ""}`
            : "No recent activity"}
        </Text>
      </View>
    ) : (
      <View>
        <Text style={styles.emptyTitle}>No recent activity</Text>
        <Text style={styles.emptySubtitle}>
          You’ll see Rezults shared here
        </Text>
      </View>
    )}
  </TouchableOpacity>
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
          navigation.navigate("GetRezultsSelectProvider");
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
    gap: 20,   // 👈 section rhythm, was 24
  },
  sectionTitle: {
  ...typography.headlineMedium,
  color: colors.foreground.default,
},
  activitiesCard: {
  backgroundColor: colors.background.surface2,
  borderRadius: 16,
  paddingHorizontal: 16,
  paddingVertical: 16,  // 👈 reduced from 20 → 16 for balance
  alignItems: "center",
  justifyContent: "center",
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
  activitiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 4,
    marginBottom: 12,  // 👈 bumped from 8 → 12 for cleaner rhythm
  },
  viewAll: {
  ...typography.captionSmallRegular,   // 👈 lighter, smaller
  color: colors.brand.accent,
},
  row: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
},
activityText: {
  ...typography.subheadlineRegular,
  color: colors.foreground.soft,   // 👈 lighter than default
  marginLeft: 12,
},
emptyTitle: {
  ...typography.subheadlineMedium,
  color: colors.foreground.default,
  textAlign: "center",
  marginBottom: 4,
},
emptySubtitle: {
  ...typography.subheadlineRegular,
  color: colors.foreground.muted,
  textAlign: "center",
},
});
