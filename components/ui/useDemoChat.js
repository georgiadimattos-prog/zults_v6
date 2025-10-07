// components/ui/useDemoChat.js
import { useRef } from "react";
import { chatCache } from "../../cache/chatCache";
import faq from "../../assets/data/faq.json";
import synonyms from "../../assets/data/synonyms.json";
import { DeviceEventEmitter } from "react-native";

// helper for scheduling
const scheduleMessage = (delay, fn) => setTimeout(fn, delay);
const createId = (prefix = "demo") =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

// ✅ Local time formatter
const getLocalTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function normalizeQuestion(question) {
  const lowerQ = question.toLowerCase().trim();
  if (synonyms[lowerQ]) return synonyms[lowerQ];
  return lowerQ;
}

function findAnswer(question) {
  const normalized = normalizeQuestion(question);
  for (const key in faq) {
    if (normalized.includes(key)) return faq[key];
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

  const seedDemoChat = (user, setChatData, flatListRef, setHighlightTopCTA) => {
    const key = user.id || user.name || "default";

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
      chatCache[key].hasUnread = true;
      setTimeout(() => {
        DeviceEventEmitter.emit("chat-updated");
        flatListRef?.current?.scrollToEnd({ animated: true });
      }, 300);
    };

    // ---- Messages in flat order ----
    pushMessage({
      id: createId(),
      type: "text",
      direction: "from-other",
      username: "Rezy",
      avatar: user.image,
      text: "Hey 👋 I’m Rezy.",
      timestamp: getLocalTime(),
    });

    pushMessage({
      id: createId(),
      type: "text",
      direction: "from-other",
      username: "Rezy",
      avatar: user.image,
      text: "Think of me as your sexual health friend 💜.",
      timestamp: getLocalTime(),
    });

    // Companion role
    scheduleMessage(3500, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: createId(),
          type: "text",
          direction: "from-other",
          username: "Rezy",
          avatar: user.image,
          text: "Someone you can chat about sexual health without shame or awkwardness.",
          timestamp: getLocalTime(),
        });
      });
    });

    // Nudges
    scheduleMessage(8000, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: createId(),
          type: "text",
          direction: "from-other",
          username: "Rezy",
          avatar: user.image,
          text: "And sometimes, I’ll nudge you… little reminders to re-test or bite-sized STI facts 🌱.",
          timestamp: getLocalTime(),
        });
      });
    });

    // Reassurance
    scheduleMessage(12000, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: createId(),
          type: "text",
          direction: "from-other",
          username: "Rezy",
          avatar: user.image,
          text: "Nothing heavy... just enough to keep you fresh.",
          timestamp: getLocalTime(),
        });
      });
    });

    // CTA intro
    scheduleMessage(16000, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: createId(),
          type: "text",
          direction: "from-other",
          username: "Rezy",
          avatar: user.image,
          text: "Alright, enough talking. See the View Rezults button up top?",
          timestamp: getLocalTime(),
        });

        setHighlightTopCTA?.(true);
      });
    });

    // Final tap instruction
    scheduleMessage(20000, () => {
      addTyping(setChatData, user);
      scheduleMessage(2000, () => {
        removeTyping(setChatData);
        pushMessage({
          id: createId(),
          type: "text",
          direction: "from-other",
          username: "Rezy",
          avatar: user.image,
          text: "Tap it and I’ll show you a demo Rezults card 💳.",
          timestamp: getLocalTime(),
        });
      });
    });
  };

  const handleUserMessage = (user, setChatData, flatListRef, message) => {
    const key = user.id || user.name || "default";
    const answer = findAnswer(message);

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
        timestamp: getLocalTime(),
      };
      setChatData((prev) => [...prev, botReply]);
      chatCache[key].chatData.push(botReply);
      chatCache[key].hasUnread = true;
      flatListRef?.current?.scrollToEnd({ animated: true });
    }, 1500);
  };

  return { seedDemoChat, handleUserMessage };
}