import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { colors, typography } from "../../../../theme";

export default function LinkUnavailableModal({ visible, onClose, onGetRezults }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView intensity={40} tint="dark" style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* Title */}
              <Text style={styles.title}>Link Unavailable</Text>

              {/* Description */}
              <Text style={styles.description}>
                You need a Rezults to create a link. Please add your Rezults
                before sharing.
              </Text>

              {/* Primary button → Get Rezults */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  onGetRezults?.();
                  onClose?.();
                }}
              >
                <Text style={styles.primaryText}>Get Rezults</Text>
              </TouchableOpacity>

              {/* Secondary button → Maybe Later */}
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.background.surface2,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    ...typography.title1Medium,
    color: colors.foreground.default,
    marginBottom: 16,
  },
  description: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
  },
  primaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.neutral[0],
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  primaryText: {
    ...typography.buttonLargeRegular,
    color: colors.button.activeLabelPrimary,
  },
  cancelButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  cancelText: {
    ...typography.buttonLargeRegular,
    color: colors.foreground.default,
  },
});
