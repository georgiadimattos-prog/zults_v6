import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { colors, typography } from '../../../../theme';
import ScreenWrapper from '../../../ui/ScreenWrapper';

export default function LinkScreenShareSheet() {
  const link = 'https://myrezults.com/share/myrezults/binkey';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my Rezults link: ${link}`,
        url: link,
        title: 'My Rezults',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Link</Text>
      <Text style={styles.subtitle}>
        You can send your Rezults link to someone or add it to your dating profile.
        Even someone without the app can view it.
      </Text>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share Link</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 32,
  },
  shareButton: {
    backgroundColor: colors.neutral[0],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareButtonText: {
    ...typography.bodyLarge,
    color: colors.button.activeLabelPrimary,
  },
});
