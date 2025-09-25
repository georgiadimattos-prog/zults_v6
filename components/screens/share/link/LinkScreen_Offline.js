import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../../theme";
import ScreenWrapper from "../../../ui/ScreenWrapper";
import Navbar from "../../../ui/Navbar";
import ZultsButton from "../../../ui/ZultsButton";

export default function LinkScreen_Offline() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar title="Link" />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Share-link</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Offline</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.generateButtonText}>Generate New Link</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Inline modal (DeleteModal style) */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Oops…</Text>
                <Text style={styles.modalSubtitle}>
                  You need a Rezults to be able to create a link.
                </Text>

                <ZultsButton
                  label="Get Rezults"
                  type="primary"
                  size="large"
                  onPress={() => {
                    setShowModal(false);
                    navigation.navigate("GetRezultsProvider"); // ✅ start of flow
                  }}
                />

                <View style={{ height: 12 }} />

                <ZultsButton
                  label="Maybe Later"
                  type="secondary"
                  size="large"
                  onPress={() => setShowModal(false)}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.surface3,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    ...typography.bodyLarge,
    color: colors.foreground.default,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#292929",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FA5F21",
    marginRight: 6,
  },
  statusText: {
    ...typography.captionSmallRegular,
    color: "#FA5F21",
  },
  generateButton: {
    backgroundColor: colors.neutral[0],
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: "center",
  },
  generateButtonText: {
    ...typography.bodyMedium,
    color: "#1E1E1E",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.background.surface2,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  modalTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 12,
  },
  modalSubtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
  },
});
