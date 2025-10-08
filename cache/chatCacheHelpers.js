// /cache/chatCacheHelpers.js
import { DeviceEventEmitter } from "react-native";
import { chatCache } from './chatCache';

const emitUpdate = (scope = "local") => {
  // local = screen-level; global = app-level (activities/main screens)
  requestAnimationFrame(() => {
    if (scope === "global") DeviceEventEmitter.emit("chat-updated");
    if (scope === "local") DeviceEventEmitter.emit("chat-updated-local");
  });
};

export const createMessage = (type, direction, username, avatar, text = "") => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  type,
  direction,
  username,
  avatar,
  ...(text ? { text } : {}),
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
});

export const appendMessage = (key, msg, scope = "local") => {
  const chat = chatCache[key] || {};
  const updated = [...(chat.chatData || []), msg];
  chatCache[key] = {
    ...(chatCache[key] || {}),
    user: chat.user || null,
    chatData: updated,
    hasUnread: true,
  };
  emitUpdate(scope);
  return updated;
};

export const replaceChatData = (key, data = [], scope = "local") => {
  const chat = chatCache[key] || {};
  chatCache[key] = {
    ...(chatCache[key] || {}),
    user: chat.user || null,
    chatData: data,
    hasUnread: true,
  };
  emitUpdate(scope);
  return data;
};

export const updateBotState = (key, updates = {}, scope = "local") => {
  if (!chatCache[key]) chatCache[key] = { user: null, chatData: [] };
  chatCache[key].otherUserState = { ...(chatCache[key].otherUserState || {}), ...updates };
  emitUpdate(scope);
};

export const updateUserState = (key, updates = {}, scope = "local") => {
  if (!chatCache[key]) chatCache[key] = { user: null, chatData: [] };
  chatCache[key].chatState = { ...(chatCache[key].chatState || {}), ...updates };
  emitUpdate(scope);
};
