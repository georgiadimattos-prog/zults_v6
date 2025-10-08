import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { colors, typography } from "../../theme";
import fallbackAvatar from "../../assets/images/melany.png";

function TypingIndicator({ avatar }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDot = (dot, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, { toValue: -4, duration: 300, delay, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
      ])
    ).start();
  };

  useEffect(() => {
    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  return (
    <View style={[styles.container, styles.leftAlign]}>
      <Image source={avatar || fallbackAvatar} style={styles.avatar} />
      <View style={styles.typingBubble}>
        <Animated.Text style={[styles.dot, { transform: [{ translateY: dot1 }] }]}>●</Animated.Text>
        <Animated.Text style={[styles.dot, { transform: [{ translateY: dot2 }] }]}>●</Animated.Text>
        <Animated.Text style={[styles.dot, { transform: [{ translateY: dot3 }] }]}>●</Animated.Text>
      </View>
    </View>
  );
}

export default function RezultActionBubble({
  type = "request",
  direction = "from-user",
  username,
  avatar,
  timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  text,
  chatUserId,
}) {
  const isFromUser = direction === "from-user";
  const isFromOther = direction === "from-other";
  const isSystemMessage = type === "cancel-request";

  // ✅ Detect Rezy dark chat
  const isRezyChat = chatUserId === "zults-demo";

  if (type === "typing") return <TypingIndicator avatar={avatar} />;

  // --- Plain text / note bubble
  if (type === "note" || type === "text") {
    return (
      <View
        style={[
          styles.container,
          isFromUser && styles.rightAlign,
          isFromOther && styles.leftAlign,
        ]}
      >
        {isFromOther && <Image source={avatar || fallbackAvatar} style={styles.avatar} />}
        <View style={styles.contentBlock}>
          <View
            style={[
              styles.messageBubble,
              isFromUser ? styles.bubbleRight : styles.bubbleLeft,
              isRezyChat && isFromOther && styles.rezyBubbleLeft, // 👈 dark-theme fix
            ]}
          >
            <Text
              style={[
                isFromUser ? styles.messageTextUser : styles.messageTextOther,
                isRezyChat && isFromOther && { color: "#FFF" },
              ]}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              {text}
            </Text>
          </View>
          <Text
  style={[
    isFromUser ? styles.timestampRight : styles.timestampLeft,
  ]}
  allowFontScaling
  maxFontSizeMultiplier={1.2}
>
  {timestamp}
</Text>
        </View>
        {isFromUser && <Image source={avatar || fallbackAvatar} style={styles.avatar} />}
      </View>
    );
  }

// --- Rezults-related bubbles (titles only, minimal Zults style)
let label = "";

console.log("RezultsActionBubble type:", type);

if (type === "cancel-request") {
  label = "Request cancelled";
} else if (type === "request") {
  label = isFromOther
    ? "Requested your Rezults"
    : "You requested Rezults";
} else if (type === "share") {
  label = isFromOther
    ? "Sharing their Rezults"
    : "You’re sharing your Rezults";
} else if (type === "stop-share") {
  label = isFromOther
    ? "Stopped sharing Rezults"
    : "You stopped sharing Rezults";
}

return (
  <View
    style={[
      styles.container,
      isSystemMessage && styles.centerAlign,
      isFromUser && styles.rightAlign,
      isFromOther && styles.leftAlign,
    ]}
  >
    {/* Avatar (left for incoming) */}
    {isFromOther && !isSystemMessage && (
      <Image source={avatar || fallbackAvatar} style={styles.avatar} />
    )}

    <View style={styles.contentBlock}>
      {/* 🧹 Username removed for both sides */}

      {/* Rezults action bubble */}
      <View
        style={[
          styles.messageBubble,
          isFromUser ? styles.bubbleRight : styles.bubbleLeft,
          isRezyChat && isFromOther && styles.rezyBubbleLeft,
        ]}
      >
        <Text
          style={[
            isFromOther ? styles.labelOther : styles.label,
            isRezyChat && isFromOther && { color: "#FFF" },
            { flexShrink: 1, flexWrap: "wrap" },
          ]}
          allowFontScaling
          maxFontSizeMultiplier={1.3}
        >
           {label && label.trim() !== "" ? label : text || "Sharing Rezults"}
        </Text>
      </View>

      {/* Timestamp below bubble */}
      {!isSystemMessage && (
        <Text
          style={[
            isFromUser ? styles.timestampRight : styles.timestampLeft,
            type === "stop-share" && isFromUser && { color: "#A8A8A8" },
            isRezyChat && isFromOther && { color: "rgba(255,255,255,0.55)" },
          ]}
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          {timestamp}
        </Text>
      )}
    </View>

    {/* Avatar (right for outgoing) */}
    {isFromUser && !isSystemMessage && (
      <Image source={avatar || fallbackAvatar} style={styles.avatar} />
    )}
  </View>
);
}

const styles = StyleSheet.create({
  // --- Layout containers
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  leftAlign: { justifyContent: "flex-start" },
  rightAlign: { justifyContent: "flex-end", alignSelf: "flex-end" },
  centerAlign: { justifyContent: "center" },

  // --- Avatars
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginHorizontal: 6,
    marginBottom: 2,
  },

  // --- Message content container
  contentBlock: { maxWidth: "80%", flexShrink: 1 },

  // --- Header (username + top timestamp for incoming)
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginBottom: 2,
  },
  usernameLeft: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "left",
  },
  usernameRight: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    textAlign: "right",
  },
  timestampHeader: {
    fontSize: 12,
    lineHeight: 16,
    color: "rgba(255,255,255,0.45)",
    includeFontPadding: false,
  },

  // --- Chat bubbles
  messageBubble: {
  paddingHorizontal: 15,     // ⬅️ tighter side padding
  paddingVertical: 8,        // ⬅️ snug vertical rhythm
  borderRadius: 16,
  flexShrink: 1,
  maxWidth: "100%",
  marginBottom: 2,           // ⬅️ brings timestamp closer
},
  bubbleLeft: {
    backgroundColor: colors.background.surface2,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 0,
  },
  bubbleRight: {
    backgroundColor: "#DCF8C6",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 0,
  },
  rezyBubbleLeft: {
    backgroundColor: "rgba(255,255,255,0.12)", // dark bubble for Rezy
  },

  // --- Message text (inside bubbles)
  messageTextUser: {
    ...typography.chatMessage,
    fontSize: 15,
    lineHeight: 22,
    color: "#111",
  },
  messageTextOther: {
    ...typography.chatMessage,
    fontSize: 15,
    lineHeight: 22,
    color: "#fff",
  },
  label: {
    ...typography.chatMessageBold,
    fontSize: 15,
    lineHeight: 20,
    color: "#111",
  },
  labelOther: {
    ...typography.chatMessageBold,
    fontSize: 15,
    lineHeight: 20,
    color: "#fff",
  },

  // --- Timestamps
  timestampHeader: {
    fontSize: 11,
    lineHeight: 16,
    color: "rgba(255,255,255,0.45)",
    includeFontPadding: false,
  },
  timestampLeft: {
  fontSize: 12,
  lineHeight: 16,
  color: "rgba(255,255,255,0.55)",
  marginTop: 3,              // ⬅️ reduced gap
  alignSelf: "flex-start",
  textAlign: "left",
  includeFontPadding: false,
},
timestampRight: {
  fontSize: 12,
  lineHeight: 16,
  color: "rgba(255,255,255,0.55)",
  marginTop: 3,              // ⬅️ reduced gap
  alignSelf: "flex-end",
  textAlign: "right",
  includeFontPadding: false,
},

  // --- Typing indicator
  typingBubble: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    fontSize: 8,
    lineHeight: 10,
    color: "#8E8E93",
  },
  usernameRight: {
  textAlign: "right",
  color: "#111", // dark text on light green bubble
},
usernameLeft: {
  textAlign: "left",
  color: "#FFFFFF", // white on Melany’s dark bubble
},
});