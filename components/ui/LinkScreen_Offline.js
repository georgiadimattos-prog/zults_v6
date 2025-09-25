import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../../theme";
import ScreenWrapper from "../../../ui/ScreenWrapper";
import Navbar from "../../../ui/Navbar";
import LinkUnavailableModal from "./LinkUnavailableModal";
import { rezultsCache } from "../../../../cache/rezultsCache"; // ✅ use the same cache

export default function LinkScreen_Offline() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!rezultsCache.hasRezults) {
      // ✅ user has no Rezults → show modal immediately
      setModalVisible(true);
    } else {
      // ✅ user has Rezults → skip offline view and go to Link screen directly
      navigation.replace("LinkScreenSuccess"); 
    }
  }, [navigation]);

  return (
    <ScreenWrapper topPadding={0}>
      <Navbar title="Link" />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Checking your Rezults…</Text>
        <Text style={styles.cardSubtitle}>
          Please wait while we verify your Rezults status.
        </Text>
      </View>

      <LinkUnavailableModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGetRezults={() => {
          setModalVisible(false);
          navigation.navigate("GetRezults");
        }}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.surface3,
    borderRadius: 20,
    padding: 16,
    marginTop: 24,
    alignItems: "center",
  },
  cardTitle: {
    ...typography.title3Medium,
    color: colors.foreground.default,
    marginBottom: 8,
  },
  cardSubtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
  },
});
