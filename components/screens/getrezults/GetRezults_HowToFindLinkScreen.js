import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../theme';
import ScreenWrapper from '../../ui/ScreenWrapper';
import Navbar from '../../ui/Navbar';

const COMMON_STEPS = [
  'Open your results report.',
  'Scroll to the end of the report.',
  'Tap “Share results link.”',
  'Copy the generated link.',
  'Paste it into the previous screen.',
  'Only your latest results link can be used. Links older than 3 months are not valid.',
];

const PROVIDER_INTROS = {
  shl: 'Sign in to your SHL account.',
  randox: 'Sign in to your Randox account.',
  pp: 'Sign in to your Planned Parenthood account.',
};

const PROVIDER_NAMES = {
  shl: 'Sexual Health London',
  randox: 'Randox Health',
  pp: 'Planned Parenthood',
};

export default function GetRezults_HowToFindLinkScreen() {
  const route = useRoute();
  const providerId = route.params?.providerId ?? 'shl';

  const steps = useMemo(() => {
    const intro = PROVIDER_INTROS[providerId] || 'Open your provider account.';
    return [intro, ...COMMON_STEPS];
  }, [providerId]);

  const providerName = useMemo(
    () => PROVIDER_NAMES[providerId] || 'your provider',
    [providerId]
  );

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar />

      <ScrollView
        contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Page title + subtitle */}
        <View style={styles.headerBlock}>
          <Text style={styles.pageTitle} allowFontScaling={false}>
            How to find your link
          </Text>
          <Text style={styles.subtitle}>
            Follow these steps in your {providerName} account to find and copy your results link.
          </Text>
        </View>

        {/* Steps */}
        {steps.map((s, i) => (
          <Text key={i} style={styles.step}>
            {i + 1}. {s}
          </Text>
        ))}

        {/* Video tutorial section */}
        <View style={styles.videoContainer}>
          <Text style={styles.tutorialTitle}>Watch the video tutorial</Text>
          <View style={styles.tutorialBox}>
            <Text style={styles.tutorialStub}>Video placeholder</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
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
    ...typography.bodyRegular, // 👈 same as SelectProvider
    color: colors.foreground.soft,
    marginBottom: 24,
    lineHeight: 22,
  },
  step: {
    ...typography.bodyRegular, // 👈 match subtitle size/weight
    color: colors.foreground.soft,
    lineHeight: 22,
    marginBottom: 12,
  },
  videoContainer: {
    marginTop: 32,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.background.surface2,
  },
  tutorialTitle: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    marginBottom: 12,
  },
  tutorialBox: {
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.background.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorialStub: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
  },
  content: {
    paddingHorizontal: 16, // ✅ consistent gutter
  },
});
