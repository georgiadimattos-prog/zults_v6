// components/ui/useDemoChat.js
import { useEffect } from "react";
import { chatCache } from "../../cache/chatCache";

/**
 * 🔹 Hook that controls demo chat logic for Rezy & Demo1–4
 * This runs automatically when entering any demo chat.
 */
export function useDemoChat({
  chatUser,
  addMessage,
  setTyping,
  startRequestFlow,
  startShareFlow,
}) {
  useEffect(() => {
    if (!chatUser) return;

    // 🟣 Demo bots (Demo1–4)
    if (chatUser.isBot && chatUser.id.startsWith("demo")) {
      const id = chatUser.id;

      chatCache[id] = {
        ...chatCache[id],
        startRequestFlow: () => startRequestFlow(id),
        startShareFlow: () => startShareFlow(id),
      };
    }

    // 💜 Rezy (Zults Demo bot)
    if (chatUser.id === "zults-demo") {
      setTyping(true);

      const intro1 = setTimeout(() => {
        addMessage({
          type: "text",
          direction: "from-other",
          username: "Rezy",
          avatar: chatUser.image,
          text: "Hi 👋 I’m Rezy — your Rezults demo guide.",
          timestamp: "Now",
        });
      }, 800);

      const intro2 = setTimeout(() => {
        addMessage({
          type: "text",
          direction: "from-other",
          username: "Rezy",
          avatar: chatUser.image,
          text: "Tap ‘View Rezults’ below to see how your Rezults Card works.",
          timestamp: "Now",
        });
        setTyping(false);
      }, 3000);

      return () => {
        clearTimeout(intro1);
        clearTimeout(intro2);
      };
    }
  }, [chatUser]);
}
