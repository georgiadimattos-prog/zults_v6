// components/ui/useDemoChat.js
import { useRef } from "react";
import { chatCache } from "../../cache/chatCache";
import faq from "../../assets/data/faq.json";
import synonyms from "../../assets/data/synonyms.json";
import { DeviceEventEmitter } from "react-native";

// ⏱ helper for scheduling
const scheduleMessage = (delay, fn) => setTimeout(fn, delay);

// 🔧 unique id helper
const createId = (prefix = "demo") =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

// 🔍 FAQ answer finder
function normalizeQuestion(question) {
  const lowerQ = question.toLowerCase().trim();
  if (synonyms[lowerQ]) {
    return synonyms[lowerQ];
  }
  return lowerQ;
}

function findAnswer(question) {
  const normalized = normalizeQuestion(question);
  for (const key in faq) {
    if (normalized.includes(key)) {
      return faq[key];
    }
  }
  return "I’m not sure about that 🤔 but I can share trusted info about Rezults and sexual health!";
}

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
      user: { id: user.id, name: "Rezy", image: user.image, isBot: true },
      chatData: [],
      chatState: { hasShared: false, hasRequested: false },
      otherUserState: { hasShared: false, hasRequested: false },
      blocked: false,
      hasUnread: true,
    };

    const pushMessage = (msg) => {
  setChatData((prev) => [...prev, msg]);
  chatCache[key].chatData.push(msg);

  // ✅ Always mark unread if new message comes from Rezy
  chatCache[key].hasUnread = true;

  // ✅ Let Activities refresh
  setTimeout(() => {
    DeviceEventEmitter.emit("chat-updated");
    flatListRef?.current?.scrollToEnd({ animated: true });
  }, 300);
};

    // 🟣 Intro messages (first 2 instantly)
    pushMessage({
      id: createId(),
      type: "text",
      direction: "from-other",
      username: "Rezy",
      avatar: user.image,
      text: "Hi there 👋 Welcome to Zults! This is a demo Rezults so you can see how sharing works. Tap 'View Rezults' to see mine.",
      timestamp: "Now",
    });

    pushMessage({
      id: createId(),
      type: "text",
      direction: "from-other",
      username: "Rezy",
      avatar: user.image,
      text: "You’ll also see me at the top of your Activities screen 💜 I’ll be your sexual health companion, ask me anything, even the things you might not ask your friends.",
      timestamp: "Now",
    });

    // ⏱ Typing → next 2 lines
    scheduleMessage(4000, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: createId(),
          type: "text",
          direction: "from-other",
          username: "Rezy",
          avatar: user.image,
          text: "Hi, I’m Rezy 🤖 here to help with anything sexual health and Rezults.",
          timestamp: "Now",
        });

        // another typing for the tips line
        scheduleMessage(3000, () => {
          addTyping(setChatData, user);
          scheduleMessage(2000, () => {
            removeTyping(setChatData);
            pushMessage({
              id: createId(),
              type: "text",
              direction: "from-other",
              username: "Rezy",
              avatar: user.image,
              text: "Oh, and sometimes I’ll nudge you about testing or drop little STI facts 🌱 — just to keep your Rezults (and your knowledge) fresh.",
              timestamp: "Now",
            });
          });
        });
      });
    });

    // ⏱ Later: typing → Rezults share demo
    scheduleMessage(12000, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: createId(),
          type: "share",
          direction: "from-other",
          username: "Rezy",
          avatar: user.image,
          timestamp: "Now",
        });
      });
    });
  };

  // ✅ Handle user messages with FAQ replies
  const handleUserMessage = (user, setChatData, flatListRef, message) => {
    const key = user.id || user.name || "default";
    const answer = findAnswer(message);

    // simulate typing + delayed reply
    addTyping(setChatData, user);
    setTimeout(() => {
      removeTyping(setChatData);
      const botReply = {
        id: createId(),
        type: "text",
        direction: "from-other",
        username: "Rezy",
        avatar: user.image,
        text: answer,
        timestamp: "Now",
      };
      setChatData((prev) => [...prev, botReply]);
      chatCache[key].chatData.push(botReply);
      chatCache[key].hasUnread = true; // ✅ mark unread
      flatListRef?.current?.scrollToEnd({ animated: true });
    }, 1500);
  };

  return { seedDemoChat, handleUserMessage };
}