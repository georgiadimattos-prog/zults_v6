import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';

export default function ScreenWrapper({
  children,
  horizontalPadding = 16, // ✅ grid control
  topPadding = 0,         // ✅ default top spacing
  style,
}) {
  return (
    <SafeAreaView
      style={[
        styles.base,
        { paddingHorizontal: horizontalPadding, paddingTop: topPadding },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.background.surface1,
  },
});
