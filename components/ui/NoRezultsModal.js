/* components/ui/NoRezultsModal.js */
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
      {/* Tap outside to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView intensity={40} tint="dark" style={styles.overlay}>
          {/* Capture taps inside */}
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* Title */}
              <Text style={styles.title}>No Rezults Yet</Text>

              {/* Description */}
              <Text style={styles.description}>
                You don’t have any Rezults yet. Please get tested and add Rezults
                before sharing.
              </Text>

              {/* Primary → Go to provider selection */}
              <ZultsButton
                label="Get Rezults"
                type="primary"
                size="large"
                fullWidth
                onPress={() => {
                  onClose?.();
                  navigation.navigate("GetRezultsProvider"); // ✅ provider picker
                }}
              />

              <View style={{ height: 12 }} />

              {/* Secondary → Dismiss */}
              <ZultsButton
                label="Maybe Later"
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
    paddingBottom: 32,
  },
  title: {
    ...typography.title1Medium,
    color: colors.foreground.default,
    marginBottom: 12,
  },
  description: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
  },
});