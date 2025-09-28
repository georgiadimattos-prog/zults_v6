import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { colors, typography } from "../../theme";
import ZultsButton from "./ZultsButton";

export default function ConfirmModal({
  visible,
  onClose,
  title,
  description,
  confirmLabel = "Continue",
  onConfirm,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView intensity={40} tint="dark" style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Description */}
              {description ? (
                <Text style={styles.description}>{description}</Text>
              ) : null}

              {/* Confirm button */}
<ZultsButton
  label={confirmLabel}
  type="primary"   // ✅ strong action
  size="large"
  fullWidth
  onPress={() => {
    onConfirm?.();
    onClose();
  }}
/>

<View style={{ height: 12 }} />

{/* Cancel button */}
<ZultsButton
  label="Cancel"
  type="ghost"     // ✅ low emphasis cancel
  size="large"
  fullWidth
  onPress={onClose}
/>
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
});
