import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../../../theme';
import ScreenWrapper from '../../../ui/ScreenWrapper';

export default function MainUnverifiedWithRezults() {
  return (
    <ScreenWrapper>
      <Text style={styles.text}>Unverified + Has Rezults</Text>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
  },
});
