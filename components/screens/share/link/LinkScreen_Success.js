import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, typography } from '../../../../theme';
import ScreenWrapper from '../../../ui/ScreenWrapper';
import Navbar from '../../../ui/Navbar';

export default function LinkScreenSuccess() {
  const link = 'https://demolink';

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(link);
    Alert.alert('Copied!', 'Link copied to clipboard.');
  };

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar title="Link" />

      <View style={styles.linkCard}>
        <View style={styles.linkRow}>
          <Text style={styles.linkLabel} maxFontSizeMultiplier={1.2}>
            Rezults-link
          </Text>
          <Text style={styles.linkStatus} maxFontSizeMultiplier={1.2}>
            ● Online
          </Text>
        </View>

        <View style={styles.linkBox}>
          <Text
            style={styles.linkText}
            numberOfLines={1}
            ellipsizeMode="middle"
            maxFontSizeMultiplier={1.2}
          >
            .../share/jonster/id8765
          </Text>
          <TouchableOpacity onPress={copyToClipboard}>
            <Text style={styles.copyIcon} maxFontSizeMultiplier={1.2}>
              📋
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.stopButton}>
          <Text style={styles.stopButtonText} maxFontSizeMultiplier={1.2}>
            Stop Sharing
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  linkCard: {
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 24,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  linkLabel: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
  },
  linkStatus: {
    ...typography.captionSmallRegular,
    color: '#00D775',
  },
  linkBox: {
    backgroundColor: colors.background.surface3,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    ...typography.inputText,
    color: colors.foreground.default,
  },
  copyIcon: {
    fontSize: 18,
    color: colors.foreground.default,
  },
  stopButton: {
    backgroundColor: colors.neutral[0],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopButtonText: {
    ...typography.bodyMedium,
    color: colors.button.activeLabelPrimary,
  },
});