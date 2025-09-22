import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../theme';
import ZultsButton from '../../ui/ZultsButton';
import ScreenHeader from '../../ui/ScreenHeader';
import ScreenWrapper from '../../ui/ScreenWrapper';

export default function GetRezults_ConfirmScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { providerId, resultsLink } = route.params;

  const handleAddRezults = () => {
    navigation.popToTop(); // Or go to MainScreen
  };

  return (
    <ScreenWrapper>
      <ScreenHeader title="Your Rezults" subtitle="" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subheading}>
          By clicking “Add Rezults”, you confirm the information is yours and it is accurate.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLine}>John Doe</Text>
          <Text style={styles.cardLine}>Sexual Health London</Text>
          <Text style={styles.cardLine}>Tested on 12 Dec 2025</Text>
          <Text style={styles.cardRezults}>
            Tested negative: Gonorrhea, HIV, Syphilis, Chlamydia, Hep B, Hep C, Gardnerella, Trichomoniasis, Ureaplasma, Mycoplasma
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Important Notes</Text>
        <Text style={styles.infoBlock}>
          These Rezults were created from home-tests completed on 12 Dec 2025.
        </Text>
        <Text style={styles.infoBlock}>
          Some STIs take time to show up in results, meaning a recent infection might not be detected right away.
        </Text>
        <Text style={styles.infoBlock}>
          These are at-home tests. We can't fully guarantee who took the test. If you see a blue tick next to someone’s profile, it means:
        </Text>
        <Text style={styles.infoList}>• We verified their name matches their test provider’s results</Text>
        <Text style={styles.infoList}>• Their photo matches their official ID</Text>

        <Text style={styles.sectionTitle}>Window Periods</Text>
        <Text style={styles.infoList}>• Chlamydia & Gonorrhea: ~2 weeks</Text>
        <Text style={styles.infoList}>• Syphilis, Hep B & C: 6–12 weeks</Text>
        <Text style={styles.infoList}>• HIV: ~6 weeks</Text>
      </ScrollView>

      <ZultsButton
        label="Add Rezults"
        type="primary"
        size="large"
        fullWidth
        onPress={handleAddRezults}
        style={styles.button}
      />
      <ZultsButton
        label="Cancel"
        type="secondary"
        size="large"
        fullWidth
        onPress={() => navigation.goBack()}
        style={[styles.button, { bottom: 24 + 72 }]}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 160,
  },
  subheading: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.background.surface2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  cardLine: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    marginBottom: 4,
  },
  cardRezults: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
    marginTop: 8,
    lineHeight: 18,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    marginBottom: 8,
  },
  infoBlock: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
    marginBottom: 12,
    lineHeight: 18,
  },
  infoList: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
    marginBottom: 6,
    paddingLeft: 12,
  },
  button: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    zIndex: 100,
  },
});
