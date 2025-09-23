import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { colors, typography } from "../../theme";

export default function ActionModal({
  visible,
  onClose,
  title,
  description,
  actions = [],
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Tap outside to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Prevent closing when tapping inside content */}
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Description */}
              {description ? (
                <Text style={styles.description}>{description}</Text>
              ) : null}

              {/* Action buttons */}
              {actions.map((action, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.primaryButton}
                  onPress={() => {
                    action.onPress?.();
                    onClose();
                  }}
                >
                  <Text style={styles.primaryText}>{action.label}</Text>
                </TouchableOpacity>
              ))}

              {/* Cancel button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
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
