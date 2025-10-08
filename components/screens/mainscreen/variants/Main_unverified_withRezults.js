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
  DeviceEventEmitter,
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
  const [headerHeight, setHeaderHeight] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    React.useCallback(() => {
      const buildList = () => {
        let users = Object.keys(chatCache)
          .filter((k) => chatCache[k]?.user)
          .map((key) => {
            const chat = chatCache[key];
            const lastMsg = chat.chatData?.[chat.chatData.length - 1];
            return {
              id: key,
              name: chat.user?.name || key,
              avatar: chat.user?.image || zultsLogo,
              lastTimestamp: lastMsg ? lastMsg.timestamp : "",
              hasUnread: chat.hasUnread ?? false,
            };
          })
          .sort((a, b) => (a.lastTimestamp < b.lastTimestamp ? 1 : -1));

        if (users.length === 0 && !hasSeededDemo()) {
          const demoId = "zults-demo";
          chatCache[demoId] = {
            user: { id: demoId, name: "Rezy", image: zultsLogo, isBot: true },
            chatData: [],
            chatState: { hasShared: false, hasRequested: false },
            otherUserState: { hasShared: false, hasRequested: false },
            blocked: false,
            hasUnread: true,
          };
          users = [
            {
              id: demoId,
              name: "Rezy",
              avatar: zultsLogo,
              lastTimestamp: "Now",
              hasUnread: true,
            },
          ];
          markDemoSeeded();
        }

        setRecentUsers(users);
      };

      buildList();
      const subGlobal = DeviceEventEmitter.addListener("chat-updated", buildList);
      return () => subGlobal.remove();
    }, [])
  );

  const unreadUsers = recentUsers.filter((u) => u.hasUnread);

  const handleDeleteRezults = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      rezultsCache.hasRezults = false;
      rezultsCache.card = null;
      navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] });
    });
  };

  const renderAvatars = () => {
    const display = recentUsers.slice(0, 4);
    const extra = recentUsers.length - display.length;
    return (
      <View style={styles.avatarRow}>
        {display.map((user, i) => (
          <Image
            key={user.id}
            source={user.avatar}
            style={[styles.avatar, { marginLeft: i === 0 ? 0 : -12 }]}
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

  return (
    <ScreenWrapper>
      <StatusBar barStyle="light-content" translucent />
      <UserProfileHeader
        hideVerification
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight }]}
      >
        <RezultsHeaderContainer
          onAdd={() => setShowAddModal(true)}
          onDelete={() => setShowDeleteModal(true)}
          onWallet={() => navigation.navigate("AddToWallet")}
        />

        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: fadeAnim }] }}>
          <RezultsCard
            realName={rezultsCache.card?.realName || null}
            isVerified={rezultsCache.card?.isVerified || false}
            showRealName={rezultsCache.card?.showRealName || false}
            providerName={rezultsCache.card?.providerName || "Unknown Provider"}
            testDate={rezultsCache.card?.testDate || "Unknown Date"}
          />
          <View style={{ marginTop: 12 }}>
            <ExpireContainer expiryDate="20 Jan 2026" daysLeft={92} />
          </View>
        </Animated.View>

        <ZultsButton
          label="Share"
          type="primary"
          size="large"
          onPress={onSharePress ?? (() => navigation.navigate("Share"))}
          style={{ marginTop: 16 }}
        />

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
            onPress={() => navigation.navigate("Activities")}
          >
            {recentUsers.length > 0 ? (
              <View style={styles.row}>
                {renderAvatars()}
                <Text style={styles.activityText}>
                  {unreadUsers.length > 0
                    ? `${unreadUsers.length} unread message${
                        unreadUsers.length > 1 ? "s" : ""
                      }`
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

      <ConfirmModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New?"
        description="By adding a new Rezults, your current one will be replaced with the latest one."
        confirmLabel="Continue"
        onConfirm={() => {
          setShowAddModal(false);
          navigation.navigate("GetRezultsSelectProvider");
        }}
      />

      <DeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteRezults}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 16, paddingBottom: 32, gap: 20 },
  activitiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 4,
  },
  sectionTitle: {
    ...typography.title4Medium,
    color: colors.foreground.default,
  },
  viewAll: {
    ...typography.subheadlineRegular,
    color: colors.info.onContainer,
  },
  activitiesCard: {
    backgroundColor: colors.background.surface2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatarRow: { flexDirection: "row", alignItems: "center" },
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
  activityText: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
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
