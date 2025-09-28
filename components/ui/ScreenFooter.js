import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export default function ScreenFooter({ children, style }) {
  return (
    <View style={[styles.footer, style]}>
      {/* Ensure children stack vertically with spacing */}
      {Array.isArray(children)
        ? children.map((child, idx) => (
            <View key={idx} style={idx > 0 ? styles.spacer : null}>
              {child}
            </View>
          ))
        : children}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,        // ✅ safe space
    paddingHorizontal: 16,    // ✅ consistent horizontal gutter
    backgroundColor: colors.background.surface1,
  },
  spacer: {
    marginTop: 12,            // ✅ vertical spacing between multiple buttons
  },
});
