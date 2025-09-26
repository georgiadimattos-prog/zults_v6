import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../../../../theme';
import infoIcon from '../../../../assets/images/info-icon.png';
import ZultsButton from '../../../ui/ZultsButton';
import ScreenWrapper from '../../../ui/ScreenWrapper';
import ScreenFooter from '../../../ui/ScreenFooter';
import Navbar, { NavbarBackRightText } from '../../ui/Navbar'; // ✅ import both

export default function SMSScreen() {
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  const isValid = phone.length >= 8;

  // 🔎 Log phone state on every render
  console.log("DEBUG [SMSScreen] phone state:", phone, "typeof:", typeof phone);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenWrapper topPadding={0}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <NavbarBackRightText
              rightText="Invite"
              onRightPress={() => console.log('Invite pressed')}
            />

            <Text style={styles.subtitle}>
              Send someone an anonymous nudge to get tested
            </Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={(val) => {
                  console.log("DEBUG [SMSScreen] onChangeText value:", val, "typeof:", typeof val);
                  setPhone(val);
                }}
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
          </ScrollView>

          {/* Footer with CTA */}
          <ScreenFooter>
            <ZultsButton
              label="Continue"
              type="primary"
              size="large"
              fullWidth
              disabled={!isValid}
              onPress={() => {
                console.log("DEBUG [SMSScreen] navigating with phone param:", phone, "typeof:", typeof phone);
                navigation.navigate('ReviewSMSRequest', { phone });
              }}
            />
          </ScreenFooter>
        </ScreenWrapper>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: colors.neutral[0],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  input: {
    ...typography.bodyRegular,
    color: colors.foreground.default,
  },
  smsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D3E2D',
    padding: 12,
    borderRadius: 12,
    marginBottom: 32,
    flexWrap: 'wrap',
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