import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme'; // ✅ fixed path

export default function ScreenFooter({ children, style }) {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingBottom: 40,  // safe space for bottom nav
    width: '100%',
  },
});
