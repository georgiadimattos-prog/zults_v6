import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../../../../theme';
import ScreenWrapper from '../../../ui/ScreenWrapper';
import Navbar from '../../../ui/Navbar';   // ✅ standardized navbar

export default function LinkShare() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [hasRezults, setHasRezults] = useState(false); // simulate state

  const handleGenerateLink = () => {
    if (hasRezults) {
      // TODO: Logic to generate link
    } else {
      setModalVisible(true);
    }
  };

  return (
    <ScreenWrapper topPadding={0}>   {/* ✅ consistent with Rezults/SMS */}
      {/* ✅ standardized navbar */}
      <Navbar title="Link" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Send your Rezults link to someone or add it to your dating profile.
          Even someone without the app can view it.
        </Text>

        <View style={styles.linkBox}>
          <View style={styles.linkRow}>
            <Text style={styles.linkLabel}>Share-link</Text>
            <Text style={styles.linkStatus}>● Offline</Text>
          </View>

          <TouchableOpacity style={styles.linkButton} onPress={handleGenerateLink}>
            <Text style={styles.linkButtonText}>Generate New Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal if user has no Rezults */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Oops...</Text>
            <Text style={styles.modalSubtitle}>
              You need a Rezults to be able to create a link.
            </Text>

            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('GetRezults');
              }}
            >
              <Text style={styles.modalButtonTextPrimary}>Get Rezults</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonTextSecondary}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginTop: 16,   // ✅ breathing room below navbar
    marginBottom: 24,
  },
  linkBox: {
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    padding: 20,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  linkLabel: {
    ...typography.bodyLarge,
    color: colors.foreground.default,
  },
  linkStatus: {
    ...typography.caption,
    color: '#FA5F21',
  },
  linkButton: {
    backgroundColor: colors.neutral[0],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  linkButtonText: {
    ...typography.bodyLarge,
    color: colors.button.activeLabelPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background.surface1,
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 8,
  },
  modalSubtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
  },
  modalButtonPrimary: {
    backgroundColor: colors.neutral[0],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonTextPrimary: {
    ...typography.bodyLarge,
    color: colors.button.activeLabelPrimary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.background.surface2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonTextSecondary: {
    ...typography.bodyLarge,
    color: colors.foreground.default,
  },
});
