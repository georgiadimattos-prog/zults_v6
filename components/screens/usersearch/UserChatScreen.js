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
import { colors, typography } from "../../../theme";
import RezultActionBubble from "../../ui/RezultActionBubble";
import ActionModal from "../../ui/ActionModal";
import NoRezultsModal from "../../ui/NoRezultsModal";
import arrowLeft from "../../../assets/images/navbar-arrow.png";
import moreIcon from "../../../assets/images/navbar-dots.png";
import fallbackAvatar from "../../../assets/images/melany.png";
import { rezultsCache } from "../../../cache/rezultsCache";
import { chatCache } from "../../../cache/chatCache"; // ⬅️ remove setActiveChat/clearActiveChat
import { useDemoChat } from "../../ui/useDemoChat";
import ZultsButton from "../../ui/ZultsButton";
import RezultsActionButton from "../../ui/RezultsActionButton";
import { DeviceEventEmitter } from "react-native";
import ChatTopActions from "../../ui/ChatTopActions";
import { useFocusEffect } from "@react-navigation/native";

import { currentUser } from "../../../config/session";


// Simple local time formatter
const getLocalTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
      Animated.parallel([
        animate(dot1, 0),
        animate(dot2, 150),
        animate(dot3, 300),
      ])
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

const MessageRow = memo(function MessageRow({ item, user, onDoubleLike }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleDouble = () => {
    const didToggle = onDoubleLike?.(item);
    if (didToggle) {
      scale.setValue(0.5);
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }).start();
    }
  };

  return (
  <TapGestureHandler numberOfTaps={2} onActivated={handleDouble}>
    <View
  style={{
    alignSelf: item.direction === "from-user" ? "flex-end" : "flex-start",
    maxWidth: "85%",
    flexShrink: 1,
    flexDirection: "row",   // ✅ allows wrapping
    flexWrap: "wrap",
    justifyContent: "flex-start", // ✅ keep text left-aligned
    alignItems: "flex-start",     // ✅ bubble grows downward, not centered
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
  chatUserId={user.id}   // ✅ tell each bubble whose chatroom it belongs to
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

  const { seedDemoChat, handleUserMessage } = useDemoChat();

  const inputRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const user = route.params?.user || { name: "Unknown", image: fallbackAvatar };
  const isDemoChat = user.isBot === true;

  const [message, setMessage] = useState("");
  const [chatState, setChatState] = useState({ hasShared: false, hasRequested: false });
  const [otherUserState, setOtherUserState] = useState({ hasShared: false, hasRequested: false });
  const [chatData, setChatData] = useState([]);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showNoRezultsModal, setShowNoRezultsModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const [highlightTopCTA, setHighlightTopCTA] = useState(false);

  // 👇 pulse animation for the demo "View Rezults" button
const pulseAnim = useRef(new Animated.Value(1)).current;
useEffect(() => {
  if (highlightTopCTA) {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop(); // cleanup
  } else {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  }
}, [highlightTopCTA]);

const flatListRef = useRef(null);
const typingIdRef = useRef(null);
const requestTimers = useRef([]);
const shareTimers = useRef([]);

// keep refs in sync with latest state
const chatStateRef = useRef(chatState);
const otherUserStateRef = useRef(otherUserState);
useEffect(() => { chatStateRef.current = chatState; }, [chatState]);
useEffect(() => { otherUserStateRef.current = otherUserState; }, [otherUserState]);

const handleScroll = (e) => {
  const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
  const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
  setIsAtBottom(distanceFromBottom < 50);
};

const hasSeededRef = useRef(false);

// Mark active chat (non-enumerable so it won't appear in loops)
useEffect(() => {
  const key = user.id || `user-${user.name}`;
  try {
    if (Object.prototype.propertyIsEnumerable.call(chatCache, "__activeKey")) {
      delete chatCache.__activeKey;
    }
    Object.defineProperty(chatCache, "__activeKey", {
      value: key,
      configurable: true,
      enumerable: false,
      writable: true,
    });
  } catch {
    chatCache.__activeKey = key;
  }

  // cleanup on unmount → reset so View Rezults doesn’t persist
  return () => {
    try {
      Object.defineProperty(chatCache, "__activeKey", {
        value: null,
        configurable: true,
        enumerable: false,
        writable: true,
      });
    } catch {
      chatCache.__activeKey = null;
    }

    // ✅ reset other user state so button won’t linger
    setOtherUserState({ hasShared: false, hasRequested: false });
    setChatState({ hasShared: false, hasRequested: false });
    if (chatCache[key]) {
      chatCache[key].otherUserState = { hasShared: false, hasRequested: false };
      chatCache[key].chatState = { hasShared: false, hasRequested: false };
    }
  };
}, [user]);

  // restore / seed flow + clear unread only when opening chat
useEffect(() => {
  const key = user.id || `user-${user.name}`;

  if (
    chatCache[key] &&
    Array.isArray(chatCache[key].chatData) &&
    chatCache[key].chatData.length > 0
  ) {
    const saved = chatCache[key];
    setChatData(saved.chatData || []);
    setChatState(saved.chatState || { hasShared: false, hasRequested: false });
    setOtherUserState(saved.otherUserState || { hasShared: false, hasRequested: false });
    if (saved.blocked) setIsBlocked(true);

    // 💜 restore global sharing state if active
if (rezultsCache.isSharing) {
  setChatState((prev) => ({ ...prev, hasShared: true }));
}

    chatCache[key].hasUnread = false;
    DeviceEventEmitter.emit("chat-updated");

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 0);
    return;
  }

  if (user.isBot && !hasSeededRef.current) {
    hasSeededRef.current = true;
    setChatData([]);
    seedDemoChat(user, setChatData, flatListRef, setHighlightTopCTA);

    if (chatCache[key]) {
      chatCache[key].hasUnread = false;
      DeviceEventEmitter.emit("chat-updated");
    }
  }

// 🕓 Fast-forward demo flow if a request started while user was away
  if (
    user &&
    user.id &&
    chatCache[user.id] &&
    chatCache[user.id].lastRequestStarted
  ) {
    const elapsed = (Date.now() - chatCache[user.id].lastRequestStarted) / 1000; // seconds

// step 0: if user came back within 2–5 s, show initial typing
    if (
      elapsed > 2 &&
      elapsed < 5 &&
      !chatCache[user.id].chatData?.some(
        (m) => m.type === "typing"
      )
    ) {
      setChatData((prev) => [
        ...prev,
        {
          id: `typing-${Date.now()}`,
          type: "typing",
          direction: "from-other",
          username: user.name,
          avatar: user.image || fallbackAvatar,
        },
      ]);
    }

    // step 1: if >5s, ensure "Request from DemoX"
    if (elapsed > 5 && !chatCache[user.id].chatData?.some(m => m.type === "request" && m.direction === "from-other")) {
      setChatData(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "request",
          direction: "from-other",
          username: user.name,
          avatar: user.image || fallbackAvatar,
          timestamp: getLocalTime(),
        },
      ]);
      chatCache[user.id].otherUserState = { hasRequested: true, hasShared: false };
    }

    // step 2: if >10s, ensure "share"
    if (elapsed > 10 && !chatCache[user.id].chatData?.some(m => m.type === "share" && m.direction === "from-other")) {
      setChatData(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "share",
          direction: "from-other",
          username: user.name,
          avatar: user.image || fallbackAvatar,
          timestamp: getLocalTime(),
        },
      ]);
      chatCache[user.id].otherUserState = { hasRequested: false, hasShared: true };
    }

    // step 3: if >15s, ensure "stop-share"
    if (elapsed > 15 && !chatCache[user.id].chatData?.some(m => m.type === "stop-share" && m.direction === "from-other")) {
      setChatData(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "stop-share",
          direction: "from-other",
          username: user.name,
          avatar: user.image || fallbackAvatar,
          timestamp: getLocalTime(),
        },
      ]);
      chatCache[user.id].otherUserState = { hasRequested: false, hasShared: false };
      chatCache[user.id].chatState = { hasRequested: false, hasShared: false };
      delete chatCache[user.id].lastRequestStarted; // clear flag once complete
    }
  }


}, [user]);

  // persist (skip chatData for Rezy so Activities tagline stays static)
useEffect(() => {
  const key = user.id || `user-${user.name}`;
  const hasAction = chatData.length > 0;
  if (!hasAction && !isBlocked) return;

  if (user.isBot && user.id === "zults-demo") {
  chatCache[key] = {
    ...(chatCache[key] || {}),
    user: { id: user.id, name: user.name, image: user.image, isBot: true },
    chatState,
    otherUserState,
    blocked: isBlocked,
    hasViewedDemoRezults: chatCache[key]?.hasViewedDemoRezults || false, // ✅ persist flag
  };
  return;
}

  chatCache[key] = {
    ...(chatCache[key] || {}),
    user: { id: user.id, name: user.name, image: user.image },
    chatData,
    chatState,
    otherUserState,
    blocked: isBlocked,
  };
}, [chatData, chatState, otherUserState, user, isBlocked]);

// 👇 put this AFTER the above useEffect, not inside it
useFocusEffect(
  React.useCallback(() => {
    if (user.isBot && user.id === "zults-demo") {
      setOtherUserState({ hasShared: false, hasRequested: false });
      setChatState({ hasShared: false, hasRequested: false });

      const key = user.id || `user-${user.name}`;
      if (chatCache[key]) {
        chatCache[key].otherUserState = { hasShared: false, hasRequested: false };
        chatCache[key].chatState = { hasShared: false, hasRequested: false };
      }
    }
  }, [user])
);

  const addTyping = () => {
    if (typingIdRef.current) return;
    typingIdRef.current = `typing-${Date.now()}`;
    setChatData((prev) => [
      ...prev,
      {
        id: typingIdRef.current,
        type: "typing",
        direction: "from-other",
        username: user.name,
        avatar: user.image || fallbackAvatar,
      },
    ]);
  };

  const removeTyping = () => {
    if (typingIdRef.current) {
      setChatData((prev) => prev.filter((m) => m.id !== typingIdRef.current));
      typingIdRef.current = null;
    }
  };

// 🧠 Helper: compute which top CTA button should display
const getCurrentCTA = () => {
  if (otherUserState.hasShared) return "view";
  if (chatState.hasShared) return "stop";
  if (chatState.hasRequested) return "requested";
  return "request";
};

// ----- request/share demo flows -----
const startRequestFlow = () => {
  console.log("🚀 startRequestFlow entered for", user.id);

  if (user.id === "zults-demo") {
    console.log("⏭️ Skipping flow for Rezy");
    return;
  }

  console.log("▶️ Starting request flow for", user.id);

  // 💜 Read Rezults state once but never modify it
  const userHasRezults = rezultsCache.hasRezults;

  // 🕒 store when this demo request began
  if (user && user.id && chatCache[user.id]) {
    chatCache[user.id].lastRequestStarted = Date.now();
  }

// 💜 startRequestFlow() — updated timing & logic
requestTimers.current.forEach((t) => clearTimeout(t));
requestTimers.current = [];

// After 3 s → typing indicator
requestTimers.current.push(
  setTimeout(() => {
    console.log("💬 Bot typing started:", user.name);
    addTyping();
  }, 3000)
);

// After 7 s → Melany sends a visible "Request from Melany" bubble
requestTimers.current.push(
  setTimeout(() => {
    removeTyping();
    console.log("🟢 Incoming request bubble from", user.name);

    setOtherUserState({ hasRequested: true, hasShared: false });

    // 🟣 create the incoming request message
    setChatData((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "request",
        direction: "from-other",
        username: user.name || "Demo User",
        avatar: user.image || fallbackAvatar,
        timestamp: getLocalTime(),
      },
    ]);

    // 🔄 update cache + emit so Activities & Main refresh
    chatCache[user.id] = {
      ...(chatCache[user.id] || {}),
      user,
      chatData: [...(chatCache[user.id]?.chatData || []), ...chatData],
      hasUnread: true,
    };
    DeviceEventEmitter.emit("chat-updated");
  }, 7000)
);

// After 12 s → Melany shares Rezults
requestTimers.current.push(
  setTimeout(() => {
    removeTyping();
    console.log("📤 Bot share bubble sent by", user.name);

    setOtherUserState({ hasRequested: false, hasShared: true });

// ✅ Force correct type for demo users and bots
const isDemoUser =
  user?.isBot === true ||
  ["demo1", "demo2", "demo3", "demo4", "melany"].includes(
    user?.id?.toLowerCase?.() || ""
  );

const shareType = isDemoUser
  ? "share"
  : rezultsCache.hasRezults
  ? "share"
  : "note";

setChatData((prev) => [
  ...prev,
  {
    id: Date.now().toString(),
    type: shareType,
    direction: "from-other",
    username: user.name || "Demo User",
    avatar: user.image || fallbackAvatar,
    timestamp: getLocalTime(),
    // 🧹 remove text override so RezultActionBubble handles the copy
  },
]);

    chatCache[user.id] = {
      ...(chatCache[user.id] || {}),
      user,
      chatData: [...(chatCache[user.id]?.chatData || []), ...chatData],
      hasUnread: true,
    };
    DeviceEventEmitter.emit("chat-updated");

    // After 17 s → stop-share
    requestTimers.current.push(
      setTimeout(() => {
        console.log("⛔ Bot stop-share bubble sent by", user.name);

        setOtherUserState({ hasShared: false, hasRequested: false });
        setChatState({ hasShared: false, hasRequested: false });

        setChatData((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: "stop-share",
            direction: "from-other",
            username: user.name || "Demo User",
            avatar: user.image || fallbackAvatar,
            timestamp: getLocalTime(),
          },
        ]);

        chatCache[user.id] = {
          ...(chatCache[user.id] || {}),
          user,
          chatData: [...(chatCache[user.id]?.chatData || []), ...chatData],
          hasUnread: true,
        };
        DeviceEventEmitter.emit("chat-updated");
      }, 17000)
    );
  }, 12000)
);
};




  const startShareFlow = () => {
    shareTimers.current.forEach((t) => clearTimeout(t));
    shareTimers.current = [];

    shareTimers.current.push(setTimeout(() => addTyping(), 3000));
    shareTimers.current.push(
      setTimeout(() => {
        removeTyping();
        setOtherUserState({ hasRequested: false, hasShared: true });

        setChatData((prev) => {
          const updated = [
            ...prev,
            {
              id: Date.now().toString(),
              type: "share",
              direction: "from-other",
              username: user.name,
              avatar: user.image || fallbackAvatar,
              timestamp: getLocalTime(),
            },
          ];
          chatCache[user.id] = {
            ...(chatCache[user.id] || {}),
            user,
            chatData: updated,
            hasUnread: true,
          };
          setTimeout(() => DeviceEventEmitter.emit("chat-updated"), 0);
          return updated;
        });

        shareTimers.current.push(
          setTimeout(() => {
            setOtherUserState({ hasShared: false, hasRequested: false });
            setChatState({
              hasShared: chatStateRef.current.hasShared,
              hasRequested: false,
            });

            setChatData((prev) => {
              const updated = [
                ...prev,
                {
                  id: Date.now().toString(),
                  type: "stop-share",
                  direction: "from-other",
                  username: user.name,
                  avatar: user.image || fallbackAvatar,
                  timestamp: getLocalTime(),
                },
              ];
              chatCache[user.id] = {
                ...(chatCache[user.id] || {}),
                user,
                chatData: updated,
                hasUnread: true,
              };
              setTimeout(() => DeviceEventEmitter.emit("chat-updated"), 0);
              return updated;
            });
          }, 15000)
        );
      }, 10000)
    );
  };

  const handleDoubleLike = (item) => {
    const allowed = item.direction === "from-other" && (item.type === "share" || item.type === "request");
    if (!allowed) return false;
    setChatData((prev) => prev.map((m) => (m.id === item.id ? { ...m, liked: !m.liked } : m)));
    return true;
  };

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
          {!isDemoChat && (
            <TouchableOpacity onPress={() => setShowActionsModal(true)}>
              <Image source={moreIcon} style={styles.moreIcon} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.userRow}>
          <TouchableOpacity
            onPress={() => {
              if (route.params?.from === "Activities") {
                navigation.goBack();
              } else {
                const hasAction = chatData.some(
                  (msg) =>
                    msg.type === "request" ||
                    msg.type === "share" ||
                    msg.type === "stop-share"
                );
                if (hasAction) {
                  navigation.navigate("MainScreen");
                } else {
                  navigation.goBack();
                }
              }
            }}
          >
            <Image source={arrowLeft} style={styles.backIcon} />
          </TouchableOpacity>

          <Image source={user.image || fallbackAvatar} style={styles.avatar} />
          <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
            {user.name}
          </Text>

          {!isBlocked && (
  (isDemoChat && user.id === "zults-demo") ? (
    highlightTopCTA && !chatCache[user.id]?.hasViewedDemoRezults ? (
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <RezultsActionButton
          status="view"
          onPress={() => {
            setHighlightTopCTA(false);
            setOtherUserState({ hasShared: false, hasRequested: false });
            const key = user.id || `user-${user.name}`;
            if (chatCache[key]) {
              chatCache[key].hasViewedDemoRezults = true;
            }
            navigation.navigate("RezultsTooltipDemo");
          }}
        />
      </Animated.View>
    ) : null
  ) : otherUserState.hasShared ? (
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
  ) : chatState.hasRequested ? (
    <RezultsActionButton status="requested" />
  ) : (
    <RezultsActionButton
  status="request"
  onPress={() => {
    console.log("🟣 Request pressed for", user.id);

    setChatState({ ...chatState, hasRequested: true });
    setChatData((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "request",
        direction: "from-user",
        username: currentUser.name,   // Jonster
        avatar: currentUser.avatar,
        timestamp: getLocalTime(),
      },
    ]);

    // ✅ Quick patch: trigger scripted flow for anyone that's not Rezy
    if (user.id !== "zults-demo") {
      console.log("▶️ Triggering startRequestFlow for", user.id);
      startRequestFlow();
    }
  }}
/>
  )
)}
</View>
</BlurView>

      {/* Messages */}
      {isBlocked ? (
        <View style={styles.blockOverlay}>
          <Text style={styles.blockedText}>This user is blocked</Text>
        </View>
      ) : (
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
    <MessageRow item={item} user={user} onDoubleLike={handleDoubleLike} /> // ✅ pass user down
  )
}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              paddingHorizontal: 8,
              paddingTop: 180,
            }}
            ListFooterComponent={
              isDemoChat ? (
                <View style={{ height: footerHeight + 50 }} />
              ) : (
                <View style={{ height: 140 }} />
              )
            }
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
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
      )}


      {/* Footer */}
      {!isBlocked && (
        <BlurView
          intensity={40}
          tint="dark"
          style={styles.footerBlur}
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
        >
          {isDemoChat ? (
            <View style={styles.footer}>
              <TextInput
                placeholder="Ask me..."
                placeholderTextColor={colors.foreground.muted}
                value={message}
                onChangeText={setMessage}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => {
                  if (!message.trim()) return;
                  const userMsg = {
                    id: Date.now().toString(),
                    type: "text",
                    direction: "from-user",
                    username: currentUser.name,
                    avatar: currentUser.avatar,
                    text: message,
                    timestamp: getLocalTime(),
                  };
                  setChatData((prev) => [...prev, userMsg]);
                  setMessage("");
                  if (isDemoChat) {
                    handleUserMessage(
                      user,
                      setChatData,
                      flatListRef,
                      message
                    );
                  }
                }}
              >
                <Image
                  source={require("../../../assets/images/send-arrow.png")}
                  style={styles.sendIcon}
                />
              </TouchableOpacity>
            </View>
          ) : chatState.hasShared ? (
            <RezultsActionButton
              status="stop"
              onPress={() => {
                setChatState((prev) => ({ ...prev, hasShared: false }));
                rezultsCache.isSharing = false; // 💜 persist global stop state
                setChatData((prev) => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    type: "stop-share",
                    direction: "from-user",
                    username: currentUser.name,
                    avatar: currentUser.avatar,
                    timestamp: getLocalTime(),
                  },
                ]);
                shareTimers.current.forEach((t) => clearTimeout(t));
                requestTimers.current.forEach((t) => clearTimeout(t));
                shareTimers.current = [];
                requestTimers.current = [];
                removeTyping();
              }}
            />
          ) : (
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
                  if (rezultsCache.hasRezults) {
                    setChatState({ ...chatState, hasShared: true });
                    const shareMsg = {
                      id: Date.now().toString(),
                      type: "share",
                      direction: "from-user",
                      username: currentUser.name,
                      avatar: currentUser.avatar,
                      timestamp: getLocalTime(),
                    };

                    // 💜 persist global share state so it survives navigation
                    rezultsCache.isSharing = true;
                    
                    const noteMsg =
                      message.trim().length > 0
                        ? {
                            id: (Date.now() + 1).toString(),
                            type: "text",
                            direction: "from-user",
                            username: currentUser.name,
                            avatar: currentUser.avatar,
                            text: message,
                            timestamp: getLocalTime(),
                          }
                        : null;
                    setChatData((prev) => [
                      ...prev,
                      shareMsg,
                      ...(noteMsg ? [noteMsg] : []),
                    ]);
                    DeviceEventEmitter.emit("chat-updated"); // 💜 notify main screen
                    setMessage("");
                    startShareFlow();
                  } else {
                    setShowNoRezultsModal(true);
                  }
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
                setIsBlocked(false);
                setChatData([]);
                setChatState({ hasShared: false, hasRequested: false });
                setOtherUserState({ hasShared: false, hasRequested: false });
                if (chatCache[key]) chatCache[key].blocked = false;
              } else {
                setIsBlocked(true);
                setChatData([]);
                if (chatCache[key]) chatCache[key].blocked = true;
              }
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
  backIcon: { width: 28, height: 28, tintColor: colors.foreground.default },
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
  sendIcon: { width: 20, height: 20, tintColor: colors.neutral[0] },
  blockOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  blockedText: { ...typography.bodyMedium, color: colors.foreground.soft },
  text_small: { ...typography.buttonSmallRegular },
});