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
  navigation.navigate('UserChat', { user }); // ✅ passes full object including isBot
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
  adjustsFontSizeToFit
  minimumFontScale={0.9}
>
  {user.name}
</Text>
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
            sendInvite(); // ✅ reuse hook
          }
        }}
      />

      {/* Large title */}
      <Text style={styles.pageTitle}>Share</Text>

      {/* Tabs under the large title */}
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
  numberOfLines={1}
  ellipsizeMode="tail"
  adjustsFontSizeToFit
  minimumFontScale={0.9}
  style={activeTab === tab ? styles.tabActiveText : styles.tabInactiveText}
>
  {tab}
</Text>
    </TouchableOpacity>
  ))}
</View>

        {/* Subtitle for each share method */}
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            {activeTab === 'Users'
              ? 'Send or request Rezults with users.'
              : activeTab === 'Link'
              ? 'Someone without the app can view it.'
              : 'Anonymous SMS nudge to get tested.'}
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
  flexDirection: "row",
  backgroundColor: colors.background.surface2,
  borderRadius: 18,
  padding: 4,
  marginTop: 8,
  marginBottom: 16,
  marginHorizontal: 16,
  minHeight: 36,     // 👈 instead of fixed height
},
  tabActive: {
  flex: 1,
  backgroundColor: colors.foreground.default,
  borderRadius: 14,
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 6, // 👈 gives breathing room when fonts grow
},
  tabActiveText: {
    ...typography.bodyMedium,
    color: colors.background.surface1,
  },
  tabInactive: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 6,
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
  marginTop: 8,          // same as Activities
  marginHorizontal: 16,
  marginBottom: 12,      // same as Activities
},
  subtitle: {
  ...typography.bodyRegular,
  color: colors.foreground.soft,
  marginBottom: 24,
  marginHorizontal: 16,  // align with title + tabs
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
  includeFontPadding: false,   // Android cleanup
  textAlignVertical: "center", // ensures centered
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
