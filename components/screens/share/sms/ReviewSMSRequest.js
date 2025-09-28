import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../../theme';
import ZultsButton from '../../../ui/ZultsButton';
import ScreenWrapper from '../../../ui/ScreenWrapper';
import ScreenFooter from '../../../ui/ScreenFooter';
import Navbar from '../../../ui/Navbar';   // ✅ standardized navbar

export default function ReviewSMSRequest() {
  const route = useRoute();
  const navigation = useNavigation();
  const phone = route.params?.phone || '';
  const [agreed, setAgreed] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenWrapper topPadding={0}>
  {/* ✅ Navbar pinned at the top, outside scroll */}
  <Navbar />

  {/* Scrollable content */}
  <ScrollView
    contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: 120 }]}
    keyboardShouldPersistTaps="handled"
  >
    {/* Header */}
    <View style={styles.headerBlock}>
      <Text allowFontScaling={false} style={styles.pageTitle}>
        Review SMS
      </Text>
      <Text allowFontScaling={false} style={styles.subtitle}>
        Check the details before you send.
      </Text>
    </View>

    {/* Phone number */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Phone number</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputText}>{String(phone)}</Text>
      </View>
    </View>

    {/* Message (static, not editable) */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Message</Text>
      <View style={styles.staticBox}>
        <Text style={styles.staticText}>
          A reminder to consider getting tested for STIs. This may be from a past or potential partner.
        </Text>
      </View>
    </View>

    {/* Checkbox */}
    <View style={styles.checkboxRow}>
      <TouchableOpacity
        onPress={() => setAgreed(!agreed)}
        style={styles.checkboxContainer}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
          {agreed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxText}>
          I confirm this request is for a legitimate purpose and I’ve considered its impact on the recipient.
        </Text>
      </TouchableOpacity>
    </View>
  </ScrollView>

  {/* Footer stays pinned too */}
  <ScreenFooter>
    <ZultsButton
      label="Send SMS"
      type="primary"
      size="large"
      fullWidth
      disabled={!agreed}
      onPress={() => navigation.navigate('SMSRequestSent')}
    />
  </ScreenFooter>
</ScreenWrapper>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16, // ✅ Apple-style gutter
  },
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
  },
  pageTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
  },
  staticBox: {   // 👈 new style
  borderRadius: 12,
  backgroundColor: 'rgba(255,255,255,0.05)', // subtle frosted bg
  padding: 16,
},
staticText: {
  ...typography.bodyRegular,
  color: colors.foreground.default,
  lineHeight: 20,
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
    alignItems: 'flex-start',
    flexWrap: 'wrap',
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
    marginRight: 10,
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
});
