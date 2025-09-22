import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../../../theme';
import LinkUnavailableModal from './LinkUnavailableModal';
import ScreenWrapper from '../../../ui/ScreenWrapper';

export default function LinkScreen_Offline({ navigation }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <ScreenWrapper topPadding={32}>
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.foreground.default,
    letterSpacing: -0.18,
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
    fontSize: 14,
    color: '#FA5F21',
    letterSpacing: -0.07,
  },
  generateButton: {
    backgroundColor: colors.neutral[0],
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
  },
});
