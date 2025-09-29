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
    borderRadius: 20,
    paddingHorizontal: 12,   // ⬅️ increased
    paddingVertical: 4,      // ⬅️ added vertical padding
  },
  icon: {
    width: 18,   // ⬅️ slightly bigger
    height: 18,
    marginRight: 8, // ⬅️ more space between icon and text
  },
  text: {
    ...typography.captionSmallRegular, // ⬅️ use smaller, balanced style
    color: colors.info.onContainer,
    letterSpacing: -0.06,
    includeFontPadding: false,
  },
});