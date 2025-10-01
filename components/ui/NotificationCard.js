import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../../theme';
import ZultsButton from './ZultsButton';  // ✅ standard button
import closeIcon from '../../assets/images/close-square.png';

export default function NotificationCard() {
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation();

  // Slide-out animation for dismiss
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Image source={closeIcon} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>
        Get notified when someone sends you their Rezults or requests yours.
      </Text>

      {/* ✅ Use standard Zults button */}
      <ZultsButton
  label="Turn on notifications"
  type="primary"
  size="small"
  fullWidth={false}
  style={{ marginTop: 8, alignSelf: 'flex-start' }}  // or 'center' if you want it centered
  onPress={() => navigation.navigate('Settings')}
/>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    padding: 20,       // 👈 bumped from 16 → 20 for internal spacing baseline
    marginTop: 20,     // 👈 bumped from 12 → 20 to match section rhythm
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,  // 👈 was 8, now 12 for cleaner hierarchy
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
    tintColor: colors.foreground.muted,
  },
  text: {
    ...typography.subheadlineRegular,
    color: colors.foreground.soft,
    marginBottom: 16,  // 👈 was 12, now 16 to give space above button
  },
});