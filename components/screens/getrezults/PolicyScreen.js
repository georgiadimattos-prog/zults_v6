import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import ScreenFooter from "../../ui/ScreenFooter";
import ZultsButton from "../../ui/ZultsButton";

export default function PolicyScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper topPadding={0}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + subtitle */}
        <View style={styles.headerBlock}>
          <Text style={styles.title} allowFontScaling={false}>
            Rezults Policy
          </Text>
          <Text
            style={[typography.bodyRegular, styles.subtitle]}
            maxFontSizeMultiplier={1.3}
          >
            Rezults are private sexual health information. Misuse can cause
            serious harm. Always add only your own Rezults.
          </Text>
        </View>

        {/* Policy content */}
        <Text style={styles.sectionTitle}>Your Responsibility</Text>
        <Text style={styles.infoBlock} maxFontSizeMultiplier={1.3}>
          • By adding Rezults, you confirm the information is yours and accurate.{"\n"}
          • Never upload or share someone else’s test results.{"\n"}
          • Misrepresentation of your sexual health puts others at risk.
        </Text>

        <Text style={styles.sectionTitle}>Limitations of Testing</Text>
        <Text style={styles.infoBlock} maxFontSizeMultiplier={1.3}>
          • Some STIs take time to show up in results — a recent infection may not be detected immediately.{"\n"}
          • These Rezults reflect your status only on the date of the test.{"\n"}
          • Regular testing is the only way to stay up to date.
        </Text>

        <Text style={styles.sectionTitle}>ID Verification</Text>
        <Text style={styles.infoBlock} maxFontSizeMultiplier={1.3}>
          • A blue tick on a Rezults profile means we verified the name and photo against official ID.{"\n"}
          • Verification increases trust but does not guarantee who took the test.
        </Text>

        <Text style={styles.sectionTitle}>Window Periods</Text>
        <Text style={styles.infoBlock} maxFontSizeMultiplier={1.3}>
          • Chlamydia & Gonorrhoea: ~2 weeks{"\n"}
          • Syphilis, Hep B & C: 6–12 weeks{"\n"}
          • HIV: ~6 weeks
        </Text>
      </ScrollView>

      {/* Footer */}
      <ScreenFooter>
        <ZultsButton
          label="Close"
          type="primary"
          size="large"
          fullWidth
          onPress={() => navigation.goBack()}
        />
      </ScreenFooter>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 140,
  },

  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
    paddingHorizontal: 16,
  },

  title: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 8,
    allowFontScaling: false,
  },

  subtitle: {
    color: colors.foreground.soft,
    flexWrap: "wrap",
  },

  sectionTitle: {
    ...typography.title4Medium,
    color: colors.foreground.default,
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  infoBlock: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
