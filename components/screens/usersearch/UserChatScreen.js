import React, { useState, useRef, useEffect, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { TapGestureHandler } from "react-native-gesture-handler";
import { DeviceEventEmitter } from "react-native";
import { colors, typography } from "../../../theme";

// 🟣 UI Components
import RezultActionBubble from "../../ui/RezultActionBubble";
import ActionModal from "../../ui/ActionModal";
import NoRezultsModal from "../../ui/NoRezultsModal";
import ZultsButton from "../../ui/ZultsButton";
import RezultsActionButton from "../../ui/RezultsActionButton";

// 🖼️ Assets
import arrowLeft from "../../../assets/images/navbar-arrow.png";
import moreIcon from "../../../assets/images/navbar-dots.png";
import fallbackAvatar from "../../../assets/images/melany.png";
const TomasAvatar = require("../../../assets/images/tomas.png");

// 💾 Cache
import { rezultsCache } from "../../../cache/rezultsCache";
import {
  appendMessage,
  updateBotState,
  updateUserState,
  createMessage,
} from "../../../cache/chatCacheHelpers"; // ✅ fixed path

// ⚙️ Logic Hooks
import { chatCache, safeEmit } from "../../../cache/chatCache"; // ✅ added this
import { useDemoChat } from "../../../logic/useDemoChat";
import { useReciprocalShare } from "../../../logic/useReciprocalShare";


// 🕒 Simple local time helper
const getLocalTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// 💬 Typing dots animation
function TypingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;
  const loopRef = useRef(null);

  useEffect(() => {
    const animate = (dot, delay) =>
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);

    loopRef.current = Animated.loop(
      Animated.parallel([animate(dot1, 0), animate(dot2, 150), animate(dot3, 300)])
    );

    loopRef.current.start();

    return () => {
      try {
        loopRef.current?.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <View style={{ flexDirection: "row", padding: 2 }}>
      <Animated.Text style={{ opacity: dot1, fontSize: 18, marginHorizontal: 2 }}>•</Animated.Text>
      <Animated.Text style={{ opacity: dot2, fontSize: 18, marginHorizontal: 2 }}>•</Animated.Text>
      <Animated.Text style={{ opacity: dot3, fontSize: 18, marginHorizontal: 2 }}>•</Animated.Text>
    </View>
  );
}

// 💬 Chat bubble row (handles double-like)
const MessageRow = memo(function MessageRow({ item, user, onDoubleLike }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleDouble = () => {
    const didToggle = onDoubleLike?.(item);
    if (didToggle) {
      scale.setValue(0.5);
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 80,
      }).start();
    }
  };

  return (
    <TapGestureHandler numberOfTaps={2} onActivated={handleDouble}>
      <View
        style={{
          alignSelf: item.direction === "from-user" ? "flex-end" : "flex-start",
          maxWidth: "85%",
          flexShrink: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <View style={{ position: "relative" }}>
          <RezultActionBubble
            type={item.type}
            direction={item.direction}
            username={item.username}
            avatar={item.avatar}
            timestamp={item.timestamp}
            text={item.text || ""}
            chatUserId={user.id}
          />
          {item.liked && (
            <Animated.View
              style={{
                position: "absolute",
                bottom: 27,
                right: 4,
                transform: [{ scale }],
              }}
            >
              <Text style={{ fontSize: 14 }}>🔥</Text>
            </Animated.View>
          )}
        </View>
      </View>
    </TapGestureHandler>
  );
});

export default function UserChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const user = route.params?.user || { name: "Unknown", image: fallbackAvatar };
  const currentUser = { name: "TomasB.", avatar: TomasAvatar };

  // 💬 Unified demo logic
  const {
    chatData,
    setChatData,
    buttonState,
    setButtonState,
    startRequestFlow,
    clearTimers,
  } = useDemoChat(user);

  const { handleUserShare } = useReciprocalShare();

  const inputRef = useRef(null);
  const flatListRef = useRef(null);
  const [message, setMessage] = useState("");
  const [footerHeight, setFooterHeight] = useState(0);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showNoRezultsModal, setShowNoRezultsModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [highlightTopCTA, setHighlightTopCTA] = useState(false);

  // 🧩 Restore previous button state when re-entering chat
useEffect(() => {
  const saved = chatCache?.[user.id];
  if (!saved?.chatData?.length) return;

  const lastMsg = saved.chatData[saved.chatData.length - 1];
  if (lastMsg?.type === "share" && lastMsg.direction === "from-other") {
    setButtonState("view");
  } else if (lastMsg?.type === "request" && lastMsg.direction === "from-user") {
    setButtonState("requested");
  } else {
    setButtonState("request");
  }
}, [user]);

  useEffect(() => clearTimers, []);

  // 🔄 Keep chat scrolled to bottom on new messages
  const handleScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);
    setIsAtBottom(distanceFromBottom < 50);
  };

  useEffect(() => {
    if (isAtBottom)
      requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
  }, [chatData]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.surface1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
  >
    <View style={styles.root}>
  {/* Header */}
  <BlurView intensity={40} tint="dark" style={styles.topBlur}>
    <View style={styles.topRow}>
      <View style={{ flex: 1 }} />
      {!user.isBot && (
        <TouchableOpacity onPress={() => setShowActionsModal(true)}>
          <Image source={moreIcon} style={styles.moreIcon} />
        </TouchableOpacity>
      )}
    </View>

    {/* 🧠 Chat top bar: back + name + Rezults button */}
    <View style={styles.userRow}>
      <TouchableOpacity
        style={styles.backArea}
        onPress={() => {
          navigation.goBack();
          clearTimers(); // stop demo timers safely
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image source={arrowLeft} style={styles.backIcon} />
        <Image source={user.image || fallbackAvatar} style={styles.avatar} />
      </TouchableOpacity>

      <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
        {user.name}
      </Text>

      {/* 🟣 Unified button state logic */}
      {buttonState === "request" && (
        <RezultsActionButton
          status="request"
          onPress={() => {
            console.log("🟣 Request pressed for", user.name);
            setButtonState("requested");
            startRequestFlow(user);
          }}
        />
      )}

      {buttonState === "requested" && (
        <RezultsActionButton status="requested" disabled opacity={0.7} />
      )}

      {buttonState === "view" && (
        <RezultsActionButton
          status="view"
          onPress={() => {
            navigation.navigate("Rezults", {
              username: user.name,
              avatar: user.image || fallbackAvatar,
              realName: user.realName || user.name,
              providerName:
                user.name === "Melany"
                  ? "Planned Parenthood"
                  : "Sexual Health London",
              testDate: "20 Oct 2025",
              showExpand: true,
            });
          }}
        />
      )}
    </View>
  </BlurView>

  {/* Messages list */}
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <FlatList
      ref={flatListRef}
      data={chatData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) =>
        item.type === "typing" ? (
          <View style={styles.typingBubble}>
            <TypingDots />
          </View>
        ) : (
          <MessageRow item={item} user={user} />
        )
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingTop: 180,
        paddingBottom: 140,
      }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onContentSizeChange={() => {
        if (isAtBottom) {
          requestAnimationFrame(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          });
        }
      }}
    />
  </TouchableWithoutFeedback>

      {/* Footer */}
  {!isBlocked && (
    <BlurView
      intensity={40}
      tint="dark"
      style={styles.footerBlur}
      onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
    >
      {buttonState === "view" ? (
        // 🟣 Stop Sharing
        <RezultsActionButton
          status="stop"
          onPress={() => {
            setButtonState("request"); // reset to default state
            setChatData((prev) => [
              ...prev,
              {
                id: `${Date.now()}-stop`,
                type: "stop-share",
                direction: "from-user",
                username: currentUser.name,
                avatar: currentUser.avatar,
                timestamp: getLocalTime(),
              },
            ]);
            safeEmit("chat-updated");
          }}
        />
      ) : (
        // 💬 Share Rezults or add a note
        <View style={styles.footer}>
          <TextInput
            ref={inputRef}
            placeholder="Add note..."
            placeholderTextColor={colors.foreground.muted}
            value={message}
            onChangeText={setMessage}
            style={styles.input}
            onFocus={() => {
              if (!rezultsCache.hasRezults) {
                inputRef.current?.blur();
                setShowNoRezultsModal(true);
              }
            }}
          />

          <ZultsButton
            label="Share Rezults"
            type={rezultsCache.hasRezults ? "brand" : "secondary"}
            size="medium"
            pill
            fullWidth={false}
            onPress={() => {
              if (!rezultsCache.hasRezults) {
                setShowNoRezultsModal(true);
                return;
              }

              console.log("💜 User pressed 'Share Rezults'");

              setButtonState("view");

              setChatData((prev) => [
                ...prev,
                {
                  id: `${Date.now()}-share`,
                  type: "share",
                  direction: "from-user",
                  username: currentUser.name,
                  avatar: currentUser.avatar,
                  timestamp: getLocalTime(),
                },
                ...(message.trim().length > 0
                  ? [
                      {
                        id: `${Date.now()}-note`,
                        type: "text",
                        direction: "from-user",
                        username: currentUser.name,
                        avatar: currentUser.avatar,
                        text: message.trim(),
                        timestamp: getLocalTime(),
                      },
                    ]
                  : []),
              ]);

              setMessage("");
              safeEmit("chat-updated");

              handleUserShare();
            }}
          />
        </View>
      )}
    </BlurView>
  )}


{/* Block / Unblock Modal */}
<ActionModal
  visible={showActionsModal}
  onClose={() => setShowActionsModal(false)}
  title={isBlocked ? "Unblock user?" : "Block user?"}
  description={
    isBlocked
      ? "Unblock this user to continue chatting and sharing Rezults."
      : "This user won’t be able to send their Rezults or request to see yours. They won’t be notified if you block them."
  }
  actions={[
    {
      label: isBlocked ? "Unblock" : "Block",
      onPress: () => {
        const key = user.id || `user-${user.name}`;

        if (isBlocked) {
          // ✅ Unblock
          setIsBlocked(false);
          setChatData([]);
          updateUserState(key, { blocked: false });
        } else {
          // ✅ Block
          setIsBlocked(true);
          setChatData([]);
          updateUserState(key, { blocked: true });
        }

        safeEmit("chat-updated");
      },
    },
  ]}
/>

  {/* No Rezults Modal */}
  <NoRezultsModal
    visible={showNoRezultsModal}
    onClose={() => setShowNoRezultsModal(false)}
  />
</View>
</KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.surface1 },
  topBlur: {
    paddingTop: Platform.OS === "ios" ? 72 : 56,
    paddingBottom: 20,
    paddingHorizontal: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 12,
  },
  moreIcon: { width: 24, height: 24, tintColor: colors.foreground.default },
  userRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backIcon: { width: 24, height: 24, tintColor: colors.foreground.default },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  username: { ...typography.bodyMedium, color: colors.foreground.default, flex: 1, includeFontPadding: false },
  typingBubble: {
    backgroundColor: colors.background.surface2,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    margin: 8,
  },
  footerBlur: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "transparent",
  },
  footer: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderColor: colors.foreground.muted,
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: colors.background.surface2,
    color: colors.foreground.default,
    ...typography.chatMessage,
  },
  sendButton: {
    backgroundColor: colors.brand.purple1,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  backArea: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 8,
  paddingRight: 12, // ✅ adds tappable area behind avatar
},
  sendIcon: { width: 20, height: 20, tintColor: colors.neutral[0] },
  blockOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  blockedText: { ...typography.bodyMedium, color: colors.foreground.soft },
  text_small: { ...typography.buttonSmallRegular },
});