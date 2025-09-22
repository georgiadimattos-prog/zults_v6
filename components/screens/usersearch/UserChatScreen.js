import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { colors, typography } from '../../../theme';
import { KeyboardAvoidingView } from 'react-native';
import ScreenWrapper from '../../ui/ScreenWrapper';
import RezultActionBubble from '../../ui/RezultActionBubble';
import verifiedIcon from '../../../assets/images/verified-icon.png';
import arrowLeft from '../../../assets/images/navbar-arrow.png';
import moreIcon from '../../../assets/images/navbar-dots.png';
import fallbackAvatar from '../../../assets/images/melany.png';

const chatCache = {}; // 🧠 Global cache survives navigation

export default function UserChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const currentUser = {
    name: 'TomasB.',
    avatar: require('../../../assets/images/tomas.png'),
    isVerified: true,
  };

  const user = route.params?.user || {
    name: 'Binkey',
    image: fallbackAvatar,
    isVerified: true,
  };

  const [message, setMessage] = useState('');
  const [chatState, setChatState] = useState({ hasShared: false, hasRequested: false });
  const [binkeyState, setBinkeyState] = useState({ hasShared: false, hasRequested: false });

  const [chatData, setChatData] = useState([
    { id: 'divider-today', type: 'divider', text: 'Today' }
  ]);

  useEffect(() => {
    const userKey = user.name || 'default';
    if (chatCache[userKey]) {
      setChatData(chatCache[userKey]);
    }
  }, []);

  useEffect(() => {
    const userKey = user.name || 'default';
    chatCache[userKey] = chatData;
  }, [chatData]);

  const flatListRef = useRef(null);

  const renderMessage = ({ item }) => {
    if (item.type === 'divider') {
      return (
        <View style={styles.dividerContainer}>
          <Text style={styles.dividerText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <RezultActionBubble
        type={item.type}
        direction={item.direction}
        username={item.username}
        avatar={item.avatar}
        timestamp={item.timestamp}
        text={item.text}
      />
    );
  };

  // --- DEMO LOGIC FOR BINKY ---
  const triggerBinkeyResponse = (action) => {
    if (action === 'request' && !chatState.hasShared && !binkeyState.hasShared) {
      const delay = 5000 + Math.floor(Math.random() * 3000);

      // show typing bubble after 3s
      setTimeout(() => {
        setChatData(prev => [
          ...prev,
          { id: 'typing-binkey', type: 'typing', direction: 'from-other', username: 'Binkey', avatar: fallbackAvatar },
        ]);
      }, 3000);

      setTimeout(() => {
        setChatData(prev => prev.filter(item => item.id !== 'typing-binkey'));
        setBinkeyState({ hasRequested: true, hasShared: false });
        setChatData(prev => [
          ...prev,
          { id: Date.now().toString(), type: 'request', direction: 'from-other', username: 'Binkey', avatar: fallbackAvatar, timestamp: '10:07AM' },
        ]);
      }, delay);
    }

    if (action === 'share') {
      // typing bubble after 3s
      setTimeout(() => {
        setChatData(prev => [
          ...prev,
          { id: 'typing-binkey', type: 'typing', direction: 'from-other', username: 'Binkey', avatar: fallbackAvatar },
        ]);
      }, 3000);

      setTimeout(() => {
        setChatData(prev => prev.filter(item => item.id !== 'typing-binkey'));
        setBinkeyState({ hasShared: true, hasRequested: false });
        setChatData(prev => [
          ...prev,
          { id: Date.now().toString(), type: 'share', direction: 'from-other', username: 'Binkey', avatar: fallbackAvatar, timestamp: '10:12AM' },
        ]);
        setTimeout(() => {
          setBinkeyState({ hasShared: false, hasRequested: false });
          setChatData(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'stop-share', direction: 'from-other', username: 'Binkey', avatar: fallbackAvatar, timestamp: '10:27AM' },
          ]);
        }, 15000);
      }, 10000);
    }
  };

  const binkeyButtonLabel = binkeyState.hasShared
    ? "View Rezults"
    : chatState.hasRequested
      ? "Rezults Requested"
      : "Request Rezults";

  const handleRequestPress = () => {
    if (!chatState.hasRequested) {
      setChatState(prev => ({ ...prev, hasRequested: true }));
      setChatData(prev => [
        ...prev,
        { id: Date.now().toString(), type: 'request', direction: 'from-user', username: currentUser.name, avatar: currentUser.avatar, timestamp: '10:02AM' },
      ]);
      triggerBinkeyResponse('request');
    } else {
      setChatState(prev => ({ ...prev, hasRequested: false }));
      setChatData(prev => [
        ...prev,
        { id: Date.now().toString(), type: 'cancel-request', direction: 'from-user', username: currentUser.name, avatar: currentUser.avatar, timestamp: '10:03AM' },
      ]);
    }
  };

  const handleShare = () => {
    setChatState({ hasShared: true });
    const shareBubble = { id: Date.now().toString(), type: 'share', direction: 'from-user', username: currentUser.name, avatar: currentUser.avatar, timestamp: '10:05AM' };
    if (message && message.trim().length > 0) {
      const noteBubble = { id: (Date.now() + 1).toString(), type: 'note', direction: 'from-user', username: currentUser.name, avatar: currentUser.avatar, text: message.trim(), timestamp: '10:05AM' };
      setChatData(prev => [...prev, shareBubble, noteBubble]);
    } else {
      setChatData(prev => [...prev, shareBubble]);
    }
    triggerBinkeyResponse('share');
    setMessage('');
  };

  const handleStopShare = () => {
    setChatState({ hasShared: false });
    const stopShareBubble = { id: Date.now().toString(), type: 'stop-share', direction: 'from-user', username: currentUser.name, avatar: currentUser.avatar, timestamp: '10:06AM' };
    setChatData(prev => [...prev, stopShareBubble]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScreenWrapper style={styles.wrapper}>
        {/* Header */}
        <BlurView intensity={40} tint="dark" style={styles.topBlur}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={arrowLeft} style={styles.backIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('More options')}>
              <Image source={moreIcon} style={styles.moreIconTopRow} />
            </TouchableOpacity>
          </View>
          <View style={styles.userRow}>
            <Image source={user.image || fallbackAvatar} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.username}>{user.name}</Text>
              {user.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Image source={verifiedIcon} style={styles.verifiedIcon} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.binkeyButton}
              onPress={handleRequestPress}
            >
              <Text style={styles.binkeyButtonText}>{binkeyButtonLabel}</Text>
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Chat */}
        <FlatList
          ref={flatListRef}
          data={chatData}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingTop: 120,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: 'transparent', flex: 1 }}
          onContentSizeChange={(w, h) => {
            flatListRef.current?.scrollToOffset({ offset: h + 50, animated: true });
          }}
        />

        {/* Footer */}
        <BlurView intensity={40} tint="dark" style={styles.footerBlur}>
          {chatState.hasShared ? (
            <TouchableOpacity style={styles.stopButton} onPress={handleStopShare}>
              <Text style={styles.stopButtonText}>Stop Sharing my Rezults</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.footerRow}>
              <TextInput
                placeholder="Type a message..."
                placeholderTextColor={colors.foreground.muted}
                value={message}
                onChangeText={setMessage}
                style={styles.input}
              />
              <TouchableOpacity style={styles.footerButton} onPress={handleShare}>
                <Text style={styles.footerButtonText}>Share Rezults</Text>
              </TouchableOpacity>
            </View>
          )}
        </BlurView>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },

  topBlur: {
    paddingTop: Platform.OS === 'ios' ? 72 : 56,
    paddingBottom: 12,
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backIcon: { width: 28, height: 28, tintColor: colors.foreground.default },
  moreIconTopRow: { width: 24, height: 24, tintColor: colors.foreground.default },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  username: { ...typography.bodyMedium, color: colors.foreground.default },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  verifiedIcon: { width: 12, height: 12, marginRight: 4 },
  verifiedText: { ...typography.captionSmallRegular, color: colors.info.onContainer },
  binkeyButton: {
    marginLeft: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.foreground.default,
    backgroundColor: colors.background.surface1,
  },
  binkeyButtonText: { ...typography.bodyMedium, color: colors.foreground.default },
  dividerContainer: { alignItems: 'center', marginVertical: 16 },
  dividerText: {
    ...typography.captionSmallRegular,
    color: colors.foreground.default,
    backgroundColor: colors.background.surface2,
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 20,
  },
  footerBlur: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40, // extra safe space
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.foreground.muted,
    paddingHorizontal: 16,
    color: colors.foreground.default,
    ...typography.bodyRegular,
    backgroundColor: colors.background.surface1,
  },
  footerButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.foreground.default,
    backgroundColor: colors.background.surface1,
  },
  footerButtonText: { ...typography.bodyMedium, color: colors.foreground.default },
  stopButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: colors.brand.purple1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButtonText: {
    ...typography.bodyMedium,
    color: '#fff',
    fontWeight: '600',
  },
});
