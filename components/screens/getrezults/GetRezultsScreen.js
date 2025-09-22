import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme';
import ScreenWrapper from '../../ui/ScreenWrapper';

export default function GetRezultsScreen() {
  return (
    <ScreenWrapper>
      <Text style={styles.text}>This is the Get Rezults Screen</Text>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
  },
});
