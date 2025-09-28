import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Animated,
} from 'react-native';
import { colors, typography } from '../../../theme';
import arrowRight from '../../../assets/images/navbar-arrow-right.png';
import infoIcon from '../../../assets/images/info-icon.png';
import tomas from '../../../assets/images/tomas.png';
import melany from '../../../assets/images/melany.png';
import madman from '../../../assets/images/madman.png';
import goodguy from '../../../assets/images/goodguy.png';
import SearchBar from '../../ui/SearchBar';
import ScreenFooter from '../../ui/ScreenFooter';
import ZultsButton from '../../ui/ZultsButton';
import ScreenWrapper from '../../ui/ScreenWrapper';
import { NavbarBackRightText } from '../../ui/Navbar';
import SMSTab from './tabs/SMSTab';
import LinkTab from './tabs/LinkTab';
import * as Contacts from "expo-contacts";
import { Share, Alert } from "react-native";
import { rezultsCache } from "../../../cache/rezultsCache";
import { useInvite } from "../../ui/useInvite"; 

export default function ShareScreen({ navigation }) {
  const { sendInvite } = useInvite();
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('Users');
  const [phone, setPhone] = useState(''); // ✅ added back

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const takeoverAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (searchFocused && activeTab === 'Users') {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(takeoverAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(takeoverAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [searchFocused, activeTab]);

  const users = [
    { name: 'TomasB.', image: tomas, isVerified: false },
    { name: 'Binkey', image: melany, isVerified: true },
    { name: 'MadMan', image: madman, isVerified: false },
    { name: 'Zults (demo)', image: goodguy, isVerified: false },
  ];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const NAVBAR_HEIGHT = 30;

  const handleUserPress = (user) => {
    navigation.navigate('UserChat', { user });
  };

  const renderTabContent = () => {
    if (activeTab === 'Users') {
      if (!searchFocused) return null;

      const listToShow = search.trim().length === 0 ? users : filteredUsers;

      return (
        <ScrollView style={styles.userList}>
          {listToShow.map((user, index) => (
            <TouchableOpacity
              key={index}
              style={styles.userRow}
              onPress={() => handleUserPress(user)}
            >
              <Image source={user.image} style={styles.avatar} />
              <Text style={styles.username}>{user.name}</Text>
              <Image source={arrowRight} style={styles.arrow} />
            </TouchableOpacity>
          ))}

          {search.trim().length > 0 && listToShow.length === 0 && (
            <Text style={[styles.subtitle, { textAlign: 'center', marginTop: 24 }]}>
              No users found
            </Text>
          )}
        </ScrollView>
      );
    }

    if (activeTab === 'SMS') {
  return <SMSTab navigation={navigation} />;
}

    if (activeTab === 'Link') {
  return <LinkTab />;
}

    return null;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenWrapper topPadding={0}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background.surface1} />

          <NavbarBackRightText
  rightText={searchFocused && activeTab === 'Users' ? 'Cancel' : 'Invite'}
  onRightPress={() => {
    if (searchFocused && activeTab === 'Users') {
      setSearch('');
      setSearchFocused(false);
      Keyboard.dismiss();
    } else {
      sendInvite(); // ✅ reuse hook, no need to duplicate code
    }
  }}
/>

          {/* Tabs + header */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            }}
          >
            <View style={styles.tabsContainer}>
              {['Users', 'Link', 'SMS'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={activeTab === tab ? styles.tabActive : styles.tabInactive}
                  onPress={() => {
                    setActiveTab(tab);
                    setSearch('');
                    setSearchFocused(false);
                  }}
                >
                  <Text
                    style={
                      activeTab === tab ? styles.tabActiveText : styles.tabInactiveText
                    }
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.headerBlock, styles.content]}>
              <Text style={styles.pageTitle}>
                {activeTab === 'Users'
                  ? 'Users'
                  : activeTab === 'Link'
                  ? 'Link'
                  : 'SMS'}
              </Text>
              <Text style={styles.subtitle}>
                {activeTab === 'Users'
                  ? 'Share or request Rezults with other users.'
                  : activeTab === 'Link'
                  ? 'Create a shareable Rezults link so anyone without the app can view it.'
                  : 'Send someone an anonymous nudge to get tested.'}
              </Text>
            </View>

            {activeTab === 'Users' && (
              <View style={styles.content}>
                <SearchBar
                  value={search}
                  onChangeText={setSearch}
                  onCancel={() => {
                    setSearch('');
                    setSearchFocused(false);
                  }}
                  onFocus={() => setSearchFocused(true)}
                />
              </View>
            )}

            {renderTabContent()}
          </Animated.View>

          {/* Search takeover for Users */}
          {activeTab === 'Users' && (
            <Animated.View
              style={{
                position: 'absolute',
                top: NAVBAR_HEIGHT,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: takeoverAnim,
                transform: [
                  {
                    translateY: takeoverAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 40 }}>
                <SearchBar
                  value={search}
                  onChangeText={setSearch}
                  onCancel={() => {
                    setSearch('');
                    setSearchFocused(false);
                  }}
                  onFocus={() => setSearchFocused(true)}
                />
                {renderTabContent()}
              </View>
            </Animated.View>
          )}
        </ScreenWrapper>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.surface2,
    borderRadius: 18,
    height: 36,
    padding: 4,
    marginTop: 16,
    marginBottom: 24,
    alignSelf: 'stretch',
    marginHorizontal: 16,   // ✅ add equal side padding
  },
  tabActive: {
    flex: 1,
    backgroundColor: colors.foreground.default,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActiveText: {
    ...typography.bodyMedium,
    color: colors.background.surface1,
  },
  tabInactive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabInactiveText: {
    ...typography.bodyMedium,
    color: colors.foreground.soft,
  },
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
  },
  pageTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
    lineHeight: 20,
  },
  userList: {
    marginTop: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: colors.background.surface2,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  username: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.foreground.default,
  },
  arrow: {
    width: 24,
    height: 24,
  },
  content: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  label: {
    ...typography.captionSmallRegular,
    color: colors.neutralText.label,
    marginBottom: 6,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    ...typography.bodyRegular,
    color: colors.foreground.default,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D3E2D',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  infoIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#1DCA7A',
  },
  infoText: {
    flexShrink: 1,
    ...typography.captionSmallRegular,
    color: colors.neutral[0],
  },
  infoHighlight: {
    color: '#1DCA7A',
  },
});
