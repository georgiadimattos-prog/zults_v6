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
}) {
  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {icon && <Image source={icon} style={styles.icon} />}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.foreground.muted} // 👈 softer placeholder
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.subheadlineRegular,       // 👈 slightly larger, softer label
    color: colors.foreground.soft,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: colors.background.surface2, // 👈 subtle filled bg, no border
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    ...typography.bodyRegular,
    color: colors.foreground.default,
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: colors.foreground.muted, // 👈 lighter tint
    marginRight: 8,
  },
});
