import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../theme';
import ScreenHeader from '../../ui/ScreenHeader';
import ScreenWrapper from '../../ui/ScreenWrapper';

// (Optional) If you add a tutorial thumbnail later, import it here
// import tutorialThumb from '../../../assets/images/tutorial-thumb.png';

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
      {/* Navbar: back arrow; right side empty; Big title is “How to find your link?” */}
      <ScreenHeader
        title="How to find your link?"
        subtitle={null}
        titleMarginTop={24}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {steps.map((s, i) => (
          <Text key={i} style={[styles.step, i === 0 && { marginTop: 4 }]}>
            {i + 1}. {s}
          </Text>
        ))}

        <Text style={styles.notice}>
          Only the link of your latest result can be used. Results older than 3 months are not valid.
        </Text>

        {/* Tutorial block (placeholder). Replace with your image/video when ready. */}
        <Text style={styles.tutorialTitle}>Watch the video tutorial</Text>
        <View style={styles.tutorialBox}>
          {/* <Image source={tutorialThumb} style={styles.tutorialImg} resizeMode="cover" /> */}
          <Text style={styles.tutorialStub}>Video placeholder</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 120,
  },
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
  // If you add a real image:
  // tutorialImg: { width: '100%', height: '100%', borderRadius: 12 },
});
