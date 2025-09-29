import React from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../../theme';
import ScreenWrapper from '../../../ui/ScreenWrapper';
import Navbar from '../../../ui/Navbar';
import ZultsButton from '../../../ui/ZultsButton';

export default function LinkScreenShareSheet() {
  const route = useRoute();
  const link = route.params?.link || 'https://myrezults.com/share/demo';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Here’s my Rezults link: ${link}`,
        url: link,
        title: 'My Rezults',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar />

      <View style={styles.content}>

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
    paddingHorizontal: 16,
    marginTop: 24,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
    textAlign: 'center',
  },
});
