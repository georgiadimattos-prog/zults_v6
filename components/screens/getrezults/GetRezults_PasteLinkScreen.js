import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../theme';
import ZultsButton from '../../ui/ZultsButton';
import ScreenHeader from '../../ui/ScreenHeader';
import ScreenWrapper from '../../ui/ScreenWrapper';
import ScreenFooter from '../../ui/ScreenFooter';

const PROVIDER_TITLES = {
  shl: 'Sexual Health London',
  randox: 'Randox Health',
  nhs: 'NHS',
};

const PROVIDER_PARAGRAPHS = {
  shl:
    'In your SHL Account, at the end of your results report, click “Share results link” and paste it here. Only the link of your latest result can be used. Results older than 3 months are not valid.',
  randox:
    'Sign in to your Randox Account. Open Screening history → View all screenings → View your latest results, then tap “Share my results” and paste the generated link here. Only the latest result works.',
  nhs:
    'Open your NHS results portal and copy the public share link for your latest test. Paste it here. Older than 3 months is not valid.',
};

export default function GetRezults_PasteLinkScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const providerId = route.params?.providerId ?? 'shl';

  const [link, setLink] = useState('');

  const providerTitle = useMemo(
    () => PROVIDER_TITLES[providerId] || 'Your Provider',
    [providerId]
  );
  const paragraph = useMemo(
    () => PROVIDER_PARAGRAPHS[providerId] || PROVIDER_PARAGRAPHS.shl,
    [providerId]
  );

  const handleContinue = () => {
    if (!link) return;
    navigation.navigate('GetRezultsLoading', { providerId, resultsLink: link });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenWrapper>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Navbar row */}
            <ScreenHeader
              title=""
              subtitle={null}
              rightText="How to find your link?"
              onRightPress={() =>
                navigation.navigate('GetRezultsHowToFindLink', { providerId })
              }
            />

            {/* Page title + paragraph */}
            <Text allowFontScaling={false} style={styles.pageTitle}>
              {providerTitle}
            </Text>
            <Text allowFontScaling={false} style={styles.paragraph}>
              {paragraph}
            </Text>

            {/* Input */}
            <Text allowFontScaling={false} style={styles.label}>
              Add your results link
            </Text>
            <TextInput
              style={styles.input}
              placeholder="https://www.shl.uk/share/…"
              placeholderTextColor={colors.neutralText.subtext}
              value={link}
              onChangeText={setLink}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              allowFontScaling={false}
            />
          </ScrollView>

          {/* Footer with Continue button */}
          <ScreenFooter>
            <ZultsButton
              label="Continue"
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
  pageTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginTop: 24,
    marginBottom: 16,
  },
  paragraph: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 16,
    lineHeight: 20,
  },
  label: {
    ...typography.captionSmallRegular,
    color: colors.neutralText.label,
    marginBottom: 6,
  },
  input: {
    ...typography.bodyRegular,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.foreground.default,
    backgroundColor: 'rgba(20,20,20,0.5)',
    marginBottom: 24,
  },
});
