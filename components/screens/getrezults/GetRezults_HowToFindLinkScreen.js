import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../theme';
import ScreenHeader from '../../ui/ScreenHeader';
import ScreenWrapper from '../../ui/ScreenWrapper';

const STEPS = {
  shl: [
    'Open your SHL Account and your latest results.',
    'Scroll to the end of the report.',
    'Tap “Share results link”.',
    'Copy the generated link.',
    'Paste it into the previous screen.',
  ],
  randox: [
    'Sign in to your Randox Account.',
    'Open “Screening history” → “View all screenings”.',
    'Tap “View” on your latest result.',
    'Scroll and tap “Share my results”.',
    'Copy the link and paste it into the previous screen.',
  ],
  nhs: [
    'Open your NHS results portal.',
    'Find your latest results.',
    'Copy the public share link.',
    'Paste it into the previous screen.',
  ],
};

export default function GetRezults_HowToFindLinkScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const providerId = route.params?.providerId ?? 'shl';

  const steps = useMemo(() => STEPS[providerId] || STEPS.shl, [providerId]);

  return (
    <ScreenWrapper>
      <ScreenHeader
        title="How to find your link?"
        subtitle={null}
        titleMarginTop={24}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {steps.map((s, i) => (
          <Text key={i} style={[styles.step, i === 0 && { marginTop: 4 }]}>
            {i + 1}. {s}
          </Text>
        ))}

        <Text style={styles.notice}>
          Only the link of your latest result can be used. Results older than 3 months are not valid.
        </Text>

        <Text style={styles.tutorialTitle}>Watch the video tutorial</Text>
        <View style={styles.tutorialBox}>
          <Text style={styles.tutorialStub}>Video placeholder</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  step: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    lineHeight: 20,
    marginBottom: 8,
  },
  notice: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
    marginTop: 8,
    marginBottom: 24,
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
});
