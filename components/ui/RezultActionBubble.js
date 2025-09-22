import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '../../theme';
import fallbackAvatar from '../../assets/images/melany.png';

function TypingIndicator({ avatar }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={[styles.container, styles.leftAlign]}>
      <Image source={avatar || fallbackAvatar} style={styles.avatar} />
      <View style={styles.typingBubble}>
        <Animated.Text style={[styles.dot, { opacity }]}>● ● ●</Animated.Text>
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
  if (type === 'typing') {
    return <TypingIndicator avatar={avatar} />;
  }

  // --- Note bubble ---
  if (type === 'note') {
    return (
      <View style={[styles.container, isFromUser && styles.rightAlign, isFromOther && styles.leftAlign]}>
        {isFromOther && <Image source={avatar || fallbackAvatar} style={styles.avatar} />}
        <View style={styles.contentBlock}>
          {isFromUser ? (
            <LinearGradient colors={[colors.brand.purple1, '#9B6D6FF0']} style={[styles.bubble, styles.bubbleRight]}>
              <Text style={styles.noteText}>{text}</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.bubble, styles.bubbleLeft]}>
              <Text style={styles.noteText}>{text}</Text>
            </View>
          )}
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        {isFromUser && <Image source={avatar || fallbackAvatar} style={styles.avatar} />}
      </View>
    );
  }

  // --- Action bubbles (request/share/stop) ---
  let label = '';
  let subtext = '';
  if (type === 'cancel-request') {
    label = 'Your request was cancelled.';
  } else if (type === 'request') {
    label = 'Requested';
    subtext = 'To view your Rezults';
  } else if (type === 'share') {
    label = 'Sharing';
    subtext = 'Rezults with you';
  } else if (type === 'stop-share') {
    label = 'Stopped Sharing';
  }

  const labelColor =
    type === 'request' ? '#FF6D6D' :
    type === 'share' ? '#FFFFFF' :
    '#888';

  return (
    <View style={[styles.container, isSystemMessage && styles.centerAlign, isFromUser && styles.rightAlign, isFromOther && styles.leftAlign]}>
      {isFromOther && !isSystemMessage && (
        <Image source={avatar || fallbackAvatar} style={styles.avatar} />
      )}

      <View style={styles.contentBlock}>
        {!isSystemMessage && (
          <Text style={[styles.username, isFromUser ? styles.usernameRight : styles.usernameLeft]}>
            {username}
          </Text>
        )}

        {isFromUser ? (
          <LinearGradient
            colors={[colors.brand.purple1, '#9B6D6FF0']}
            style={[styles.bubble, styles.bubbleRight, isSystemMessage && styles.systemBubble]}
          >
            <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
            {!!subtext && <Text style={styles.subtext}>{subtext}</Text>}
          </LinearGradient>
        ) : (
          <View style={[styles.bubble, styles.bubbleLeft, isSystemMessage && styles.systemBubble]}>
            <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
            {!!subtext && <Text style={styles.subtext}>{subtext}</Text>}
          </View>
        )}

        {!isSystemMessage && <Text style={styles.timestamp}>{timestamp}</Text>}
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
    marginBottom: 12,
    paddingHorizontal: 8, // reduced so bubbles sit closer to the edges
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

  contentBlock: {
    maxWidth: '75%',
    flexShrink: 1,
  },

  username: {
    fontWeight: '500',
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  usernameLeft: { textAlign: 'left', alignSelf: 'flex-start' },
  usernameRight: { textAlign: 'right', alignSelf: 'flex-end' },

  bubble: { padding: 12, borderRadius: 16 },
  systemBubble: {
    alignSelf: 'center',
    backgroundColor: '#2C2C2C',
    padding: 12,
    minWidth: '60%',
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  bubbleLeft: {
    backgroundColor: colors.background.surface2,
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  bubbleRight: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  label: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  subtext: { ...typography.captionSmallRegular, color: '#ccc' },
  timestamp: { fontSize: 10, color: '#666', marginTop: 6, textAlign: 'right' },
  noteText: { ...typography.bodyRegular, color: '#fff' },

  // typing bubble
  typingBubble: {
    backgroundColor: colors.background.surface2,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dot: { color: colors.foreground.muted, fontSize: 12, letterSpacing: 2 },
});
