import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { colors, typography } from '../../theme';
import fallbackAvatar from '../../assets/images/melany.png';

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
        <Animated.Text style={[styles.dot, { transform: [{ translateY: dot1 }] }]} allowFontScaling>●</Animated.Text>
        <Animated.Text style={[styles.dot, { transform: [{ translateY: dot2 }] }]} allowFontScaling>●</Animated.Text>
        <Animated.Text style={[styles.dot, { transform: [{ translateY: dot3 }] }]} allowFontScaling>●</Animated.Text>
      </View>
    </View>
  );
}

export default function RezultActionBubble(props) {
  const {
    type = 'request',
    direction = 'from-user',
    username,
    avatar,
    timestamp = '10:02AM',
    text,
    chatUserId, // ✅ from UserChatScreen
  } = props;

  const isFromUser = direction === 'from-user';
  const isFromOther = direction === 'from-other';
  const isSystemMessage = type === 'cancel-request';

  // --- Typing bubble ---
  if (type === 'typing') return <TypingIndicator avatar={avatar} />;

  // --- Note bubble (user text) ---
  if (type === 'note' || type === 'text') {
    return (
      <View style={[styles.container, isFromUser && styles.rightAlign, isFromOther && styles.leftAlign]}>
        {isFromOther && <Image source={avatar || fallbackAvatar} style={styles.avatar} />}
        <View style={styles.contentBlock}>
          <View
            style={[
              styles.bubble,
              isFromUser ? styles.bubbleRight : styles.bubbleLeft,
              chatUserId === 'zults-demo' && { alignItems: 'center', alignSelf: 'flex-start' }, // ✅ Rezy fix
            ]}
          >
            <Text
              style={[
                isFromUser ? styles.messageTextUser : styles.messageTextOther,
                chatUserId === 'zults-demo' && { textAlign: 'left' }, // ✅ keep text flow natural
              ]}
              allowFontScaling
            >
              {text}
            </Text>
          </View>
          <Text
            style={isFromUser ? styles.timestampRight : styles.timestampLeft}
            allowFontScaling
          >
            {timestamp}
          </Text>
        </View>
        {isFromUser && <Image source={avatar || fallbackAvatar} style={styles.avatar} />}
      </View>
    );
  }

  // --- Action bubbles (request/share/stop) ---
  let label = '';
  let subtext = '';

  if (type === 'cancel-request') {
    label = 'Request Cancelled';
  } else if (type === 'request') {
    if (isFromOther) {
      label = `Request from ${username || 'User'}`;
      subtext = `${username || 'They'} want to see your Rezults`;
    } else {
      label = 'Requested Rezults';
      subtext = 'You asked to view their Rezults';
    }
  } else if (type === 'share') {
    if (isFromOther) {
      label = `${username || 'User'} is sharing Rezults`;
      subtext = 'Rezults are now available to view';
    } else {
      label = 'Sharing Rezults';
      subtext = 'Rezults are now available to view';
    }
  } else if (type === 'stop-share') {
    if (isFromOther) {
      label = `${username || 'User'} stopped sharing Rezults`;
    } else {
      label = 'You stopped sharing Rezults';
    }
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
          >
            {username}
          </Text>
        )}

        <View
  style={[
    styles.bubble,
    isFromUser ? styles.bubbleRight : styles.bubbleLeft,

    // ✅ make stop-share behave like a normal bubble, not centered
    type === 'stop-share' && {
      backgroundColor: '#3A3A3C',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },

    // ✅ keep cancel-request using systemBubble styling
    type === 'cancel-request' &&
      chatUserId !== 'zults-demo' && [
        styles.systemBubble,
        { flexWrap: 'wrap', alignItems: 'flex-start' },
      ],
  ]}
>
          <Text
  style={[
    type === 'stop-share' && isFromUser      // ✅ new condition
      ? styles.labelOther                    // use white text for "You stopped sharing"
      : isSystemMessage
      ? styles.systemText
      : isFromOther
      ? styles.labelOther
      : styles.label,
    { flexShrink: 1, flexWrap: 'wrap' },
  ]}
            numberOfLines={undefined}
            allowFontScaling
          >
            {label}
          </Text>

          {!!subtext && !isSystemMessage && (
            <Text
              style={isFromOther ? styles.subtextOther : styles.subtext}
              allowFontScaling
            >
              {subtext}
            </Text>
          )}
        </View>

        {!isSystemMessage && (
  <Text
    style={[
      styles.timestamp,
      type === 'stop-share' && isFromUser && { color: '#A8A8A8' }, // ✅ soft grey timestamp for dark bubble
    ]}
    allowFontScaling
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
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
  },
  leftAlign: { justifyContent: 'flex-start' },
  rightAlign: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
  centerAlign: { justifyContent: 'center' },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 6,
    marginTop: 4,
  },

  contentBlock: { maxWidth: '85%', flexShrink: 1 },

  username: {
    ...typography.chatMeta,
    fontWeight: '500',
    marginBottom: 4,
    color: colors.foreground.default,
  },
  usernameLeft: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    color: colors.foreground.soft,
  },
  usernameRight: {
    textAlign: 'right',
    alignSelf: 'flex-end',
    color: colors.foreground.default,
  },

  bubble: {
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 18,
  flexShrink: 1,
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  alignSelf: 'flex-start',
},

  systemBubble: {
  alignSelf: 'flex-start',     // ✅ align left like normal bubbles
  backgroundColor: '#3A3A3C',
  paddingVertical: 8,          // ✅ more balanced height
  paddingHorizontal: 14,
  borderRadius: 18,
  justifyContent: 'flex-start', // ✅ top-left text alignment
  alignItems: 'flex-start',
},
  systemText: {
    ...typography.chatMeta,
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  bubbleLeft: {
    backgroundColor: colors.background.surface2,
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  bubbleRight: {
    backgroundColor: '#E9E3F6',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  messageTextUser: {
  ...typography.chatMessage,
  fontSize: 15,       // 👈 up from ~14
  lineHeight: 22,     // 👈 proportional spacing
  color: '#2C2C2C',
},
messageTextOther: {
  ...typography.chatMessage,
  fontSize: 15,
  lineHeight: 22,
  color: '#FFFFFF',
},

  label: {
  ...typography.chatMessageBold,
  fontSize: 15,          // 👈 keep this AFTER the spread
  lineHeight: 20,
  includeFontPadding: false,
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.3,  // 👈 optional bump for flexibility
},

labelOther: {
  ...typography.chatMessageBold,
  fontSize: 15,
  lineHeight: 20,
  marginBottom: 1,
  color: '#FFFFFF',
  flexShrink: 1,
  flexWrap: 'wrap',
  includeFontPadding: false,
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.1,
},
  subtext: {
    ...typography.chatMessage,
    fontSize: 15,
    color: '#6E6E6E',
    flexShrink: 1,
    flexWrap: 'wrap',
    includeFontPadding: true,
    allowFontScaling: true,
    maxFontSizeMultiplier: 1.2,
  },
  subtextOther: {
  ...typography.chatMessage,
  fontSize: 15,
  color: '#B1B1B1', // softer contrast
  flexShrink: 1,
  flexWrap: 'wrap',
},

  timestamp: {
  ...typography.chatMeta,
  marginTop: 4,       // tighter top
  marginBottom: 8,    // uniform bottom gap
  fontSize: 11,
  color: colors.foreground.muted,
  textAlign: 'right',
},

  typingBubble: {
    backgroundColor: '#F1F1F1',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    fontSize: 8,
    lineHeight: 10,
    color: '#8E8E93',
  },
});