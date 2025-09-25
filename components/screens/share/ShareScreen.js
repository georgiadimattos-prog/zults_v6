import React, { useState } from 'react';
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
} from 'react-native';
import { colors, typography } from '../../../theme';
import closeCross from '../../../assets/images/close-cross.png';
import infoIcon from '../../../assets/images/info-icon.png';
import arrowRight from '../../../assets/images/navbar-arrow-right.png';
import tomas from '../../../assets/images/tomas.png';
import melany from '../../../assets/images/melany.png';
import madman from '../../../assets/images/madman.png';
import goodguy from '../../../assets/images/goodguy.png';
import SearchBar from '../../ui/SearchBar';
import LinkScreenOffline from './link/LinkScreen_Offline';
import ZultsButton from '../../ui/ZultsButton';
import ScreenWrapper from '../../ui/ScreenWrapper';
import { NavbarBackRightText } from '../../ui/Navbar'; // ✅ use new navbar

export default function ShareScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('Users');
  const [phone, setPhone] = useState('');

  const users = [
    { name: 'TomasB.', image: tomas, isVerified: false },
    { name: 'Binkey', image: melany, isVerified: true },
    { name: 'MadMan', image: madman, isVerified: false },
    { name: 'Zults (demo)', image: goodguy, isVerified: false },
  ];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUserPress = (user) => {
    navigation.navigate('UserChat', { user });
  };

  const isPhoneValid = phone.length >= 8;

  const renderTabContent = () => {
    if (activeTab === 'Users') {
      return (
        <ScrollView style={styles.userList}>
          {filteredUsers.map((user, index) => (
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
        </ScrollView>
      );
    }

    if (activeTab === 'SMS') {
      return (
        <>
          <ScrollView contentContainerStyle={styles.smsWrapper}>
            <View style={styles.inputRow}>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>+44</Text>
              </View>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Add phone number"
                placeholderTextColor={colors.neutralText.subtext}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.smsInfo}>
              <Image source={infoIcon} style={styles.infoIcon} />
              <Text style={styles.infoText}>
                You have <Text style={styles.infoHighlight}>1 of 1</Text> SMS available this week
              </Text>
            </View>

            <View style={{ height: 120 }} />
          </ScrollView>

          <ZultsButton
            label="Continue"
            type="primary"
            size="large"
            fullWidth
            disabled={!isPhoneValid}
            onPress={() => navigation.navigate('ReviewSMS', { phone: '+44' + phone })}
            style={styles.continueButtonFixed}
          />
        </>
      );
    }

    if (activeTab === 'Link') {
      return <LinkScreenOffline navigation={navigation} />;
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenWrapper topPadding={0}>   {/* ✅ consistent with other flows */}
          <StatusBar barStyle="light-content" backgroundColor={colors.background.surface1} />

          {searchFocused && activeTab === 'Users' ? (
            <View style={styles.closeHeader}>
              <TouchableOpacity
                onPress={() => {
                  setSearch('');
                  setSearchFocused(false);
                  Keyboard.dismiss();
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image source={closeCross} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
          ) : (
            <NavbarBackRightText
              rightText="Invite"
              onRightPress={() => console.log('Invite pressed')}
            />
          )}

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

          <Text style={styles.pageTitle}>{activeTab}</Text>
          <Text style={styles.subtitle}>
            {activeTab === 'Users'
              ? 'Send or request Rezults from another user'
              : activeTab === 'SMS'
              ? 'Send someone an anonymous nudge via SMS'
              : 'Send your Rezults link to someone or add it to your dating profile. Even someone without the app can view it.'}
          </Text>

          {activeTab === 'Users' && (
            <SearchBar
              value={search}
              onChangeText={setSearch}
              onCancel={() => {
                setSearch('');
                setSearchFocused(false);
              }}
              onFocus={() => setSearchFocused(true)}
            />
          )}

          {renderTabContent()}
        </ScreenWrapper>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  closeHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
    marginRight: 4,
    marginTop: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.surface2,
    borderRadius: 18,
    height: 36,
    padding: 4,
    marginTop: 8,
    marginBottom: 24,
    alignSelf: 'stretch',
  },
  tabActive: {
    flex: 1,
    backgroundColor: colors.foreground.default,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActiveText: {
    ...typography.headlineRegular,
    color: colors.background.surface1,
  },
  tabInactive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabInactiveText: {
    ...typography.headlineRegular,
    color: colors.foreground.soft,
  },
  pageTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
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
  smsWrapper: {
    paddingBottom: 32,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[0],
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  codeBox: {
    backgroundColor: colors.background.surface2,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: colors.neutral[0],
  },
  codeText: {
    ...typography.bodyRegular,
    color: colors.foreground.default,
  },
  input: {
    flex: 1,
    ...typography.bodyRegular,
    color: colors.foreground.default,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  smsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D3E2D',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#1DCA7A',
  },
  infoText: {
    ...typography.captionSmallRegular,
    color: colors.neutral[0],
  },
  infoHighlight: {
    color: '#1DCA7A',
  },
  continueButtonFixed: {
    position: 'absolute',
    bottom: 52,
    left: 16,
    right: 16,
    zIndex: 100,
  },
});
