/* components/ui/NoRezultsModal.js */

import React from "react";
import { useNavigation } from "@react-navigation/native";
import ActionModal from "./ActionModal";

export default function NoRezultsModal({ visible, onClose }) {
  const navigation = useNavigation();

  return (
    <ActionModal
      visible={visible}
      onClose={onClose}
      title="Oopss..."
      description="To share Rezults, you need to have one first."
      actions={[
        {
          label: "Get Rezults",
          onPress: () => {
            onClose(); // close the modal
            navigation.navigate("GetRezults"); // 👈 jump into Get Rezults flow
          },
        },
      ]}
    />
  );
}
