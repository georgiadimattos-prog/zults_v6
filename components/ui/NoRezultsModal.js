import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../theme";
import ZultsButton from "./ZultsButton";

export default function NoRezultsModal({ visible, onClose }) {
  const navigation = useNavigation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* ─── Tap outside to close ─── */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

          {/* ─── Capture taps inside ─── */}
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* ─── Title ─── */}
              <Text
                style={styles.title}
                allowFontScaling
                maxFontSizeMultiplier={1.3}
              >
                Oops…
              </Text>

              {/* ─── Description ─── */}
              <Text
                style={styles.description}
                allowFontScaling
                maxFontSizeMultiplier={1.3}
              >
                You don’t have any Rezults yet.{"\n"}
                Get tested with one of our partner providers to add your Rezults.
              </Text>

              {/* ─── Primary Button ─── */}
              <ZultsButton
                label="Get Rezults"
                type="primary"
                size="large"
                fullWidth
                onPress={() => {
                  onClose?.();
                  navigation.navigate("GetRezultsSelectProvider");
                }}
              />

              <View style={{ height: 8 }} />

              {/* ─── Secondary Button ─── */}
              <ZultsButton
                label="Maybe Later"
                type="ghost"
                size="large"
                fullWidth
                onPress={onClose}
              />
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
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.background.surface2,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // ─── Typography ───
  title: {
    ...typography.title1Medium, // ✅ Apple modal size (28 / 34 / -0.28)
    color: colors.foreground.default,
    marginBottom: 12,
  },
  description: {
    ...typography.bodyRegular, // ✅ subtitle style
    color: colors.foreground.soft,
    lineHeight: 20,
    marginBottom: 24,
  },
});
