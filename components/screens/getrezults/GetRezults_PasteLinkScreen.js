import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../theme';
import ZultsButton from '../../ui/ZultsButton';
import ScreenWrapper from '../../ui/ScreenWrapper';
import ScreenFooter from '../../ui/ScreenFooter';
import { NavbarBackRightText } from '../../ui/Navbar';

const PROVIDER_NAMES = {
  shl: 'Sexual Health London',
  randox: 'Randox Health',
  pp: 'Planned Parenthood',
};

const COMMON_INSTRUCTIONS =
  'Tap “Share results link” in your results report and paste it here. Only your latest results link can be used.';

export default function GetRezults_PasteLinkScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const providerId = route.params?.providerId ?? 'shl';

  const [link, setLink] = useState('');

  const providerName = useMemo(
    () => PROVIDER_NAMES[providerId] || 'Your Provider',
    [providerId]
  );

  const subtitle = `From ${providerName}. ${COMMON_INSTRUCTIONS}`;

  const handleContinue = () => {
    if (!link) return;
    navigation.navigate('GetRezultsLoading', { providerId, resultsLink: link });
  };

  return (
  <KeyboardAvoidingView
  style={{ flex: 1, backgroundColor: colors.background.surface1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScreenWrapper topPadding={0}>
      {/* Navbar always visible */}
      <NavbarBackRightText
        rightText="How to find your link?"
        onRightPress={() =>
          navigation.navigate('GetRezultsHowToFindLink', { providerId })
        }
      />

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: 120 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Page title + subtitle */}
        <View style={styles.headerBlock}>
          <Text style={styles.pageTitle}>
            Add Rezults
          </Text>
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder="Paste link here…"
          placeholderTextColor={colors.neutralText.subtext}
          value={link}
          onChangeText={setLink}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => {
            if (!link) {
              setLink('https://demo.myrezults.com/provider/ID32');
            }
          }}
        />
      </ScrollView>

      {/* Footer with Continue button */}
      <ScreenFooter>
        <ZultsButton
          label="Add Rezults"
          type="primary"
          size="large"
          fullWidth
          onPress={handleContinue}
          disabled={link.trim().length < 5}
        />
      </ScreenFooter>
    </ScreenWrapper>
  </TouchableWithoutFeedback>
</KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
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
input: {
  ...typography.bodyRegular,
  borderWidth: 0,
  borderRadius: 20,
  paddingHorizontal: 16,
  paddingVertical: 14,
  color: colors.foreground.default,
  backgroundColor: 'rgba(255,255,255,0.08)',
  marginBottom: 24,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
},
  content: {
  paddingHorizontal: 16,  // ✅ consistent Apple gutter
},
});
