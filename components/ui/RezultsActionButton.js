import React from "react";
import ZultsButton from "./ZultsButton";

export default function RezultsActionButton({ status, onPress }) {
  switch (status) {
    case "request":
      return (
        <ZultsButton
          label="Request Rezults"
          type="secondary"      // ✅ white pill
          size="medium"
          fullWidth={false}
          pill
          onPress={onPress}
        />
      );

    case "requested":
      return (
        <ZultsButton
          label="Rezults Requested"
          type="ghost"          // ✅ subtle muted pill
          size="medium"
          fullWidth={false}
          pill
          disabled
        />
      );

    case "view":
      return (
        <ZultsButton
          label="View Rezults"
          type="brand"          // ✅ purple pill
          size="medium"
          fullWidth={false}
          pill
          onPress={onPress}
        />
      );

    case "stop":
      return (
        <ZultsButton
          label="Stop Sharing"
          type="secondary"       // ✅ white pill with dark text
          size="medium"
          fullWidth={true}       // ✅ full width replaces input area
          pill
          onPress={onPress}
        />
      );

    default:
      return null;
  }
}

