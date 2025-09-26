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
  Modal,
  Platform,
  Keyboard,
  Animated,
  Easing,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { TapGestureHandler } from "react-native-gesture-handler"; // 👈 double-tap
import { colors, typography } from "../../../theme";
import RezultActionBubble from "../../ui/RezultActionBubble";
import ActionModal from "../../ui/ActionModal";
import NoRezultsModal from "../../ui/NoRezultsModal";
import arrowLeft from "../../../assets/images/navbar-arrow.png";
import moreIcon from "../../../assets/images/navbar-dots.png";
import fallbackAvatar from "../../../assets/images/melany.png";
import { rezultsCache } from "../../../cache/rezultsCache";
import { chatCache } from "../../../cache/chatCache";

const TomasAvatar = require("../../../assets/images/tomas.png");

function TypingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  const animate = (dot, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, { toValue: 1, duration: 300, delay, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: true, easing: Easing.linear }),
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

/** Row with double-tap like + persistent heart badge */
const MessageRow = memo(function MessageRow({ item, onDoubleLike }) {
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
      {/* 👇 outer wrapper ensures bubble doesn’t stretch full width */}
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

          {/* 👇 heart badge anchored to bubble */}
          {item.liked && (
            <Animated.View
              style={{
                position: "absolute",
                bottom: 27,
                right: 4, // 👈 closer so it hugs the bubble corner
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

  const [footerHeight, setFooterHeight] = useState(0); // 👈 default value

  const currentUser = { name: "TomasB.", avatar: TomasAvatar };
  const user = route.params?.user || { name: "Unknown", image: fallbackAvatar };

  const isDemoChat = user.id === "zults-demo";  // ✅ here

  const [message, setMessage] = useState("");
  const [chatState, setChatState] = useState({ hasShared: false, hasRequested: false });
  const [otherUserState, setOtherUserState] = useState({ hasShared: false, hasRequested: false });
  const [chatData, setChatData] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showNoRezultsModal, setShowNoRezultsModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const [isAtBottom, setIsAtBottom] = useState(true);

const handleScroll = (e) => {
  const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
  const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
  setIsAtBottom(distanceFromBottom < 50); // within 50px of bottom
};

  const flatListRef = useRef(null);
  const typingIdRef = useRef(null);
  const requestTimers = useRef([]);
  const shareTimers = useRef([]);

  const chatStateRef = useRef(chatState);
  const otherUserStateRef = useRef(otherUserState);
  useEffect(() => { chatStateRef.current = chatState; }, [chatState]);
  useEffect(() => { otherUserStateRef.current = otherUserState; }, [otherUserState]);

// restore from cache
useEffect(() => {
  // ✅ use user.id if available so demo is always keyed as "zults-demo"
  const key = user.id || user.name || "default";

  // 1. Restore if we already have chat in cache
  if (chatCache[key]) {
    const saved = chatCache[key];
    setChatData(saved.chatData || []);
    setChatState(saved.chatState || { hasShared: false, hasRequested: false });
    setOtherUserState(saved.otherUserState || { hasShared: false, hasRequested: false });
    if (saved.blocked) setIsBlocked(true);
    return; // ✅ stop here, no reseeding
  }

  // 2. Seed demo chat only once if nothing is cached
  if (user.id === "zults-demo") {
    const demoMessages = [
      {
        id: "demo-msg-1",
        type: "text",
        direction: "from-other",
        username: "Zults AI",
        avatar: user.image,
        text: "Hi there, I’m your Rezults Assistant 🤖. Ask me anything about sexual health!",
        timestamp: "Now",
      },
      {
        id: "demo-msg-2",
        type: "text",
        direction: "from-other",
        username: "Zults (Demo)",
        avatar: user.image,
        text:
          "Hi there, this is a demo Rezults so you can see how they appear in the app. 💜 We hope you enjoy using Zults and make the most of it to stay safe, healthy, and confident! ✨",
        timestamp: "Now",
      },
    ];

    setChatData(demoMessages);
    setOtherUserState({ hasShared: false, hasRequested: false });

    // ✅ persist into cache immediately so Activities sees it
    chatCache[key] = {
      user: { id: user.id, name: user.name, image: user.image },
      chatData: demoMessages,
      chatState: { hasShared: false, hasRequested: false },
      otherUserState: { hasShared: false, hasRequested: false },
      blocked: false,
    };
  }
}, [user]);

// persist to cache
useEffect(() => {
  const key = user.id || user.name || "default";

  // Only persist if there is something meaningful (actions/messages or blocked state)
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


  // keyboard listeners
  useEffect(() => {
    const showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e) => {
  const h = e?.endCoordinates?.height ?? 0;
  setKeyboardHeight(h);
  if (isAtBottom) {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  }
};
    const onHide = () => setKeyboardHeight(0);

    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      [...requestTimers.current, ...shareTimers.current].forEach((t) => clearTimeout(t));
      requestTimers.current = [];
      shareTimers.current = [];
    };
  }, []);

  // helper typing functions
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

  // flows
  const startRequestFlow = () => {
    requestTimers.current.forEach((t) => clearTimeout(t));
    requestTimers.current = [];

    requestTimers.current.push(setTimeout(() => addTyping(), 3000));
    requestTimers.current.push(setTimeout(() => {
      if (chatStateRef.current.hasShared) { removeTyping(); return; }
      removeTyping();
      setOtherUserState({ hasRequested: true, hasShared: false });
      setChatData((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "request", direction: "from-other", username: user.name, avatar: user.image || fallbackAvatar, timestamp: "10:07AM" },
      ]);
    }, 5000));

    requestTimers.current.push(setTimeout(() => {
      if (chatStateRef.current.hasShared) { removeTyping(); return; }
      addTyping();
      requestTimers.current.push(setTimeout(() => {
        if (chatStateRef.current.hasShared) { removeTyping(); return; }
        removeTyping();
        setOtherUserState({ hasRequested: false, hasShared: true });
        setChatData((prev) => [
          ...prev,
          { id: Date.now().toString(), type: "share", direction: "from-other", username: user.name, avatar: user.image || fallbackAvatar, timestamp: "10:12AM" },
        ]);
        requestTimers.current.push(setTimeout(() => {
          setOtherUserState({ hasShared: false, hasRequested: false });
          setChatState({ hasShared: chatStateRef.current.hasShared, hasRequested: false });
          setChatData((prev) => [
            ...prev,
            { id: Date.now().toString(), type: "stop-share", direction: "from-other", username: user.name, avatar: user.image || fallbackAvatar, timestamp: "10:27AM" },
          ]);
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
      setChatData((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "share", direction: "from-other", username: user.name, avatar: user.image || fallbackAvatar, timestamp: "10:12AM" },
      ]);
      shareTimers.current.push(setTimeout(() => {
        setOtherUserState({ hasShared: false, hasRequested: false });
        setChatState({ hasShared: chatStateRef.current.hasShared, hasRequested: false });
        setChatData((prev) => [
          ...prev,
          { id: Date.now().toString(), type: "stop-share", direction: "from-other", username: user.name, avatar: user.image || fallbackAvatar, timestamp: "10:27AM" },
        ]);
      }, 15000));
    }, 10000));
  };

  /** Toggle like on allowed messages and return true if toggled (to trigger burst) */
  const handleDoubleLike = (item) => {
    const allowed = (item.direction === "from-other") && (item.type === "share" || item.type === "request");
    if (!allowed) return false;
    setChatData((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, liked: !m.liked } : m))
    );
    return true;
  };

  const renderMessage = ({ item }) => (
    item.type === "typing"
      ? <View style={styles.typingBubble}><TypingDots /></View>
      : <MessageRow item={item} onDoubleLike={handleDoubleLike} />
  );

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={0} // ✅ matches header height
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
                  navigation.goBack(); // back to Activities cleanly
                } else {
                  const hasAction = chatData.some(
                    (msg) =>
                      msg.type === "request" ||
                      msg.type === "share" ||
                      msg.type === "stop-share"
                  );
                  if (hasAction) {
                    navigation.navigate("MainScreen"); // ✅ jump straight back to Main
                  } else {
                    navigation.goBack(); // ✅ normal back (to UserSearch → Main)
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
                // Demo chat → always View Rezults
                <TouchableOpacity
                  style={styles.rezultsButton}
                  onPress={() => {
                    navigation.navigate("Rezults", {
                      username: user.name,
                      avatar: user.image || fallbackAvatar,
                      realName: user.realName || user.name,
                      providerName: "Sexual Health London", // demo provider
                      testDate: "25 Sep 2025",              // demo date
                      showExpand: true,
                    });
                  }}
                >
                  <Text style={styles.rezultsButtonText}>View Rezults</Text>
                </TouchableOpacity>
              ) : (
                // Normal users → keep your existing logic
                <TouchableOpacity
                  style={[
                    styles.rezultsButton,
                    chatState.hasShared && styles.rezultsButtonActive,
                  ]}
                  disabled={chatState.hasRequested && !otherUserState.hasShared}
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
                      return;
                    }
                    if (!chatState.hasRequested) {
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
                >
                  <Text
                    style={[
                      styles.rezultsButtonText,
                      chatState.hasShared && styles.rezultsButtonTextActive,
                    ]}
                  >
                    {otherUserState.hasShared
                      ? "View Rezults"
                      : chatState.hasRequested
                      ? "Rezults Requested"
                      : "Request Rezults"}
                  </Text>
                </TouchableOpacity>
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
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingTop: 180,
      }}
      ListFooterComponent={<View style={{ height: footerHeight + 50 }} />}
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

      {/* Footer (emoji button removed) */}
{!isBlocked && (
 <BlurView
  intensity={40}
  tint="dark"
  style={styles.footerBlur}
  onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
>
    {isDemoChat ? (
      // Special footer for Zults (Demo) → AI chat
      <View style={styles.footer}>
        <TextInput
          placeholder="Ask me anything about sexual health..."
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

            // Fake AI reply
            setTimeout(() => {
              const aiMsg = {
                id: Date.now().toString() + "-ai",
                type: "text",
                direction: "from-other",
                username: "Zults AI",
                avatar: user.image,
                text: "I'm your Rezults Assistant 🤖. Ask me anything about sexual health!",
                timestamp: "Now",
              };
              setChatData((prev) => [...prev, aiMsg]);
            }, 1200);
          }}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    ) : chatState.hasShared ? (
      // Normal flow: Stop sharing Rezults
      <TouchableOpacity
        style={styles.stopButton}
        onPress={() => {
          setChatState({ ...chatState, hasShared: false });
          setChatData((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: "stop-share",
              direction: "from-user",
              username: currentUser.name,
              avatar: currentUser.avatar,
              timestamp: "10:06AM",
            },
          ]);
        }}
      >
        <Text style={styles.stopButtonText}>Stop Sharing Rezults</Text>
      </TouchableOpacity>
    ) : (
      // Normal flow: Share Rezults buttons
      <View style={styles.footer}>
        <TextInput
          placeholder="Add note to your Rezults..."
          placeholderTextColor={colors.foreground.muted}
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />
        {rezultsCache.hasRezults ? (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              setChatState({ ...chatState, hasShared: true });
              setChatData((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  type: "share",
                  direction: "from-user",
                  username: currentUser.name,
                  avatar: currentUser.avatar,
                  timestamp: "10:05AM",
                },
                ...(message
                  ? [
                      {
                        id: Date.now().toString() + "-note",
                        type: "text",
                        direction: "from-user",
                        username: currentUser.name,
                        avatar: currentUser.avatar,
                        text: message,
                        timestamp: "10:05AM",
                      },
                    ]
                  : []),
              ]);
              setMessage("");
              startShareFlow();
            }}
          >
            <Text style={styles.sendButtonText}>Share Rezults</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => setShowNoRezultsModal(true)}
          >
            <Text style={styles.sendButtonText}>Share Rezults</Text>
          </TouchableOpacity>
        )}
      </View>
    )}
  </BlurView>
)}


      {/* Block / Unblock Modal */}
<Modal
  visible={showActionsModal}
  transparent
  animationType="slide"
  onRequestClose={() => setShowActionsModal(false)}
>
  <TouchableWithoutFeedback onPress={() => setShowActionsModal(false)}>
    <View style={{ flex: 1 }}>
      {/* Background Blur */}
      <BlurView
        intensity={50}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: colors.background.surface2,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              paddingTop: 24,
              paddingHorizontal: 20,
              paddingBottom: 32,
            }}
          >
            {/* Title */}
            <Text
              style={{
                ...typography.title1Medium,
                color: colors.foreground.default,
                marginBottom: 12,
              }}
            >
              {isBlocked ? "Unblock user?" : "Block user?"}
            </Text>

            {/* Description */}
            <Text
              style={{
                ...typography.bodyRegular,
                color: colors.foreground.soft,
                marginBottom: 24,
              }}
            >
              {isBlocked
                ? "Unblock this user to continue chatting and sharing Rezults."
                : "This user won’t be able to send their Rezults or request to see yours. They won’t be notified if you block them."}
            </Text>

            {/* Primary Action */}
            <TouchableOpacity
              style={{
                width: "100%",
                height: 56,
                borderRadius: 16,
                backgroundColor: colors.neutral[0],
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                const key = user.name || "default";

                if (isBlocked) {
                  // ✅ Unblock
                  setIsBlocked(false);
                  setChatData([]);
                  setChatState({ hasShared: false, hasRequested: false });
                  setOtherUserState({ hasShared: false, hasRequested: false });

                  // persist unblock in chatCache
                  if (chatCache[key]) chatCache[key].blocked = false;
                } else {
                  // ✅ Block
                  setIsBlocked(true);
                  setChatData([]);

                  // persist block in chatCache
                  if (chatCache[key]) chatCache[key].blocked = true;
                }

                setShowActionsModal(false);
              }}
            >
              <Text
                style={{
                  ...typography.buttonLargeRegular,
                  color: colors.button.activeLabelPrimary,
                }}
              >
                {isBlocked ? "Unblock" : "Block"}
              </Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              style={{
                width: "100%",
                height: 56,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 12,
              }}
              onPress={() => setShowActionsModal(false)}
            >
              <Text
                style={{
                  ...typography.buttonLargeRegular,
                  color: colors.foreground.default,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>

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
  username: { ...typography.bodyMedium, color: colors.foreground.default, flex: 1 },
  rezultsButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.foreground.default,
    backgroundColor: colors.background.surface1,
  },
  rezultsButtonActive: { backgroundColor: colors.brand.purple1, borderColor: colors.brand.purple1 },
  rezultsButtonText: { ...typography.bodyMedium, color: colors.foreground.default },
  rezultsButtonTextActive: { color: colors.neutral[0], fontWeight: "600" },
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
  bottom: 0, // ✅ stick flush to bottom
  paddingHorizontal: 20,
  paddingTop: 12,         // 🔽 reduce padding so input is closer
  paddingBottom: Platform.OS === "ios" ? 20 : 16, // ✅ no stripe, still safe
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  backgroundColor: "transparent",
  },
  footer: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.foreground.muted,
    paddingHorizontal: 14,
    marginRight: 8,
    ...typography.bodyRegular,
    color: colors.foreground.default,
    backgroundColor: colors.background.surface1,
  },
  sendButton: {
    backgroundColor: colors.brand.purple1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendButtonText: { ...typography.bodyMedium, color: colors.neutral[0], fontWeight: "600" },
  stopButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: colors.brand.purple1,
    alignItems: "center",
  },
  stopButtonText: { ...typography.bodyMedium, color: colors.neutral[0], fontWeight: "600" },
  dateDivider: {
    alignSelf: "center",
    backgroundColor: colors.background.surface2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginVertical: 8,
  },
  dateText: { ...typography.captionSmallRegular, color: colors.foreground.muted },
  blockOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  blockedText: { ...typography.bodyMedium, color: colors.foreground.soft },
});
