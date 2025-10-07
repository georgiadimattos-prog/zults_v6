import React from "react";
import { View, Text, StyleSheet, Share } from "react-native";
import { useRoute } from "@react-navigation/native";
import { colors, typography } from "../../../../theme";
import ScreenWrapper from "../../../ui/ScreenWrapper";
import Navbar from "../../../ui/Navbar";
import ZultsButton from "../../../ui/ZultsButton";

export default function LinkScreenShareSheet() {
  const route = useRoute();
  const link = route.params?.link || "https://demorezultslink";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Here’s my Rezults link: ${link}`,
        url: link,
        title: "My Rezults",
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar />

      <View style={styles.content}>
        {/* ─── Page title + subtitle ─── */}
        <View style={styles.headerBlock}>
          <Text
            style={typography.largeTitleMedium}
            allowFontScaling={false} // ✅ lock Apple titles
          >
            Rezults-link
          </Text>

          <Text
            style={[typography.bodyRegular, styles.subtitle]}
            allowFontScaling
            maxFontSizeMultiplier={1.3} // ✅ accessible body text
          >
            You can share your Rezults link directly from here.
          </Text>
        </View>

        <ZultsButton
          label="Share Link"
          type="primary"
          size="large"
          fullWidth
          onPress={handleShare}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    color: colors.foreground.soft,
    textAlign: "center",
  },
});