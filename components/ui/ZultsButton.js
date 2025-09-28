import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import * as Haptics from 'expo-haptics';

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

    const safeStyle = typography[textType] || typography.bodyMedium;

    return [safeStyle, styles.text, styles[`${type}Text`]];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={() => {
        if (!disabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // ✅ cleaner haptic
          onPress && onPress();
        }
      }}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()} allowFontScaling={false}>
        {String(label)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ✅ Sizes — global heights only (no paddingHorizontal)
  large: { height: 56 },
  medium: { height: 48 },
  small: { height: 40 },

  // Types
  primary: { backgroundColor: colors.neutral[0] },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.2,
    borderColor: colors.foreground.soft,
  },

  // Text
  text: { textAlign: 'center', textAlignVertical: 'center' },
  primaryText: { color: colors.button.activeLabelPrimary },
  secondaryText: { color: colors.foreground.default },

  // Disabled
  disabled: {
    opacity: 0.4,
    minHeight: 56,
  },
});
