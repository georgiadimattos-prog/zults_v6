import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography } from '../../theme';
import verifiedIcon from '../../assets/images/verified-icon.png';

export default function VerifiedBadge() {
  return (
    <View style={styles.badge}>
      <Image source={verifiedIcon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">Verified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.info.container,
    height: 24,
    width: 120,
    borderRadius: 17,
    paddingHorizontal: 10,
    width: 88,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  text: {
    ...typography.caption,
    color: colors.info.onContainer,
    letterSpacing: -0.06,
    includeFontPadding: false, // Native-only
    maxWidth: '100%',
  },
});