import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../../theme";
import LinkUnavailableModal from "./LinkUnavailableModal"; // 👈 import new modal

export default function LinkShare() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Your existing LinkShare UI goes here */}

      {/* Unified Modal */}
      {modalVisible && (
        <LinkUnavailableModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onGetRezults={() => {
            setModalVisible(false);
            navigation.navigate("GetRezults");
          }}
        />
      )}

      {/* Example trigger button (replace with your real trigger) */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.testButton}>
        <Text style={styles.testButtonText}>Try to create link</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.surface1,
    justifyContent: "center",
    alignItems: "center",
  },
  testButton: {
    marginTop: 20,
    backgroundColor: colors.brand.purple1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  testButtonText: {
    ...typography.bodyMedium,
    color: colors.neutral[0],
  },
});
