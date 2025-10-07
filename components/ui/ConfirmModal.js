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
              <Text style={styles.title} allowFontScaling={false}>
                {title}
              </Text>

              {/* Description */}
              {description ? (
                <Text style={styles.description} maxFontSizeMultiplier={1.3}>
                  {description}
                </Text>
              ) : null}

              {/* Confirm */}
              <ZultsButton
                label={confirmLabel}
                type="primary"
                size="large"
                fullWidth
                onPress={() => {
                  onConfirm?.();
                  onClose();
                }}
              />

              <View style={{ height: 12 }} />

              {/* Cancel */}
              <ZultsButton
                label="Cancel"
                type="ghost"
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
    paddingBottom: 32, // ✅ unified modal bottom padding
  },
  title: {
    ...typography.largeTitleMedium,  // ✅ hero modal title
    color: colors.foreground.default,
    marginBottom: 12,                // ✅ tighter vertical rhythm
  },
  description: {
    ...typography.bodyRegular,       // ✅ subtitle baseline
    color: colors.foreground.soft,
    marginBottom: 24,
    lineHeight: 20,
  },
});
