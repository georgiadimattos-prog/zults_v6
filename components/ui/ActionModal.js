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
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* Title */}
              {title ? (
                <Text
                  style={styles.title}
                  allowFontScaling
                  maxFontSizeMultiplier={1.3}
                >
                  {title}
                </Text>
              ) : null}

              {/* Description */}
              {description ? (
                <Text
                  style={styles.description}
                  allowFontScaling
                  maxFontSizeMultiplier={1.3}
                >
                  {description}
                </Text>
              ) : null}

              {/* Action buttons */}
              {actions.map((action, idx) => (
                <View key={idx} style={{ marginBottom: 12 }}>
                  <ZultsButton
                    label={action.label}
                    type="primary"
                    size="large"
                    fullWidth
                    onPress={() => {
                      action.onPress?.();
                      onClose();
                    }}
                  />
                </View>
              ))}

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
    paddingTop: 28,         // ✅ Apple-like spacing
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    ...typography.title1Medium,    // ✅ 28 / 34 / -0.28 (Apple modal header)
    color: colors.foreground.default,
    marginBottom: 12,
  },
  description: {
    ...typography.bodyRegular,     // ✅ unified subtitle
    color: colors.foreground.soft,
    marginBottom: 28,
  },
});