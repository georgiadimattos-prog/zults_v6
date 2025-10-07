import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from "react-native";
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
  timestamp = "10:02AM",
  text,
  chatUserId,
}) {
  const isFromUser = direction === "from-user";
  const isFromOther = direction === "from-other";
  const isSystemMessage = type === "cancel-request";

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
            ]}
          >
            <Text
              style={[
                isFromUser ? styles.messageTextUser : styles.messageTextOther,
              ]}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              {text}
            </Text>
          </View>
          <Text
            style={isFromUser ? styles.timestampRight : styles.timestampLeft}
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

  // --- Rezults-related bubbles
  let label = "";
  let subtext = "";

  if (type === "cancel-request") label = "Request Cancelled";
  else if (type === "request") {
    if (isFromOther) {
      label = `Request from ${username || "User"}`;
      subtext = `${username || "They"} want to see your Rezults`;
    } else {
      label = "Requested Rezults";
      subtext = "You asked to view their Rezults";
    }
  } else if (type === "share") {
    label = isFromOther
      ? `${username || "User"} is sharing Rezults`
      : "Sharing Rezults";
    subtext = "Rezults are now available to view";
  } else if (type === "stop-share") {
    label = isFromOther
      ? `${username || "User"} stopped sharing Rezults`
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
      {isFromOther && !isSystemMessage && (
        <Image source={avatar || fallbackAvatar} style={styles.avatar} />
      )}

      <View style={styles.contentBlock}>
        {!isSystemMessage && (
          <Text
            style={[styles.username, isFromUser ? styles.usernameRight : styles.usernameLeft]}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            {username}
          </Text>
        )}

        <View
          style={[
            styles.messageBubble,
            isFromUser ? styles.bubbleRight : styles.bubbleLeft,
            type === "stop-share" && { backgroundColor: "#3A3A3C" },
          ]}
        >
          <Text
            style={[
              isFromOther ? styles.labelOther : styles.label,
              { flexShrink: 1, flexWrap: "wrap" },
            ]}
            allowFontScaling
            maxFontSizeMultiplier={1.3}
          >
            {label}
          </Text>

          {!!subtext && !isSystemMessage && (
            <Text
              style={isFromOther ? styles.subtextOther : styles.subtext}
              allowFontScaling
              maxFontSizeMultiplier={1.2}
            >
              {subtext}
            </Text>
          )}
        </View>

        {!isSystemMessage && (
          <Text
            style={[
              styles.timestamp,
              type === "stop-share" && isFromUser && { color: "#A8A8A8" },
            ]}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            {timestamp}
          </Text>
        )}
      </View>

      {isFromUser && !isSystemMessage && (
        <Image source={avatar || fallbackAvatar} style={styles.avatar} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 6,
    paddingHorizontal: 8,
    alignItems: "flex-end",
  },
  leftAlign: { justifyContent: "flex-start" },
  rightAlign: { justifyContent: "flex-end", alignSelf: "flex-end" },
  centerAlign: { justifyContent: "center" },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginHorizontal: 6,
  },

  contentBlock: { maxWidth: "80%", flexShrink: 1 },

  username: {
    ...typography.chatMeta,
    fontSize: 12,
    color: colors.foreground.soft,
    marginBottom: 2,
  },
  usernameLeft: { textAlign: "left" },
  usernameRight: { textAlign: "right" },

  // --- Bubble base
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    flexShrink: 1,
    maxWidth: "100%",
  },
  bubbleLeft: {
    backgroundColor: colors.background.surface2,
    borderTopLeftRadius: 0,
  },
  bubbleRight: {
    backgroundColor: "#DCF8C6", // ✅ WhatsApp green bubble
    borderTopRightRadius: 0,
  },

  // --- Text styling
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
  subtext: {
    ...typography.chatMessage,
    fontSize: 14,
    color: "#6E6E6E",
    marginTop: 2,
  },
  subtextOther: {
    ...typography.chatMessage,
    fontSize: 14,
    color: "#B1B1B1",
    marginTop: 2,
  },

  timestamp: {
    ...typography.chatMeta,
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
    alignSelf: "flex-end",
  },
  timestampLeft: { alignSelf: "flex-start" },
  timestampRight: { alignSelf: "flex-end" },

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
});