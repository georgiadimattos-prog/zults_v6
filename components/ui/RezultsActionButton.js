import React from "react";
import ZultsButton from "./ZultsButton";

export default function RezultsActionButton({ status, onPress }) {
  switch (status) {
    case "request":
      return (
        <ZultsButton
          label="Request Rezults"
          type="secondary"       // white pill
          size="medium"          // 👈 unified size
          fullWidth={false}
          pill
          onPress={onPress}
        />
      );

    case "requested":
      return (
        <ZultsButton
          label="Rezults Requested"
          type="ghost"           // gray pill
          size="medium"          // 👈 unified size
          fullWidth={false}
          pill
          disabled
        />
      );

    case "view":
      return (
        <ZultsButton
          label="View Rezults"
          type="brand"           // purple pill
          size="medium"          // 👈 unified size
          fullWidth={false}
          pill
          onPress={onPress}
        />
      );

    default:
      return null;
  }
}