import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography } from '../../theme';
import searchIcon from '../../assets/images/search-icon.png';

export default function SearchBar({ value, onChangeText, onCancel, onFocus }) {

  return (
    <View style={[styles.wrapper, value.length > 0 && styles.wrapperFocused]}>
      <View style={styles.iconContainer}>
        <Image source={searchIcon} style={styles.icon} />
      </View>

      <View style={styles.inputBlock}>
  {value.length > 0 && (
    <Text style={styles.label}>Search by username</Text>
  )}
  <TextInput
    style={styles.input}
    value={value}
    onChangeText={onChangeText}
    placeholder={value.length > 0 ? '' : 'Search by username'}
    placeholderTextColor={colors.neutralText.subtext}
    onFocus={() => {
      onFocus?.();
    }}
    onBlur={() => {
      if (value.length === 0) onCancel?.();
    }}
  />
</View>

{/*
<View>
  {value.length > 0 && (
    <TouchableOpacity onPress={onCancel}>
      <Text style={styles.cancel}>Cancel</Text>
    </TouchableOpacity>
  )}
</View>
*/}
</View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: colors.neutral[900],
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  wrapperFocused: {
    borderColor: colors.neutral[0],
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: colors.neutralText.subtext,
  },
  inputBlock: {
    flex: 1,
    marginLeft: 8,
  },
  label: {
    ...typography.captionSmallRegular,
    color: colors.neutralText.subtext,
    marginBottom: 2,
  },
  input: {
    ...typography.bodyRegular,
    color: colors.foreground.default,
    padding: 0,
  },
  cancel: {
    ...typography.captionSmallRegular,
    color: colors.neutralText.subtext,
    marginLeft: 8,
  },
});