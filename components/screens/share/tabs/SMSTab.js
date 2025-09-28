import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { colors, typography } from '../../../../theme';
import infoIcon from '../../../../assets/images/info-icon.png';
import ScreenFooter from '../../../ui/ScreenFooter';
import ZultsButton from '../../../ui/ZultsButton';

export default function SMSTab({ navigation }) {
  const [phone, setPhone] = useState('');
  const isValid = phone.trim().length >= 8;

  // ✅ Pulse animation for the green quota number
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <>
      {/* Scrollable main content */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: 120,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Phone input */}
<View style={styles.inputGroup}>
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      value={phone}
      onChangeText={setPhone}
      placeholder="Add phone number"   // ✅ back to clean Apple style
      placeholderTextColor={colors.neutralText.subtext}
      keyboardType="phone-pad"
      onFocus={() => {
        if (!phone) {
          setPhone("+447123456789"); // 👈 demo number prefilled
        }
      }}
    />
  </View>
</View>

        {/* Info banner */}
        <View style={styles.infoBox}>
          <Image source={infoIcon} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            You have{' '}
            <Animated.Text
              style={[
                styles.infoHighlight,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              1 of 1
            </Animated.Text>{' '}
            SMS available this week
          </Text>
        </View>
      </ScrollView>

      {/* Footer pinned at bottom */}
      <ScreenFooter>
        <ZultsButton
          label="Continue"
          type="primary"
          size="large"
          fullWidth
          disabled={!isValid}
          onPress={() => navigation.navigate('ReviewSMSRequest', { phone })}
        />
      </ScreenFooter>
    </>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 16,   // ⬅️ reduce gap under phone input
  },
  label: {
    ...typography.captionSmallRegular,
    color: colors.neutralText.label,
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    ...typography.bodyRegular,
    color: colors.foreground.default,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D3E2D',
    padding: 12,
    borderRadius: 12,
    marginTop: 0,      // ⬅️ new, brings it closer to input
    marginBottom: 40,  // ⬅️ reduced from 32, keeps consistent breathing room
  },
  infoIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#1DCA7A',
  },
  infoText: {
    flexShrink: 1,
    ...typography.captionSmallRegular,
    color: colors.neutral[0],
  },
  infoHighlight: {
    color: '#1DCA7A',
    fontWeight: '600',
  },
});
