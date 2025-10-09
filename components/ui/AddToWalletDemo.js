import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography } from "../../theme";
import ZultsButton from "./ZultsButton";

export default function AddToWalletDemo() {
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setVisible(false);
    setTimeout(() => setAdded(true), 400);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <View style={styles.container}>
      {/* ─── Add to Wallet CTA ─── */}
      <Pressable style={styles.walletButton} onPress={() => setVisible(true)}>
        <Image
          source={require("../../assets/images/user-verification-icon.png")}
          style={styles.walletIcon}
        />
        <Text style={styles.walletText}>
          Add to Apple Wallet
        </Text>
      </Pressable>

      {/* ─── Modal ─── */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={[colors.background.surface1, "#000"]}
              style={styles.card}
            >
              {/* Logo */}
              <Image
                source={require("../../assets/images/icon-logo-zults.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              {/* Username */}
              <View style={{ marginTop: 20 }}>
                <Text
                  style={[typography.captionLargeRegular, styles.label]}
                >
                  Username
                </Text>
                <Text
                  style={[typography.title3Medium, styles.value]}
                >
                  Jonster
                </Text>
              </View>

              {/* Subtitle */}
              <Text
                style={[typography.subheadlineRegular, styles.subText]}
              >
                Scan to view Rezults
              </Text>

              {/* QR Code */}
              <Image
                source={require("../../assets/images/qr-code.png")}
                style={styles.qr}
                resizeMode="contain"
              />
            </LinearGradient>

            {/* Buttons */}
            <ZultsButton
              label="Add"
              type="brand"
              size="large"
              onPress={handleAdd}
              fullWidth={false}
              style={{ marginBottom: 8 }}
            />
            <ZultsButton
              label="Cancel"
              type="secondary"
              size="medium"
              onPress={() => setVisible(false)}
              fullWidth={false}
            />
          </View>
        </View>
      </Modal>

      {/* ─── Toast confirmation ─── */}
      {added && (
        <View style={styles.toast}>
          <Text
            style={[typography.bodyMedium, styles.toastText]}
          >
            ✅ Rezults added to Wallet
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 20 },

  // ─── Wallet Button ───
  walletButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  walletText: {
    ...typography.buttonMediumRegular,
    color: colors.foreground.muted,
  },
  walletIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
    tintColor: colors.foreground.muted,
  },

  // ─── Modal Card ───
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cardContainer: {
    width: "85%",
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 30,
    alignSelf: "flex-start",
  },
  label: {
    color: colors.foreground.soft,
  },
  value: {
    color: colors.foreground.default,
    marginTop: 4,
  },
  subText: {
    color: colors.foreground.default,
    textAlign: "center",
    marginVertical: 20,
  },
  qr: {
    width: 180,
    height: 180,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 8,
  },

  // ─── Toast ───
  toast: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  toastText: {
    color: colors.foreground.default,
  },
});