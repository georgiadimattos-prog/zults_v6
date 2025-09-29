import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';   // ✅ modern clipboard
import { colors, typography } from '../../../../theme';
import ScreenWrapper from '../../../ui/ScreenWrapper';
import Navbar from '../../../ui/Navbar';

export default function LinkScreenSuccess() {
  const link = 'https://myrezults.com/share/jonster/id8765';

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(link);   // ✅ async clipboard
    Alert.alert('Copied!', 'Link copied to clipboard.');
  };

  return (
    <ScreenWrapper topPadding={0}>
      {/* ✅ standardized navbar */}
      <Navbar title="Link" />


      <View style={styles.linkCard}>
        <View style={styles.linkRow}>
          <Text style={styles.linkLabel}>Rezults-link</Text>
          <Text style={styles.linkStatus}>● Online</Text>
        </View>

        <View style={styles.linkBox}>
          <Text style={styles.linkText}>.../share/jonster/id8765</Text>
          <TouchableOpacity onPress={copyToClipboard}>
            <Text style={styles.copyIcon}>📋</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.stopButton}>
          <Text style={styles.stopButtonText}>Stop Sharing</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginTop: 16,    // ✅ consistent breathing room below navbar
    marginBottom: 24,
  },
  linkCard: {
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    padding: 20,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  linkLabel: {
    ...typography.bodyLarge,
    color: colors.foreground.default,
  },
  linkStatus: {
    ...typography.caption,
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
    ...typography.bodyLarge,
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
    ...typography.bodyLarge,
    color: colors.button.activeLabelPrimary,
  },
});
