// components/ui/useDemoChat.js
import { useRef } from "react";
import { chatCache } from "../../cache/chatCache";
import { DeviceEventEmitter } from "react-native";
import { handleRezyAI } from "../screens/activities/RezyAIHandler";

// helper for scheduling
const scheduleMessage = (delay, fn) => setTimeout(fn, delay);
const createId = (prefix = "demo") =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

// ✅ Local time formatter
const getLocalTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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

// --- Short intro (clean + to the point, runs once)
  const seedDemoChatShortIntro = (user, setChatData, flatListRef /*, setHighlightTopCTA*/) => {
    const key = user.id || user.name || "default";

    // 🚫 prevent duplicate intro (React StrictMode or fast remount)
    if (chatCache[key]?.__introStarted) return;
    chatCache[key] = { ...(chatCache[key] || {}), __introStarted: true };

    chatCache[key] = {
      ...chatCache[key],
      user: { id: user.id, name: "Rez", image: user.image, isBot: true },
      chatData: chatCache[key]?.chatData || [],
      chatState: { hasShared: false, hasRequested: false },
      otherUserState: { hasShared: false, hasRequested: false },
      blocked: false,
      hasUnread: true,
    };

    const pushMessage = (text) => {
      const msg = {
        id: createId(),
        type: "text",
        direction: "from-other",
        username: "Rez",
        avatar: user.image,
        text,
        timestamp: getLocalTime(),
      };
      setChatData((prev) => [...prev, msg]);
      chatCache[key].chatData.push(msg);
      chatCache[key].hasUnread = true;
      setTimeout(() => {
        DeviceEventEmitter.emit("chat-updated");
        flatListRef?.current?.scrollToEnd({ animated: true });
      }, 300);
    };

    const sendWithTyping = (text, delay = 2000) => {
      addTyping(setChatData, user);
      setTimeout(() => {
        removeTyping(setChatData);
        pushMessage(text);
      }, delay);
    };

    // ✨ Rez’s friendly, stigma-free intro (with slower, natural pacing)
pushMessage("Hi there, I’m Rez 👋");

scheduleMessage(3500, () =>
  sendWithTyping(
    "Think of me as a new friend you can actually talk to about sexual health, without the shame.",
    3500
  )
);

scheduleMessage(9500, () =>
  sendWithTyping(
    "I’m here to help you stay informed and in control of your sexual health 💜.",
    3500
  )
);

scheduleMessage(15500, () =>
  sendWithTyping(
    "So… if you ever have any questions about sexual health, ask away 💬.",
    4000
  )
);
  };



  // --- AI replies
  const handleUserMessage = async (user, setChatData, flatListRef, message) => {
    const key = user.id || user.name || "default";

    addTyping(setChatData, user);
    try {
      const answer = await handleRezyAI(message);
      setTimeout(() => {
        removeTyping(setChatData);
        const botReply = {
          id: createId(),
          type: "text",
          direction: "from-other",
          username: "Rez",
          avatar: user.image,
          text: answer,
          timestamp: getLocalTime(),
        };
        setChatData((prev) => [...prev, botReply]);
        chatCache[key].chatData.push(botReply);
        chatCache[key].hasUnread = true;
        flatListRef?.current?.scrollToEnd({ animated: true });
      }, 1200);
    } catch (error) {
      console.error("Rezy AI error:", error);
      removeTyping(setChatData);
    }
  };

  return { seedDemoChatShortIntro, handleUserMessage };
}