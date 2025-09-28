// components/ui/useDemoChat.js
import { useRef } from "react";
import { chatCache } from "../../cache/chatCache";

// ⏱ helper for scheduling
const scheduleMessage = (delay, fn) => setTimeout(fn, delay);

export function useDemoChat() {
  const typingIdRef = useRef(null);

  const addTyping = (setChatData, user) => {
    if (typingIdRef.current) return;
    typingIdRef.current = `typing-${Date.now()}`;
    setChatData((prev) => [
      ...prev,
      {
        id: typingIdRef.current,
        type: "typing",
        direction: "from-other",
        username: user.name,
        avatar: user.image,
      },
    ]);
  };

  const removeTyping = (setChatData) => {
    if (typingIdRef.current) {
      setChatData((prev) => prev.filter((m) => m.id !== typingIdRef.current));
      typingIdRef.current = null;
    }
  };

  const seedDemoChat = (user, setChatData, flatListRef) => {
    const key = user.id || user.name || "default";

    // persist empty bot user in cache
    chatCache[key] = {
      user: { id: user.id, name: "Zults Bot", image: user.image, isBot: true },
      chatData: [],
      chatState: { hasShared: false, hasRequested: false },
      otherUserState: { hasShared: false, hasRequested: false },
      blocked: false,
    };

    const pushMessage = (msg) => {
      setChatData((prev) => [...prev, msg]);
      chatCache[key].chatData.push(msg);
      setTimeout(() => flatListRef?.current?.scrollToEnd({ animated: true }), 300);
    };

    // 🟣 Show first 2 messages instantly
    pushMessage({
      id: "demo-msg-1",
      type: "text",
      direction: "from-other",
      username: "Zults Bot",
      avatar: user.image,
      text: "Hi 👋 I’m Zults Bot — your sexual health companion 💜",
      timestamp: "Now",
    });

    pushMessage({
      id: "demo-msg-2",
      type: "text",
      direction: "from-other",
      username: "Zults Bot",
      avatar: user.image,
      text: "You can chat with me about sexual health, Rezults, or anything you’re unsure about 💬.",
      timestamp: "Now",
    });

    // ⏱ Later messages with typing effect
    scheduleMessage(4000, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: "demo-msg-3",
          type: "text",
          direction: "from-other",
          username: "Zults Bot",
          avatar: user.image,
          text: "Here’s an example of how Rezults sharing looks ⬇️",
          timestamp: "Now",
        });
      });
    });

    scheduleMessage(10000, () => {
      pushMessage({
        id: "demo-msg-4",
        type: "share",
        direction: "from-other",
        username: "Zults Bot",
        avatar: user.image,
        timestamp: "Now",
      });
    });
  };

  return { seedDemoChat };
}
