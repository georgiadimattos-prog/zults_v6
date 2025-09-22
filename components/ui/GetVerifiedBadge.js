import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography } from '../../theme';
import warningIcon from '../../assets/images/warning.png';

export default function GetVerifiedBadge() {
  return (
    <View style={styles.badge}>
      <Image source={warningIcon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">Get Verified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B1111',
    height: 24,
    width: 120,
    borderRadius: 17,
    paddingHorizontal: 10,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  text: {
    ...typography.caption,
    color: colors.error.default,
    includeFontPadding: false, // Native-only
    maxWidth: '100%',
  },
});