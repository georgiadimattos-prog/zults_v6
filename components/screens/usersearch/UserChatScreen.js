/* components/screens/usersearch/UserChatScreen.js
   Baseline-v40 + NoRezultsModal + Double-Tap Like (❤️) animation; emoji picker removed
*/

import React, { useState, useRef, useEffect, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  Keyboard,
  Animated,
  Easing,
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

  const currentUser = { name: "TomasB.", avatar: TomasAvatar };
  const user = route.params?.user || { name: "Unknown", image: fallbackAvatar };

  const [message, setMessage] = useState("");
  const [chatState, setChatState] = useState({ hasShared: false, hasRequested: false });
  const [otherUserState, setOtherUserState] = useState({ hasShared: false, hasRequested: false });
  const [chatData, setChatData] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showNoRezultsModal, setShowNoRezultsModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

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
    const key = user.name || "default";
    if (chatCache[key]) {
      const saved = chatCache[key];
      setChatData(saved.chatData || []);
      setChatState(saved.chatState || { hasShared: false, hasRequested: false });
      setOtherUserState(saved.otherUserState || { hasShared: false, hasRequested: false });
      if (saved.blocked) setIsBlocked(true);
    }

    if (user.id === "zults-demo") {
      setChatData([
        {
          id: "demo-msg-1",
          type: "share",
          direction: "from-other",
          username: "Zults (Demo)",
          avatar: user.image,
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
      ]);
      setOtherUserState({ hasShared: true, hasRequested: false });
    }
  }, []);

  // persist to cache
  useEffect(() => {
    const hasAction = chatData.some(
      (msg) => msg.type === "request" || msg.type === "share" || msg.type === "stop-share"
    );
    if (!hasAction && !isBlocked) return;

    const key = user.name || "default";
    chatCache[key] = {
      ...chatCache[key],
      chatData,
      chatState,
      otherUserState,
      user,
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
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
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

  useEffect(() => {
    if (chatData.length > 0) {
      flatListRef.current?.scrollToOffset({
        offset: Math.max(0, chatData.length * 80 - 200),
        animated: true,
      });
    }
  }, [chatData]);

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
    <View style={styles.root}>
      {/* Header */}
      <BlurView intensity={40} tint="dark" style={styles.topBlur}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => setShowActionsModal(true)}>
            <Image source={moreIcon} style={styles.moreIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.userRow}>
          <TouchableOpacity
            onPress={() => {
              const hasAction = chatData.some(
                (msg) => msg.type === "request" || msg.type === "share" || msg.type === "stop-share"
              );
              if (hasAction) {
                navigation.navigate("Activities");
              } else {
                navigation.goBack();
              }
            }}
          >
            <Image source={arrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Image source={user.image || fallbackAvatar} style={styles.avatar} />
          <Text style={styles.username}>{user.name}</Text>

          {isBlocked ? (
            <TouchableOpacity
              style={styles.rezultsButton}
              onPress={() => {
                setIsBlocked(false);
                setChatData([]);
                setChatState({ hasShared: false, hasRequested: false });
                setOtherUserState({ hasShared: false, hasRequested: false });
              }}
            >
              <Text style={styles.rezultsButtonText}>Unblock User</Text>
            </TouchableOpacity>
          ) : (
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
                    realName: user.name,
                    providerName: "Sexual Health London",
                    testDate: "12 Dec 2025",
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
          )}
        </View>
      </BlurView>

      {/* Messages */}
      {isBlocked ? (
        <View style={styles.blockOverlay}>
          <Text style={styles.blockedText}>This chat is blocked</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={chatData}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingTop: 180,
            paddingBottom: 140 + keyboardHeight,
          }}
        />
      )}

      {/* Footer (emoji button removed) */}
{!isBlocked && (
  <BlurView
    intensity={40}
    tint="dark"
    style={[styles.footerBlur, { bottom: keyboardHeight }]}
  >
    {chatState.hasShared ? (
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


      {/* Action Modal */}
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
          isBlocked
            ? { label: "Unblock", onPress: () => {
                setIsBlocked(false);
                setChatData([]);
                setChatState({ hasShared: false, hasRequested: false });
                setOtherUserState({ hasShared: false, hasRequested: false });
              }}
            : { label: "Block", onPress: () => {
                setIsBlocked(true);
                setChatData([]);
              }},
        ]}
      />

      {/* No Rezults Modal */}
      <NoRezultsModal
        visible={showNoRezultsModal}
        onClose={() => setShowNoRezultsModal(false)}
      />
    </View>
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
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
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
