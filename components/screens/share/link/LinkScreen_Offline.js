import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../../../theme';
import LinkUnavailableModal from './LinkUnavailableModal';
import ScreenWrapper from '../../../ui/ScreenWrapper';
import Navbar from '../../../ui/Navbar';   // ✅ standardized navbar

export default function LinkScreen_Offline({ navigation }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <ScreenWrapper topPadding={0}>   {/* ✅ consistent top padding */}
      {/* ✅ Navbar added */}
      <Navbar title="Link" />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Share-link</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Offline</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.generateButtonText}>Generate New Link</Text>
        </TouchableOpacity>
      </View>

      {showModal && (
        <LinkUnavailableModal
          onClose={() => setShowModal(false)}
          onGetRezults={() => {
            setShowModal(false);
            navigation.navigate('GetRezults');
          }}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.surface3,
    borderRadius: 20,
    padding: 16,
    marginTop: 16, // ✅ gives a bit of breathing room below navbar
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    ...typography.bodyLarge,          // ✅ standardized typography
    color: colors.foreground.default,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#292929',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FA5F21',
    marginRight: 6,
  },
  statusText: {
    ...typography.captionSmallRegular, // ✅ standardized small text
    color: '#FA5F21',
  },
  generateButton: {
    backgroundColor: colors.neutral[0],
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  generateButtonText: {
    ...typography.bodyMedium,        // ✅ consistent font
    color: '#1E1E1E',
  },
});
