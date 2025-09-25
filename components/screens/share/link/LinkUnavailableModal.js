import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from 'react-native';
import { colors, typography } from '../../../../theme';
import ZultsButton from '../../../ui/ZultsButton';
import closeCross from '../../../../assets/images/close-cross.png';

export default function LinkUnavailableModal({ onClose, onGetRezults }) {
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Oops…</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Image source={closeCross} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          <Text style={styles.bodyText}>
            You need a Rezults to be able to create a link.
          </Text>

          <ZultsButton
            label="Get Rezults"
            type="primary"
            size="large"
            onPress={onGetRezults}
          />

          <View style={{ height: 12 }} />

          <ZultsButton
            label="Maybe Later"
            type="secondary"
            size="large"
            onPress={onClose}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000B2',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 34, // ✅ safe padding at bottom
  },
  modal: {
    width: '100%',
    backgroundColor: colors.background.surface2,
    borderRadius: 32,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 16, // ✅ match grid inside modal
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16, // ✅ slightly more breathing room
  },
  title: {
    ...typography.title3Medium,   // ✅ matches modal headers elsewhere
    color: colors.foreground.default,
  },
  closeIcon: {
    width: 20,   // ✅ bigger tap target
    height: 20,
    tintColor: colors.foreground.soft,
  },
  bodyText: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    lineHeight: 22,
    marginBottom: 24,
  },
});
