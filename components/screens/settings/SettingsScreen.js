// components/screens/settings/SettingsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Settings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.surface1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.h2,
    color: colors.foreground.default,
  },
});
