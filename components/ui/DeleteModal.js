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

export default function DeleteModal({ visible, onClose, onConfirm }) {
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
              <Text style={styles.title}>Delete Rezults?</Text>

              {/* Description */}
              <Text style={styles.description}>
                This will permanently remove your Rezults and disable sharing.
              </Text>

              {/* Actions */}
              <ZultsButton
                label="Delete Rezults"
                type="secondary"   // 👈 styled as destructive
                size="large"
                fullWidth
                onPress={() => {
                  onConfirm?.();
                  onClose();
                }}
              />

              <View style={{ height: 12 }} />

              <ZultsButton
                label="Cancel"
                type="primary"     // 👈 normal
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
