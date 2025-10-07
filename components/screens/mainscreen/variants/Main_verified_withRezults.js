import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../../../theme';
import VerifiedBadge from '../../../ui/VerifiedBadge';
import ScreenWrapper from '../../../ui/ScreenWrapper';

export default function MainVerifiedWithRezults() {
  return (
    <ScreenWrapper>
      <VerifiedBadge />
      <Text style={styles.text}>Verified + Has Rezults</Text>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginTop: 16,
  },
});
