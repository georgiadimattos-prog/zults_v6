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
import { chatCache } from "../../../cache/chatCache";
import { useDemoChat } from "../../ui/useDemoChat";
import ZultsButton from "../../ui/ZultsButton";
import RezultsActionButton from "../../ui/RezultsActionButton";

const TomasAvatar = require("../../../assets/images/tomas.png");

function TypingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  const animate = (dot, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: true }),
      ])
    ).start();
  };

  useEffect(() => {
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={{ flexDirection: "row", padding: 2 }}>
      <Animated.Text style={{ opacity: dot1, fontSize: 18, marginHorizontal: 2 }}>•</Animated.Text>
      <Animated.Text style={{ opacity: dot2, fontSize: 18, marginHorizontal: 2 }}>•</Animated.Text>
      <Animated.Text style={{ opacity: dot3, fontSize: 18, marginHorizontal: 2 }}>•</Animated.Text>
    </View>
  );
}

const MessageRow = memo(function MessageRow({ item, onDoubleLike }) {
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
      <View style={{ alignSelf: item.direction === "from-user" ? "flex-end" : "flex-start" }}>
        <View style={{ position: "relative" }}>
          <RezultActionBubble
            type={item.type}
            direction={item.direction}
            username={item.username}
            avatar={item.avatar}
            timestamp={item.timestamp}
            text={item.text || ""}
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

  const { seedDemoChat } = useDemoChat();

  const inputRef = useRef(null);

  const [footerHeight, setFooterHeight] = useState(0);

  const currentUser = { name: "TomasB.", avatar: TomasAvatar };
  const user = route.params?.user || { name: "Unknown", image: fallbackAvatar };
  const isDemoChat = user.isBot === true; // ✅ detect via flag, not id

  const [message, setMessage] = useState("");
  const [chatState, setChatState] = useState({ hasShared: false, hasRequested: false });
  const [otherUserState, setOtherUserState] = useState({ hasShared: false, hasRequested: false });
  const [chatData, setChatData] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showNoRezultsModal, setShowNoRezultsModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const flatListRef = useRef(null);
  const typingIdRef = useRef(null);
  const requestTimers = useRef([]);
  const shareTimers = useRef([]);

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

// restore from cache or seed demo bot
useEffect(() => {
  const key = user.id || user.name || "default";

  // restore saved history if available
  if (chatCache[key] && chatCache[key].chatData?.length > 0) {
    const saved = chatCache[key];
    setChatData(saved.chatData || []);
    setChatState(saved.chatState || { hasShared: false, hasRequested: false });
    setOtherUserState(saved.otherUserState || { hasShared: false, hasRequested: false });
    if (saved.blocked) setIsBlocked(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 0);
    return;
  }

  // 🟣 seed welcome flow when first opening Zults Bot
  if (user.isBot && !hasSeededRef.current) {
    hasSeededRef.current = true;
    setChatData([]); // clear any stale cache
    seedDemoChat(user, setChatData, flatListRef);
  }
}, [user]);

  // persist to cache
  useEffect(() => {
    const key = user.id || user.name || "default";
    const hasAction = chatData.length > 0;
    if (!hasAction && !isBlocked) return;

    chatCache[key] = {
      ...(chatCache[key] || {}),
      user: { id: user.id, name: user.name, image: user.image },
      chatData,
      chatState,
      otherUserState,
      blocked: isBlocked,
    };
  }, [chatData, chatState, otherUserState, user, isBlocked]);

  const addTyping = () => {
    if (typingIdRef.current) return;
    typingIdRef.current = `typing-${Date.now()}`;
    setChatData((prev) => [...prev, { id: typingIdRef.current, type: "typing", direction: "from-other", username: user.name, avatar: user.image || fallbackAvatar }]);
  };

  const removeTyping = () => {
    if (typingIdRef.current) {
      setChatData((prev) => prev.filter((m) => m.id !== typingIdRef.current));
      typingIdRef.current = null;
    }
  };

  // 🔄 request/share flows restored
  const startRequestFlow = () => {
    requestTimers.current.forEach((t) => clearTimeout(t));
    requestTimers.current = [];

    requestTimers.current.push(setTimeout(() => addTyping(), 3000));
    requestTimers.current.push(setTimeout(() => {
      if (chatStateRef.current.hasShared) { removeTyping(); return; }
      removeTyping();
      setOtherUserState({ hasRequested: true, hasShared: false });
      setChatData((prev) => [...prev, { id: Date.now().toString(), type: "request", direction: "from-other", username: user.name, avatar: user.image || fallbackAvatar, timestamp: "10:07AM" }]);
    }, 5000));

    requestTimers.current.push(setTimeout(() => {
      if (chatStateRef.current.hasShared) { removeTyping(); return; }
      addTyping();
      requestTimers.current.push(setTimeout(() => {
        if (chatStateRef.current.hasShared) { removeTyping(); return; }
        removeTyping();
        setOtherUserState({ hasRequested: false, hasShared: true });
        setChatData((prev) => [...prev, { id: Date.now().toString(), type: "share", direction: "from-other", username: user.name, avatar: user.image || fallbackAvatar, timestamp: "10:12AM" }]);
        requestTimers.current.push(setTimeout(() => {
          setOtherUserState({ hasShared: false, hasRequested: false });
          setChatState({ hasShared: chatStateRef.current.hasShared, hasRequested: false });
          setChatData((prev) => [...prev, { id: Date.now().toString(), type: "stop-share", direction: "from-other", username: user.name, avatar: user.image || fallbackAvatar, timestamp: "10:27AM" }]);
        }, 15000));
      }, 2000));
    }, 10000));
  };

  const startShareFlow = () => {
    shareTimers.current.forEach((t) => clearTimeout(t));
    shareTimers.current = [];

    shareTimers.current.push(setTimeout(() => addTyping(), 3000));
    shareTimers.current.push(setTimeout(() => {
      removeTyping();
      setOtherUserState({ hasRequested: false, hasShared: true });
      setChatData((prev) => [...prev, { id: Date.now().toString(), type: "share", direction: "from-other", username: user.name, avatar: user.image || fallbackAvatar, timestamp: "10:12AM" }]);
      shareTimers.current.push(setTimeout(() => {
        setOtherUserState({ hasShared: false, hasRequested: false });
        setChatState({ hasShared: chatStateRef.current.hasShared, hasRequested: false });
        setChatData((prev) => [...prev, { id: Date.now().toString(), type: "stop-share", direction: "from-other", username: user.name, avatar: user.image || fallbackAvatar, timestamp: "10:27AM" }]);
      }, 15000));
    }, 10000));
  };

  const handleDoubleLike = (item) => {
    const allowed = item.direction === "from-other" && (item.type === "share" || item.type === "request");
    if (!allowed) return false;
    setChatData((prev) => prev.map((m) => (m.id === item.id ? { ...m, liked: !m.liked } : m)));
    return true;
  };

  const renderMessage = ({ item }) =>
    item.type === "typing"
      ? <View style={styles.typingBubble}><TypingDots /></View>
      : <MessageRow item={item} onDoubleLike={handleDoubleLike} />;

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
    <Text style={styles.username}>{user.name}</Text>

    {!isBlocked && (
  isDemoChat ? (
    <ZultsButton
      label="View Rezults"
      type="brand"          // 👈 purple pill
      size="medium"
      pill
      fullWidth={false}
      onPress={() => {
        navigation.navigate("Rezults", {
          username: user.name,
          avatar: user.image || fallbackAvatar,
          realName: user.realName || user.name,
          providerName: "Sexual Health London",
          testDate: "25 Sep 2025",
          showExpand: true,
        });
      }}
    />
  ) : (
        // ✅ Real user chat cleaned with RezultsActionButton
        <RezultsActionButton
          status={
            otherUserState.hasShared
              ? "view"
              : chatState.hasRequested
              ? "requested"
              : "request"
          }
          onPress={() => {
            if (otherUserState.hasShared) {
              navigation.navigate("Rezults", {
                username: user.name,
                avatar: user.image || fallbackAvatar,
                realName: user.realName || user.name,
                providerName:
                  user.name === "Binkey"
                    ? "Planned Parenthood"
                    : "Sexual Health London",
                testDate: "25 Sep 2025",
                showExpand: true,
              });
            } else if (!chatState.hasRequested) {
              setChatState({ ...chatState, hasRequested: true });
              setChatData((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  type: "request",
                  direction: "from-user",
                  username: currentUser.name,
                  avatar: currentUser.avatar,
                  timestamp: "10:02AM",
                },
              ]);
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
  renderItem={renderMessage}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  contentInsetAdjustmentBehavior="automatic"
  contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 180 }}
  ListFooterComponent={
    isDemoChat
      ? <View style={{ height: footerHeight + 50 }} />
      : <View style={{ height: 140 }} />
  }
  ItemSeparatorComponent={() => <View style={{ height: 16 }} />}   // ✅ NEW
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
          timestamp: "Now",
        };
        setChatData((prev) => [...prev, userMsg]);
        setMessage("");

        // ✅ lighter reply for demo bot
        setTimeout(() => {
          const aiMsg = {
            id: Date.now().toString() + "-ai",
            type: "text",
            direction: "from-other",
            username: "Zults Bot",
            avatar: user.image,
            text: "Got it 👍 Ask me anything about Rezults or sexual health.",
            timestamp: "Now",
          };
          setChatData((prev) => [...prev, aiMsg]);
        }, 1200);
      }}
    >
      <Image source={require("../../../assets/images/send-arrow.png")} style={styles.sendIcon} />
    </TouchableOpacity>
  </View>
) : (
  chatState.hasShared ? (
    <RezultsActionButton
      status="stop"
      onPress={() => {
        setChatState((prev) => ({ ...prev, hasShared: false }));
        setChatData((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: "stop-share",
            direction: "from-user",
            username: currentUser.name,
            avatar: currentUser.avatar,
            timestamp: "Now",
          },
        ]);
        // clear timers
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
      inputRef.current?.blur();        // ✅ close keyboard instantly
      setShowNoRezultsModal(true);     // ✅ show modal only
    }
  }}
/>
  <ZultsButton
  label="Share Rezults"
  type={rezultsCache.hasRezults ? "brand" : "secondary"} // purple if can share, white otherwise
  size="medium"        // unified size
  pill
  fullWidth={false}
  onPress={() => {
    if (rezultsCache.hasRezults) {
      // ✅ share Rezults flow
      setChatState({ ...chatState, hasShared: true });

      const shareMsg = {
        id: Date.now().toString(),
        type: "share",
        direction: "from-user",
        username: currentUser.name,
        avatar: currentUser.avatar,
        timestamp: "Now",
      };

      const noteMsg =
        message.trim().length > 0
          ? {
              id: (Date.now() + 1).toString(),
              type: "text",
              direction: "from-user",
              username: currentUser.name,
              avatar: currentUser.avatar,
              text: message,      // 👈 note text from input
              timestamp: "Now",
            }
          : null;

      setChatData((prev) => [...prev, shareMsg, ...(noteMsg ? [noteMsg] : [])]);

      // clear the input after sending
      setMessage("");

      startShareFlow();
    } else {
      // ❌ no Rezults → open modal
      setShowNoRezultsModal(true);
    }
  }}
/>
 </View>
      )
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
                const key = user.name || "default";
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

  username: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    flex: 1,
  },

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

  // ✅ unified input style
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderColor: colors.foreground.muted,
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: colors.background.surface2,
    color: colors.foreground.default, // dark text
    ...typography.chatMessage,        // use chat font
  },

  // ✅ Circular chat footer send button
  sendButton: {
    backgroundColor: colors.brand.purple1,
    width: 38,           // match input height
    height: 38,
    borderRadius: 19,    // half of width/height
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  sendIcon: {
    width: 20,
    height: 20,
    tintColor: colors.neutral[0], // keep arrow white
  },

  stopButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: colors.brand.purple1,
    alignItems: "center",
  },

  stopButtonText: {
    ...typography.bodyMedium,
    color: colors.neutral[0],
    fontWeight: "600",
  },

  dateDivider: {
    alignSelf: "center",
    backgroundColor: colors.background.surface2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginVertical: 8,
  },

  dateText: {
    ...typography.captionSmallRegular,
    color: colors.foreground.muted,
  },

  blockOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  blockedText: {
    ...typography.bodyMedium,
    color: colors.foreground.soft,
  },

  text_small: {
    ...typography.buttonSmallRegular,
  },
});