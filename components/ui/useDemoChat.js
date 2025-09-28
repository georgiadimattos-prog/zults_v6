// components/ui/useDemoChat.js
import { useRef } from "react";
import { chatCache } from "../../cache/chatCache";

// ⏱ small helper for scheduling messages
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

    // helper to push a message
    const pushMessage = (msg) => {
      setChatData((prev) => [...prev, msg]);
      chatCache[key].chatData.push(msg);
      setTimeout(() => {
        flatListRef?.current?.scrollToEnd({ animated: true });
      }, 300);
    };

    // 🟣 Welcome sequence
    scheduleMessage(1000, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: "demo-msg-1",
          type: "text",
          direction: "from-other",
          username: "Zults Bot",
          avatar: user.image,
          text: "Hi 👋 I’m Zults Bot — your sexual health companion 💜 I’ll be here to answer any questions you might have, even the ones that feel a little embarrassing to ask a friend.",
          timestamp: "Now",
        });
      });
    });

    scheduleMessage(6000, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: "demo-msg-2",
          type: "text",
          direction: "from-other",
          username: "Zults Bot",
          avatar: user.image,
          text: "You can chat with me about sexual health, Rezults, or just to understand how this all works. Think of me as your supportive best friend in the dating world — no judgement, only clear answers.",
          timestamp: "Now",
        });
      });
    });

    scheduleMessage(11000, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: "demo-msg-3",
          type: "text",
          direction: "from-other",
          username: "Zults Bot",
          avatar: user.image,
          text: "And to show you how Rezults sharing works, I’m already sharing mine with you in this chat. That way you can see what it looks like when people share with you — or when you share with them once you have a Rezults to show.",
          timestamp: "Now",
        });
      });
    });

    // Rezults demo bubble
    scheduleMessage(16000, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: "demo-msg-4",
          type: "share",
          direction: "from-other",
          username: "Zults Bot",
          avatar: user.image,
          timestamp: "Now",
        });
      });
    });
  };

  return { seedDemoChat };
}
