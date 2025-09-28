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
import { NavbarBackRightText } from '../../../ui/Navbar'; // ✅ fixed path

export default function SMSScreen() {
  const [phone, setPhone] = useState('');
  console.log("Loaded SMS screen!");   // 👈 check Metro logs
  const navigation = useNavigation();

  const isValid = phone.length >= 8;

  return (
    <>
      {/* Main content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScreenWrapper topPadding={0}>
            <ScrollView
              contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: 120 }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Navbar */}
              <NavbarBackRightText
                rightText="Invite"
                onRightPress={() => console.log('Invite pressed')}
              />

              {/* Title + subtitle */}
              <View style={styles.headerBlock}>
                <Text allowFontScaling={false} style={styles.pageTitle}>
                  SMS
                </Text>
                <Text allowFontScaling={false} style={styles.subtitle}>
                  Send someone an anonymous nudge to get tested.
                </Text>
              </View>

 {/* ✅ Fresh input + info block */}
<View style={styles.section}>
  <Text style={styles.label}>Phone number</Text>
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      value={phone}
      onChangeText={setPhone}
      placeholder="Add phone number"
      placeholderTextColor={colors.neutralText.subtext}
      keyboardType="phone-pad"
    />
  </View>

  <View style={styles.infoBox}>
    <Image source={infoIcon} style={styles.infoIcon} />
    <Text style={styles.infoText}>
      You have <Text style={styles.infoHighlight}>1 of 1</Text> SMS available this week
    </Text>
  </View>
</View>

            </ScrollView>
          </ScreenWrapper>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* ✅ Footer pinned bottom */}
      <ScreenFooter>
        <ZultsButton
          label="Continue"
          type="primary"
          size="large"
          fullWidth
          disabled={!isValid}
          onPress={() => navigation.navigate('ReviewSMSRequest', { phone })}
        />
      </ScreenFooter>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16, // ✅ same gutter as Rezults screens
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
  },

  // ✅ Section wrapper for input + info banner
  section: {
    paddingHorizontal: 16, // consistent gutter
    marginBottom: 32,
  },

  // ✅ Label above the input
  label: {
    ...typography.captionSmallRegular,
    color: colors.neutralText.label,
    marginBottom: 8,
  },

  // ✅ Input wrapper (Apple-style)
  inputWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)', // subtle frosted bg
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  input: {
    ...typography.bodyRegular,
    color: colors.foreground.default,
  },

  // ✅ Info banner
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D3E2D',
    padding: 12,
    borderRadius: 12,
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