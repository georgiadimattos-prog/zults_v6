// cache/chatCacheHelpers.js
import { DeviceEventEmitter } from "react-native";
import { chatCache } from "./chatCache";   // ✅ import the singleton here

export const createMessage = (type, direction, username, avatar, text = "") => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  type,
  direction,
  username,
  avatar,
  ...(text ? { text } : {}),
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
});

export const appendMessage = (key, msg) => {
  const chat = chatCache[key] || {};
  const updated = [...(chat.chatData || []), msg];

  chatCache[key] = { ...chat, chatData: updated, hasUnread: true };
  DeviceEventEmitter.emit("chat-updated");
  return updated;
};

export const updateBotState = (key, updates) => {
  if (!chatCache[key]) return;
  chatCache[key].otherUserState = { ...(chatCache[key].otherUserState || {}), ...updates };
  DeviceEventEmitter.emit("chat-updated");
};

export const updateUserState = (key, updates) => {
  if (!chatCache[key]) return;
  chatCache[key].chatState = { ...(chatCache[key].chatState || {}), ...updates };
  DeviceEventEmitter.emit("chat-updated");
};
