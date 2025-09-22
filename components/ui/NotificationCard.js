import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography } from '../../theme';
import closeIcon from '../../assets/images/close-square.png';

export default function NotificationCard() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notification</Text>
        <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
          <Image source={closeIcon} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>
        Get notified when someone send you their Rezults or request for yours
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Turn On Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
  },
  closeButton: {
    width: 24,
    height: 24,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  text: {
    ...typography.caption,
    color: colors.foreground.soft,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.neutral[0],
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    ...typography.captionMedium,
    color: colors.button.activeLabelPrimary,
  },
});