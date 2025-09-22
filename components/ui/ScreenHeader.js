import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../../theme';
import backArrow from '../../assets/images/navbar-arrow.png';

export default function ScreenHeader({
  title,
  subtitle,
  showBack = true,
  rightIcon,
  rightText,
  onRightPress,
  subtitleMargin = 40,
  titleMarginTop = 12, // ✅ new prop
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Top row: back + right action */}
      <View style={styles.topRow}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={backArrow} style={styles.backIcon} />
          </TouchableOpacity>
        )}

        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
            <Image source={rightIcon} style={styles.rightIcon} />
          </TouchableOpacity>
        )}

        {rightText && (
          <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
            <Text style={styles.rightText}>{rightText}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Title + Subtitle */}
      <View style={{ marginTop: titleMarginTop }}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? (
          <Text style={[styles.subtitle, { marginBottom: subtitleMargin }]}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,       // space for status bar
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 0,
    marginLeft: -4,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: colors.neutral[0],
  },
  rightButton: {
    padding: 8,
  },
  rightIcon: {
    width: 24,
    height: 24,
    tintColor: colors.neutral[0],
  },
  rightText: {
    ...typography.bodyRegular,
    color: colors.info.onContainer,
  },
  title: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
  },
});
