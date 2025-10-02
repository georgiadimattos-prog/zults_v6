import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Animated,
} from 'react-native';
import { colors, typography } from '../../../theme';
import arrowRight from '../../../assets/images/navbar-arrow-right.png';
import tomas from '../../../assets/images/TomasB.png';
import melany from '../../../assets/images/melany.png';
import madman from '../../../assets/images/madman.png';
import goodguy from '../../../assets/images/goodguy.png';
import zultsImage from '../../../assets/images/zults.png';
import SearchBar from '../../ui/SearchBar';
import ScreenFooter from '../../ui/ScreenFooter';
import ZultsButton from '../../ui/ZultsButton';
import ScreenWrapper from '../../ui/ScreenWrapper';
import { NavbarBackRightText } from '../../ui/Navbar';
import SMSTab from './tabs/SMSTab';
import LinkTab from './tabs/LinkTab';
import { rezultsCache } from "../../../cache/rezultsCache";
import { useInvite } from "../../ui/useInvite";

export default function ShareScreen({ navigation }) {
  const { sendInvite } = useInvite();
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('Users');
  const [phone, setPhone] = useState('');

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const takeoverAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (searchFocused && activeTab === 'Users') {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(takeoverAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(takeoverAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [searchFocused, activeTab]);

  const users = [
    { id: 'zults-demo', name: 'Rezy', image: zultsImage, isBot: true },
    { id: 'demo1', name: 'Demo1', image: melany, isVerified: true },
    { id: 'demo2', name: 'Demo2', image: tomas, isVerified: false },
    { id: 'demo3', name: 'Demo3', image: madman, isVerified: false },
    { id: 'demo4', name: 'Demo4', image: goodguy, isVerified: false },
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
  <Text
    style={styles.username}
    numberOfLines={1}
    ellipsizeMode="tail"
    maxFontSizeMultiplier={1.2}
  >
    {user.name}
  </Text>
</TouchableOpacity>
          ))}

          {search.trim().length > 0 && listToShow.length === 0 && (
            <Text
              style={[typography.bodyRegular, { textAlign: 'center', marginTop: 24 }]}
              maxFontSizeMultiplier={1.2}
            >
              No users found
            </Text>
          )}
        </ScrollView>
      );
    }

    if (activeTab === 'SMS') return <SMSTab navigation={navigation} />;
    if (activeTab === 'Link') return <LinkTab />;
    return null;
  };

  const subtitleCopy =
    activeTab === 'Users'
      ? 'Send or request Rezults with users.'
      : activeTab === 'Link'
      ? 'Someone without the app can view it.'
      : 'Anonymous SMS nudge to get tested.';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.surface1 }}
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
                sendInvite();
              }
            }}
          />

          <ScrollView
  contentContainerStyle={styles.scrollContent}
  showsVerticalScrollIndicator={false}
>
  {/* Page title + subtitle */}
  <View style={styles.headerBlock}>
    <Text style={typography.largeTitleMedium} allowFontScaling={false}>
      Share
    </Text>
    <Text style={typography.bodyRegular} maxFontSizeMultiplier={1.2}>
      {subtitleCopy}
    </Text>
  </View>

  {/* Tabs + content */}
  <Animated.View style={{ opacity: fadeAnim }}>
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
            style={activeTab === tab ? styles.tabActiveText : styles.tabInactiveText}
            maxFontSizeMultiplier={1.2}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
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
</ScrollView>

          {/* Search takeover */}
          {activeTab === 'Users' && (
            <Animated.View
              style={{
                position: 'absolute',
                top: NAVBAR_HEIGHT,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: takeoverAnim,
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
    flexDirection: "row",
    backgroundColor: colors.background.surface2,
    borderRadius: 18,
    padding: 4,
    marginTop: 8,
    marginBottom: 16,
    minHeight: 36,
  },
  tabActive: {
    flex: 1,
    backgroundColor: colors.foreground.default,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  tabInactive: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  tabActiveText: {
    ...typography.bodyMedium,
    color: colors.background.surface1,
  },
  tabInactiveText: {
    ...typography.bodyMedium,
    color: colors.foreground.soft,
  },
  content: {},

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
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  arrow: {
    width: 24,
    height: 24,
  },
  scrollContent: {
  flexGrow: 1,
  paddingBottom: 120,
  paddingHorizontal: 16,
},
headerBlock: {
  marginTop: 32,
  marginBottom: 24,
},
});