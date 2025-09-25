import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';

export default function ZultsButton({
  label,
  onPress,
  type = 'primary', // primary | secondary
  size = 'large',   // large | medium | small
  fullWidth = true,
  disabled = false,
  style = {},
}) {
  const getButtonStyle = () => {
    const baseStyle = [styles.base, styles[size], styles[type]];
    if (fullWidth) baseStyle.push({ alignSelf: 'stretch' });
    if (disabled) baseStyle.push(styles.disabled);
    return [baseStyle, style];
  };

  const getTextStyle = () => {
    const textType =
      size === 'small'
        ? 'captionSmallRegular'
        : size === 'medium'
        ? 'buttonSmallMedium'
        : 'buttonLargeMedium';
    return [typography[textType], styles.text, styles[`${type}Text`]];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ✅ Sizes — locked global heights
  large: { height: 56, paddingHorizontal: 24 },
  medium: { height: 48, paddingHorizontal: 20 },
  small: { height: 40, paddingHorizontal: 16 },

  // Types
  primary: { backgroundColor: colors.neutral[0] },
  secondary: { backgroundColor: colors.background.surface2 },

  // Text
  text: { textAlign: 'center' },
  primaryText: { color: colors.button.activeLabelPrimary },
  secondaryText: { color: colors.foreground.default },

  // State
  disabled: {
    opacity: 0.4,
    minHeight: 56,  // 🔥 ensures same height when disabled
  },
});
