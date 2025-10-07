import React, { useEffect, useState } from "react";
import ZultsButton from "./ZultsButton";

/**
 * 🧩 RezultsActionButton
 * Locks temporarily on "requested" state so UI stays consistent,
 * even when chat state rehydrates or re-renders too fast.
 */
export default function RezultsActionButton({ status, onPress }) {
  const [lockedRequested, setLockedRequested] = useState(false);

  // When "requested" appears, lock visually for at least 3s
  useEffect(() => {
    if (status === "requested") {
      setLockedRequested(true);
      const t = setTimeout(() => setLockedRequested(false), 3000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const finalStatus =
    lockedRequested && status === "request" ? "requested" : status;

  switch (finalStatus) {
    case "request":
      return (
        <ZultsButton
          label="Request Rezults"
          type="secondary" // white pill
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
          type="ghost" // subtle muted pill
          size="medium"
          fullWidth={false}
          pill
          disabled
          opacity={0.7}
        />
      );

    case "view":
      return (
        <ZultsButton
          label="View Rezults"
          type="brand" // purple pill
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
          type="secondary" // white pill with dark text
          size="medium"
          fullWidth={true}
          pill
          onPress={onPress}
        />
      );

    default:
      return null;
  }
}