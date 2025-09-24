import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../../theme";
import LinkUnavailableModal from "./LinkUnavailableModal"; // 👈 unified modal

export default function LinkScreen_Offline() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Link Offline Screen</Text>

      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.button}>
        <Text style={styles.buttonText}>Try Link</Text>
      </TouchableOpacity>

      {showModal && (
        <LinkUnavailableModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onGetRezults={() => {
            setShowModal(false);
            navigation.navigate("GetRezults");
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.surface1,
  },
  text: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.brand.purple1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    ...typography.bodyMedium,
    color: colors.neutral[0],
  },
});
