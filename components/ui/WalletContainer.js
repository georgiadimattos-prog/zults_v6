// components/ui/WalletContainer.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { colors, typography } from "../../theme";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const CONTAINER_WIDTH = screenWidth - 32;

export default function WalletContainer() {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.label}>Save your Rezults</Text>
        <TouchableOpacity
          style={styles.walletButton}
          onPress={() => navigation.navigate("AddToWallet")}
        >
          <Text style={styles.walletButtonText}>＋ Add to Wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CONTAINER_WIDTH,
    borderRadius: 20,
    backgroundColor: colors.background.surface2,
    padding: 16,
    alignSelf: "center",
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    ...typography.bodyMedium,
    fontSize: 16,
    fontWeight: "500",
    color: colors.foreground.default,
  },
  walletButton: {
    borderWidth: 1,
    borderColor: colors.foreground.default,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  walletButtonText: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
  },
});
