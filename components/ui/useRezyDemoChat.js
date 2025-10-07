import { useRef } from "react";
import { DeviceEventEmitter } from "react-native";
import { chatCache } from "../../cache/chatCache";

export function useRezyDemoChat() {
  const typingTimeouts = useRef([]);

  // 🟣 1. Seed Rezy chat on first open
  const seedRezyChat = (user, setChatData, flatListRef, setHighlightTopCTA) => {
    console.log("🤖 Seeding Rezy chat...");

    const key = user.id || `user-${user.name}`;
    chatCache[key] = {
      ...(chatCache[key] || {}),
      user,
      chatData: [],
      hasUnread: false,
    };

    const introMsg = {
      id: Date.now().toString(),
      type: "text",
      direction: "from-other",
      username: "Rezy",
      avatar: user.image,
      text: "Hey! I’m Rezy 💜 Ask me anything about Rezults or sexual health.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatData([introMsg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 300);

    // 👇 Show the tooltip after a short delay
    setTimeout(() => setHighlightTopCTA(true), 1500);
  };

  // 🟣 2. Handle Rezy's chatbot replies
  const handleUserMessage = (user, setChatData, flatListRef, message) => {
    const key = user.id || `user-${user.name}`;
    console.log("💬 Rezy reply triggered:", message);

    const typingMsg = {
      id: Date.now().toString(),
      type: "typing",
      direction: "from-other",
      username: user.name,
      avatar: user.image,
    };

    setChatData((prev) => [...prev, typingMsg]);
    DeviceEventEmitter.emit("chat-updated");

    const timeout = setTimeout(() => {
      setChatData((prev) =>
        prev.filter((m) => m.id !== typingMsg.id).concat({
          id: Date.now().toString(),
          type: "text",
          direction: "from-other",
          username: user.name,
          avatar: user.image,
          text: getBotReply(message),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        })
      );
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
    }, 1800);

    typingTimeouts.current.push(timeout);
  };

  const getBotReply = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes("hello") || lower.includes("hi")) return "Hey there 👋 What’s on your mind?";
    if (lower.includes("results") || lower.includes("rezults")) return "Rezults helps you privately share verified STI test results. 💜";
    if (lower.includes("safe") || lower.includes("privacy")) return "Everything’s encrypted. Only you control who sees your Rezults.";
    return "That’s a great question 💭 Let’s keep the convo going!";
  };

  const clearAllRezyTimers = () => {
    typingTimeouts.current.forEach(clearTimeout);
    typingTimeouts.current = [];
  };

  return { seedRezyChat, handleUserMessage, clearAllRezyTimers };
}