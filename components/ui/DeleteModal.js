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
import { rezultsCache } from "../../cache/rezultsCache";

export default function DeleteModal({ visible, onClose }) {
  const navigation = useNavigation();

  const handleDelete = () => {
    // 1. Clear Rezults cache
    rezultsCache.hasRezults = false;
    rezultsCache.card = null;

    // 2. Close modal
    onClose?.();

    // 3. Reset navigation so MainScreen remounts
    navigation.reset({
      index: 0,
      routes: [{ name: "MainScreen" }],
    });
  };

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
                Delete Rezults?
              </Text>

              {/* Description */}
              <Text style={styles.description} maxFontSizeMultiplier={1.2}>
                This will permanently remove your Rezults and disable sharing.
              </Text>

              {/* Actions */}
              <ZultsButton
                label="Delete Rezults"
                type="primary"
                size="large"
                fullWidth
                onPress={handleDelete}
              />

              <View style={{ height: 12 }} />

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
    ...typography.largeTitleMedium,   // ✅ unified modal title
    color: colors.foreground.default,
    marginBottom: 16,
  },
  description: {
    ...typography.bodyRegular,        // ✅ unified modal subtitle
    color: colors.foreground.soft,
    marginBottom: 24,
  },
});
