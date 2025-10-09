import React from "react";
import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import { colors, typography } from "../../theme";

export default function ZultsInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  icon,
  secureTextEntry = false,
  style,
  ...props
}) {
  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {icon && <Image source={icon} style={styles.icon} />}
        <TextInput
  style={[styles.input, typography.inputText]}
  value={value}
  onChangeText={onChangeText}
  placeholder={placeholder}
  placeholderTextColor={colors.foreground.muted}
  keyboardType={keyboardType}
  secureTextEntry={secureTextEntry}
  autoCapitalize="none"
  autoCorrect={false}
  {...props}
/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: colors.foreground.default,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: colors.foreground.muted,
    marginRight: 8,
  },
});
