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
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Tap outside to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView intensity={40} tint="dark" style={styles.overlay}>
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
                <ZultsButton
                  key={idx}
                  label={action.label}
                  type="primary"
                  size="large"
                  fullWidth
                  onPress={() => {
                    action.onPress?.();
                    onClose();
                  }}
                />
              ))}

              <View style={{ height: 12 }} />

              {/* Cancel button */}
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
