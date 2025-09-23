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
  KeyboardAvoidingView,
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
  const [chatData, setChatData] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    const key = user.name || "default";
    if (chatCache[key]) setChatData(chatCache[key]);
  }, []);

  useEffect(() => {
    const key = user.name || "default";
    chatCache[key] = chatData;
  }, [chatData]);

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
      />
    );
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
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
            style={[styles.rezultsButton, chatState.hasShared && styles.rezultsButtonActive]}
            onPress={() => {
              if (!chatState.hasRequested) {
                setChatState({ ...chatState, hasRequested: true });
                setChatData((prev) => [
                  ...prev,
                  { id: Date.now().toString(), type: "request", direction: "from-user", username: currentUser.name, avatar: currentUser.avatar, timestamp: "10:02AM" }
                ]);
              } else {
                setChatState({ ...chatState, hasRequested: false });
                setChatData((prev) => [
                  ...prev,
                  { id: Date.now().toString(), type: "cancel-request", direction: "from-user", username: currentUser.name, avatar: currentUser.avatar, timestamp: "10:03AM" }
                ]);
              }
            }}
          >
            <Text style={[styles.rezultsButtonText, chatState.hasShared && styles.rezultsButtonTextActive]}>
              {chatState.hasRequested ? "Rezults Requested" : "Request Rezults"}
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
          paddingBottom: 140, // ✅ from reference
        }}
        onContentSizeChange={(w, h) => {
          flatListRef.current?.scrollToOffset({ offset: h + 50, animated: true }); // ✅ from reference
        }}
        ListHeaderComponent={
          <View style={styles.dateDivider}>
            <Text style={styles.dateText}>Today</Text>
          </View>
        }
      />

      {/* Footer */}
      <BlurView intensity={40} tint="dark" style={styles.footerBlur}>
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
                setChatData((prev) => [
                  ...prev,
                  { id: Date.now().toString(), type: "share", direction: "from-user", username: currentUser.name, avatar: currentUser.avatar, timestamp: "10:05AM" }
                ]);
                setMessage("");
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
    </KeyboardAvoidingView>
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
    position: "absolute", left: 0, right: 0, bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40, // ✅ from reference
    backgroundColor: "transparent",
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
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
    alignSelf: "center", backgroundColor: colors.background.surface2,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, marginVertical: 8,
  },
  dateText: { ...typography.captionSmallRegular, color: colors.foreground.muted },
});
