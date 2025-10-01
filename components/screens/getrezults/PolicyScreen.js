import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import ZultsButton from "../../ui/ZultsButton";

export default function PolicyScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper topPadding={0}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.headerBlock}>
          <Text allowFontScaling={false} style={styles.pageTitle}>
            Rezults Policy
          </Text>
          <Text style={styles.subtitle}>
            Rezults are private sexual health information. Misuse can cause
            serious harm. Always add only your own Rezults.
          </Text>
        </View>

        {/* Policy content */}
        <Text style={styles.sectionTitle}>Your Responsibility</Text>
        <Text style={styles.infoBlock}>
          • By adding Rezults, you confirm the information is yours and accurate.{"\n"}
          • Never upload or share someone else’s test results.{"\n"}
          • Misrepresentation of your sexual health puts others at risk.
        </Text>

        <Text style={styles.sectionTitle}>Limitations of Testing</Text>
        <Text style={styles.infoBlock}>
          • Some STIs take time to show up in results — a recent infection may not be detected immediately.{"\n"}
          • These Rezults reflect your status only on the date of the test.{"\n"}
          • Regular testing is the only way to stay up to date.
        </Text>

        <Text style={styles.sectionTitle}>ID Verification</Text>
        <Text style={styles.infoBlock}>
          • A blue tick on a Rezults profile means we verified the name and photo against official ID.{"\n"}
          • Verification increases trust but does not guarantee who took the test.
        </Text>

        <Text style={styles.sectionTitle}>Window Periods</Text>
        <Text style={styles.infoBlock}>
          • Chlamydia & Gonorrhea: ~2 weeks{"\n"}
          • Syphilis, Hep B & C: 6–12 weeks{"\n"}
          • HIV: ~6 weeks
        </Text>
      </ScrollView>

      {/* Footer */}
      <ZultsButton
        label="Close"
        type="primary"
        size="large"
        fullWidth
        onPress={() => navigation.goBack()}
        style={styles.button}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 160,
  },
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  pageTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.bodyRegular,   // ✅ scalable, same as infoBlock
    color: colors.foreground.soft,
    marginBottom: 24,
    lineHeight: 20,
  },
  sectionTitle: {
    ...typography.title3Regular,
    color: colors.foreground.default,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  infoBlock: {
    ...typography.bodyRegular,   // ✅ same as subtitle
    color: colors.foreground.soft,
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  button: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 40,
  },
});
