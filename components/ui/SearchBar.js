import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography } from '../../theme';
import searchIcon from '../../assets/images/search-icon.png';
import closeIcon from '../../assets/images/close-cross.png'; // reuse your existing cross

export default function SearchBar({ value, onChangeText, onCancel, onFocus }) {
  return (
    <View style={styles.container}>
      {/* Magnifying glass */}
      <Image source={searchIcon} style={styles.icon} />

      {/* Input */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by username"
        placeholderTextColor={colors.neutralText.subtext}
        onFocus={onFocus}
      />

      {/* Clear button only when typing */}
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Image source={closeIcon} style={styles.clearIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface2, // ✅ subtle pill bg
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
    height: 40,
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: colors.neutralText.subtext,
    marginRight: 6,
  },
  input: {
    flex: 1,
    ...typography.bodyRegular,
    color: colors.foreground.default,
    paddingVertical: 0, // ✅ centers text vertically like iOS
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: colors.neutralText.subtext,
    marginLeft: 6,
  },
});
