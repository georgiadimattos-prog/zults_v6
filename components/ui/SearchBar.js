import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors, typography } from '../../theme';
import searchIcon from '../../assets/images/search-icon.png';
import closeIcon from '../../assets/images/close-cross.png';

export default function SearchBar({ value, onChangeText, onCancel, onFocus }) {
  return (
    <View style={styles.container}>
      {/* Magnifying glass */}
      <Image source={searchIcon} style={styles.icon} />

      {/* Input */}
      <TextInput
        style={[styles.input, typography.inputText]}   // ✅ same baseline as ZultsInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by username"
        placeholderTextColor={colors.foreground.muted} // ✅ muted grey, same as Paste Link
        onFocus={onFocus}
        maxFontSizeMultiplier={1.2}                    // ✅ capped scaling
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Clear button */}
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
    backgroundColor: colors.background.surface2,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
    minHeight: 40,
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: colors.neutralText.subtext,
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: colors.foreground.default,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: colors.neutralText.subtext,
    marginLeft: 6,
  },
});
