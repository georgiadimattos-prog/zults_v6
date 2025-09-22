import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../../theme';
import ZultsButton from '../../../ui/ZultsButton';
import ScreenHeader from '../../../ui/ScreenHeader';
import ScreenWrapper from '../../../ui/ScreenWrapper';

export default function ReviewSMSRequest() {
  const route = useRoute();
  const navigation = useNavigation();
  const phone = route.params?.phone || '';
  const [agreed, setAgreed] = useState(false);

  return (
    <ScreenWrapper>
      <ScreenHeader
        title="Review your request"
        subtitle="Please check the details before sending"
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Add phone number</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputText}>{phone}</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputText}>
              Someone sent you a reminder to consider getting tested for STIs. This may be from a past or potential partner.
            </Text>
          </View>
        </View>

        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setAgreed(!agreed)} style={styles.checkboxContainer}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              By using this service you agree its purpose is for a legitimate purpose and you have considered the implications for the recipient.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ZultsButton
        label="Send Request"
        type="primary"
        size="large"
        fullWidth
        disabled={!agreed}
        onPress={() => navigation.navigate('SMSRequestSent')}
        style={styles.sendButtonFixed}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 160,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    ...typography.captionSmallRegular,
    color: colors.neutralText.label,
    marginBottom: 6,
  },
  inputWrapper: {
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    backgroundColor: 'rgba(20,20,20,0.5)',
    padding: 16,
  },
  inputText: {
    ...typography.bodyRegular,
    color: colors.foreground.default,
    lineHeight: 20,
  },
  checkboxRow: {
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.foreground.soft,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    backgroundColor: '#292929',
  },
  checkboxChecked: {
    backgroundColor: colors.neutral[0],
  },
  checkmark: {
    color: colors.background.surface1,
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkboxText: {
    flex: 1,
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
    lineHeight: 16,
  },
  sendButtonFixed: {
    position: 'absolute',
    bottom: 52,
    left: 16,
    right: 16,
    zIndex: 100,
  },
});
