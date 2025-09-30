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
import ZultsButton from "./ZultsButton"; // ✅ your brand button

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
      {/* Fake Add to Wallet button */}
      <Pressable style={styles.walletButton} onPress={() => setVisible(true)}>
        <Image
          source={require("../../assets/images/user-verification-icon.png")}
          style={styles.walletIcon}
        />
        <Text style={[styles.walletText, typography.buttonLargeMedium]}>
          Add to Apple Wallet
        </Text>
      </Pressable>

      {/* Modal with Zults card preview */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={[colors.background.surface1, "#000"]}
              style={styles.card}
            >
              {/* Zults logo */}
              <Image
                source={require("../../assets/images/icon-logo-zults.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              {/* Username */}
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.label, typography.subheadlineRegular]}>
                  Username
                </Text>
                <Text style={[styles.value, typography.title3Medium]}>
                  Jonster
                </Text>
              </View>

              {/* Subtitle */}
              <Text style={[styles.subText, typography.subheadlineRegular]}>
                Scan to view Rezults
              </Text>

              {/* QR Code */}
              <Image
                source={require("../../assets/images/qr-code.png")}
                style={styles.qr}
                resizeMode="contain"
              />
            </LinearGradient>

            {/* ✅ Use ZultsButton for consistency */}
            <ZultsButton
              label="Add"
              type="brand"
              size="large"
              onPress={handleAdd}
              fullWidth={false}
              style={{ marginBottom: 10 }}
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

      {/* Temporary confirmation popup */}
      {added && (
        <View style={styles.toast}>
          <Text style={[styles.toastText, typography.bodyMedium]}>
            ✅ Rezults Card added to Wallet
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 20 },

  walletButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "transparent",              // 👈 remove fill
  borderWidth: 1,                              // 👈 add subtle outline
  borderColor: "rgba(255,255,255,0.15)",       // 👈 faint border
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 16,                            // 👈 rounder button feel
},
walletText: {
  ...typography.buttonMediumRegular,
  color: colors.foreground.muted,              // 👈 softer text
},
walletIcon: {
  width: 18,
  height: 18,
  marginRight: 6,
  tintColor: colors.foreground.muted,          // 👈 icon matches muted text
},


  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cardContainer: {
    width: "85%",
    backgroundColor: "white",
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
    padding: 10,
  },

  toast: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  toastText: {
    color: "white",
  },
});
