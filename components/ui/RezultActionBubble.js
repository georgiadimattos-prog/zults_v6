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
  } = props;

  const isFromUser = direction === 'from-user';
  const isFromOther = direction === 'from-other';
  const isSystemMessage = type === 'cancel-request' || type === 'stop-share';

  // --- Typing bubble ---
  if (type === 'typing') return <TypingIndicator avatar={avatar} />;

  // --- Note bubble (user text) ---
  if (type === 'note' || type === 'text') {
    return (
      <View style={[styles.container, isFromUser && styles.rightAlign, isFromOther && styles.leftAlign]}>
        {isFromOther && <Image source={avatar || fallbackAvatar} style={styles.avatar} />}
        <View style={styles.contentBlock}>
          <View style={[styles.bubble, isFromUser ? styles.bubbleRight : styles.bubbleLeft]}>
            <Text
              style={isFromUser ? styles.messageTextUser : styles.messageTextOther}
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
      subtext = 'Rezults available to view';
    } else {
      label = 'Sharing Rezults';
      subtext = 'Your Rezults are now available to view';
    }
  } else if (type === 'stop-share') {
    if (isFromOther) {
      label = `${username || 'User'} stopped sharing`;
    } else {
      label = 'You stopped sharing';
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
            isSystemMessage && styles.systemBubble,
          ]}
        >
          <Text
            style={
              isSystemMessage
                ? styles.systemText
                : isFromOther
                ? styles.labelOther
                : styles.label
            }
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
          <Text style={styles.timestamp} allowFontScaling>
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
  },
  usernameLeft: { textAlign: 'left', alignSelf: 'flex-start' },
  usernameRight: { textAlign: 'right', alignSelf: 'flex-end' },

  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },

  // System / status bubbles
  systemBubble: {
    alignSelf: 'center',
    backgroundColor: '#3A3A3C',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  systemText: {
    ...typography.chatMeta,
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // Bubble styles
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
    color: '#2C2C2C',
  },
  messageTextOther: {
    ...typography.chatMessage,
    color: '#FFFFFF',
  },

  label: {
    ...typography.chatMessageBold,
    marginBottom: 2,
    color: '#2C2C2C',
  },
  labelOther: {
    ...typography.chatMessageBold,
    marginBottom: 2,
    color: '#FFFFFF',
  },

  subtext: {
    ...typography.chatMessage,
    fontSize: 14,
    color: '#6E6E6E',
  },
  subtextOther: {
    ...typography.chatMessage,
    fontSize: 14,
    color: '#A1A1A1',
  },

  timestamp: {
    ...typography.chatMeta,
    marginTop: 6,
    marginBottom: 6,
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
