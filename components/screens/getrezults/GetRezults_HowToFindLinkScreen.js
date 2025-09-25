import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../theme';
import ScreenWrapper from '../../ui/ScreenWrapper';
import Navbar from '../../ui/Navbar';

const STEPS = {
  shl: [
    'Open your SHL Account and your latest results.',
    'Scroll to the end of the report.',
    'Tap “Share results link”.',
    'Copy the generated link.',
    'Paste it into the previous screen.',
    'Only the link of your latest result can be used. Results older than 3 months are not valid.',
  ],
  randox: [
    'Sign in to your Randox Account.',
    'Open “Screening history” → “View all screenings”.',
    'Tap “View” on your latest result.',
    'Scroll and tap “Share my results”.',
    'Copy the link and paste it into the previous screen.',
    'Only the link of your latest result can be used. Results older than 3 months are not valid.',
  ],
  nhs: [
    'Open your NHS results portal.',
    'Find your latest results.',
    'Copy the public share link.',
    'Paste it into the previous screen.',
    'Only the link of your latest result can be used. Results older than 3 months are not valid.',
  ],
};

export default function GetRezults_HowToFindLinkScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const providerId = route.params?.providerId ?? 'shl';

  const steps = useMemo(() => STEPS[providerId] || STEPS.shl, [providerId]);

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar />

      <Text allowFontScaling={false} style={styles.pageTitle}>
  How to find link
</Text>
<Text allowFontScaling={false} style={styles.subtitle}>
  {steps[0]}   {/* 👈 use the first step as the subtitle */}
</Text>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {steps.slice(1).map((s, i) => (
  <Text key={i} style={[styles.step, i === 0 && { marginTop: 4 }]}>
    {i + 1}. {s}
  </Text>
))}

      </ScrollView>

      {/* ✅ Fixed video section at bottom */}
      <View style={styles.videoContainer}>
        <Text style={styles.tutorialTitle}>Watch the video tutorial</Text>
        <View style={styles.tutorialBox}>
          <Text style={styles.tutorialStub}>Video placeholder</Text>
        </View>
      </View>
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
  videoContainer: {
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
  pageTitle: {
  ...typography.largeTitleMedium,
  color: colors.foreground.default,
  marginTop: 24,
  marginBottom: 8,
},
subtitle: {
  ...typography.bodyRegular,
  color: colors.foreground.soft,
  marginBottom: 24,
},

});
