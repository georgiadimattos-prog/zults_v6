// components/ui/useInvite.js
import { Share, Alert } from "react-native";
import { rezultsCache } from "../../cache/rezultsCache";

export function useInvite() {
  const sendInvite = async () => {
    try {
      const username = rezultsCache.card?.userName || "Jonster";
      const link = "https://apps.apple.com/gb/app/zults/id1540963918";
      const message = `Download Zults and find me 💜 My username is: ${username}\n\nGet the app here: ${link}`;

      await Share.share({
        message,
        url: link,
        title: "Invite to Zults",
      });
    } catch (err) {
      console.error("Error sharing invite:", err);
      Alert.alert("Error", "Something went wrong while trying to share the invite.");
    }
  };

  return { sendInvite };
}
