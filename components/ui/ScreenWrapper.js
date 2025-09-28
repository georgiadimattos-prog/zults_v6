import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';

export default function ScreenWrapper({ children, topPadding = 0, style }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: topPadding }, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.surface1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,   // ✅ grid inset for content only
  },
});
