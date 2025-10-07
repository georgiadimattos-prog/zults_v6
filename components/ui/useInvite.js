// components/ui/useInvite.js
import { Share, Alert, Platform } from "react-native";
import { rezultsCache } from "../../cache/rezultsCache";

export function useInvite() {
  const sendInvite = async () => {
    try {
      // ✅ Safely pull username or default
      const username = rezultsCache.card?.userName?.trim() || "Jonster";
      const link = "https://apps.apple.com/gb/app/zults/id1540963918";

      // ✅ Clean native message
      const message =
        `Join me on Zults 💜\n` +
        `My username: ${username}\n\n` +
        `Download the app here:\n${link}`;

      // ✅ Build correct payload per platform
      const shareOptions =
        Platform.OS === "ios"
          ? {
              title: "Invite to Zults",
              message,
              url: link, // iOS uses this for link previews
            }
          : {
              message, // Android only supports message
            };

      // ✅ Native share sheet
      await Share.share(shareOptions);
    } catch (err) {
      console.error("Error sharing invite:", err);
      Alert.alert(
        "Error",
        "Something went wrong while trying to share your invite."
      );
    }
  };

  return { sendInvite };
}
