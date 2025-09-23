import React, { useState, useRef, useEffect } from "react";
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
import EmojiSelector from "react-native-emoji-selector";
import { colors, typography } from "../../../theme";
import RezultActionBubble from "../../ui/RezultActionBubble";
import arrowLeft from "../../../assets/images/navbar-arrow.png";
import moreIcon from "../../../assets/images/navbar-dots.png";
import fallbackAvatar from "../../../assets/images/melany.png";

const TomasAvatar = require("../../../assets/images/tomas.png");
const BinkeyAvatar = require("../../../assets/images/melany.png");

// cache holds chat history + state per user
const chatCache = {};

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

export default function UserChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const currentUser = { name: "TomasB.", avatar: TomasAvatar };
  const user = route.params?.user || { name: "Binkey", image: BinkeyAvatar };

  const [message, setMessage] = useState("");
  const [chatState, setChatState] = useState({ hasShared: false, hasRequested: false });
  const [binkeyState, setBinkeyState] = useState({ hasShared: false, hasRequested: false });
  const [chatData, setChatData] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const flatListRef = useRef(null);
  const typingIdRef = useRef(null);

  // separate timer refs
  const requestTimers = useRef([]);
  const shareTimers = useRef([]);

  // live refs to use inside timers
  const chatStateRef = useRef(chatState);
  const binkeyStateRef = useRef(binkeyState);
  useEffect(() => { chatStateRef.current = chatState; }, [chatState]);
  useEffect(() => { binkeyStateRef.current = binkeyState; }, [binkeyState]);

  // restore from cache
  useEffect(() => {
    const key = user.name || "default";
    if (chatCache[key]) {
      const saved = chatCache[key];
      setChatData(saved.chatData || []);
      setChatState(saved.chatState || { hasShared: false, hasRequested: false });
      setBinkeyState(saved.binkeyState || { hasShared: false, hasRequested: false });
    }
  }, []);

  // persist to cache
  useEffect(() => {
    const key = user.name || "default";
    chatCache[key] = {
      chatData,
      chatState,
      binkeyState,
    };
  }, [chatData, chatState, binkeyState]);

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

  // cleanup timers
  useEffect(() => {
    return () => {
      [...requestTimers.current, ...shareTimers.current].forEach((t) => clearTimeout(t));
      requestTimers.current = [];
      shareTimers.current = [];
    };
  }, []);

  const addTyping = () => {
    if (typingIdRef.current) return;
    typingIdRef.current = `typing-${Date.now()}`;
    setChatData((prev) => [
      ...prev,
      { id: typingIdRef.current, type: "typing", direction: "from-other", username: "Binkey", avatar: BinkeyAvatar },
    ]);
  };

  const removeTyping = () => {
    if (typingIdRef.current) {
      setChatData((prev) => prev.filter((m) => m.id !== typingIdRef.current));
      typingIdRef.current = null;
    }
  };

  // --- FLOWS ---
  const startRequestFlow = () => {
    requestTimers.current.forEach((t) => clearTimeout(t));
    requestTimers.current = [];

    // typing then request
    requestTimers.current.push(setTimeout(() => addTyping(), 3000));
    requestTimers.current.push(setTimeout(() => {
      if (chatStateRef.current.hasShared) { removeTyping(); return; }
      removeTyping();
      setBinkeyState({ hasRequested: true, hasShared: false });
      setChatData((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "request", direction: "from-other", username: "Binkey", avatar: BinkeyAvatar, timestamp: "10:07AM" },
      ]);
    }, 5000));

    // then share if Tomas still hasn't shared
    requestTimers.current.push(setTimeout(() => {
      if (chatStateRef.current.hasShared) { removeTyping(); return; }
      addTyping();
      requestTimers.current.push(setTimeout(() => {
        if (chatStateRef.current.hasShared) { removeTyping(); return; }
        removeTyping();
        setBinkeyState({ hasRequested: false, hasShared: true });
        setChatData((prev) => [
          ...prev,
          { id: Date.now().toString(), type: "share", direction: "from-other", username: "Binkey", avatar: BinkeyAvatar, timestamp: "10:12AM" },
        ]);
        // stop after 15s
        requestTimers.current.push(setTimeout(() => {
          setBinkeyState({ hasShared: false, hasRequested: false });
          setChatState({ hasShared: chatStateRef.current.hasShared, hasRequested: false });
          setChatData((prev) => [
            ...prev,
            { id: Date.now().toString(), type: "stop-share", direction: "from-other", username: "Binkey", avatar: BinkeyAvatar, timestamp: "10:27AM" },
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
      setBinkeyState({ hasRequested: false, hasShared: true });
      setChatData((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "share", direction: "from-other", username: "Binkey", avatar: BinkeyAvatar, timestamp: "10:12AM" },
      ]);
      // stop after 15s
      shareTimers.current.push(setTimeout(() => {
        setBinkeyState({ hasShared: false, hasRequested: false });
        setChatState({ hasShared: chatStateRef.current.hasShared, hasRequested: false });
        setChatData((prev) => [
          ...prev,
          { id: Date.now().toString(), type: "stop-share", direction: "from-other", username: "Binkey", avatar: BinkeyAvatar, timestamp: "10:27AM" },
        ]);
      }, 15000));
    }, 10000));
  };

  // --- UI ---
  const renderMessage = ({ item }) => {
    if (item.type === "typing") {
      return <View style={styles.typingBubble}><TypingDots /></View>;
    }
    return (
      <RezultActionBubble
        type={item.type}
        direction={item.direction}
        username={item.username}
        avatar={item.avatar}
        timestamp={item.timestamp}
        text={item.text || ""}
        liked={item.liked}
      />
    );
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <BlurView intensity={40} tint="dark" style={styles.topBlur}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Image source={arrowLeft} style={styles.backIcon} /></TouchableOpacity>
          <TouchableOpacity><Image source={moreIcon} style={styles.moreIcon} /></TouchableOpacity>
        </View>
        <View style={styles.userRow}>
          <Image source={user.image || fallbackAvatar} style={styles.avatar} />
          <Text style={styles.username}>{user.name}</Text>
          <TouchableOpacity
            style={[
              styles.rezultsButton,
              (chatState.hasRequested || binkeyState.hasShared) && styles.rezultsButtonActive,
            ]}
            disabled={chatState.hasRequested && !binkeyState.hasShared}
            onPress={() => {
              if (binkeyState.hasShared) {
                navigation.navigate("Rezults");
                return;
              }
              if (!chatState.hasRequested) {
                setChatState({ ...chatState, hasRequested: true });
                setChatData((prev) => [
                  ...prev,
                  { id: Date.now().toString(), type: "request", direction: "from-user", username: currentUser.name, avatar: currentUser.avatar, timestamp: "10:02AM" }
                ]);
                startRequestFlow();
              }
            }}
          >
            <Text
              style={[
                styles.rezultsButtonText,
                (chatState.hasRequested || binkeyState.hasShared) && styles.rezultsButtonTextActive,
              ]}
            >
              {binkeyState.hasShared
                ? "View Rezults"
                : chatState.hasRequested
                ? "Rezults Requested"
                : "Request Rezults"}
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Messages */}
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
        onContentSizeChange={(w, h) => {
          flatListRef.current?.scrollToOffset({ offset: h + 50, animated: true });
        }}
        ListHeaderComponent={
          <View style={styles.dateDivider}>
            <Text style={styles.dateText}>Today</Text>
          </View>
        }
      />

      {/* Footer */}
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
                { id: Date.now().toString(), type: "stop-share", direction: "from-user", username: currentUser.name, avatar: currentUser.avatar, timestamp: "10:06AM" }
              ]);
            }}
          >
            <Text style={styles.stopButtonText}>Stop Sharing Rezults</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => setShowEmojiPicker((prev) => !prev)}>
              <Text style={styles.emojiToggle}>😀</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor={colors.foreground.muted}
              value={message}
              onChangeText={setMessage}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => {
                setChatState({ ...chatState, hasShared: true });
                setChatData((prev) => {
                  const newMsgs = [
                    ...prev,
                    { id: Date.now().toString(), type: "share", direction: "from-user", username: currentUser.name, avatar: currentUser.avatar, timestamp: "10:05AM" }
                  ];
                  if (message.trim()) {
                    newMsgs.push({
                      id: (Date.now() + 1).toString(),
                      type: "note",
                      direction: "from-user",
                      username: currentUser.name,
                      avatar: currentUser.avatar,
                      text: message.trim(),
                      timestamp: "10:05AM",
                    });
                  }
                  return newMsgs;
                });
                setMessage("");
                startShareFlow();
              }}
            >
              <Text style={styles.sendButtonText}>Share Rezults</Text>
            </TouchableOpacity>
          </View>
        )}
        {showEmojiPicker && (
          <View style={{ height: 250 }}>
            <EmojiSelector
              onEmojiSelected={(emoji) => setMessage((prev) => prev + emoji)}
              showSearchBar={false}
              showHistory
              category="all"
              columns={8}
            />
          </View>
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.surface1 },
  topBlur: {
    paddingTop: Platform.OS === "ios" ? 72 : 56,
    paddingBottom: 20,
    paddingHorizontal: 16,
    position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
    backgroundColor: "transparent",
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  backIcon: { width: 28, height: 28, tintColor: colors.foreground.default },
  moreIcon: { width: 24, height: 24, tintColor: colors.foreground.default },
  userRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  username: { ...typography.bodyMedium, color: colors.foreground.default, flex: 1 },
  rezultsButton: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: colors.foreground.default,
    backgroundColor: colors.background.surface1,
  },
  rezultsButtonActive: { backgroundColor: colors.brand.purple1, borderColor: colors.brand.purple1 },
  rezultsButtonText: { ...typography.bodyMedium, color: colors.foreground.default },
  rezultsButtonTextActive: { color: colors.neutral[0], fontWeight: "600" },
  typingBubble: {
    backgroundColor: colors.background.surface2,
    borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6,
    alignSelf: "flex-start", margin: 8,
  },
  footerBlur: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "transparent",
  },
  footer: { flexDirection: "row", alignItems: "center" },
  emojiToggle: { fontSize: 24, marginHorizontal: 6 },
  input: {
    flex: 1, height: 44, borderRadius: 22,
    borderWidth: 1, borderColor: colors.foreground.muted,
    paddingHorizontal: 14, marginRight: 8,
    ...typography.bodyRegular, color: colors.foreground.default,
    backgroundColor: colors.background.surface1,
  },
  sendButton: { backgroundColor: colors.brand.purple1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  sendButtonText: { ...typography.bodyMedium, color: colors.neutral[0], fontWeight: "600" },
  stopButton: { width: "100%", paddingVertical: 16, borderRadius: 20, backgroundColor: colors.brand.purple1, alignItems: "center" },
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
});
