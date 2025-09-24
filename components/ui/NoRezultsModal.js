/* components/ui/NoRezultsModal.js */

import React from "react";
import { Text } from "react-native";
import ActionModal from "./ActionModal";

export default function NoRezultsModal({ visible, onClose }) {
  return (
    <ActionModal
      visible={visible}
      onClose={onClose}
      title="No Rezults Yet"
      description="You don’t have any Rezults yet. Please get tested and add Rezults before sharing."
      actions={[{ label: "OK", onPress: onClose }]}
    />
  );
}
