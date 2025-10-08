// /logic/chatManager.js
import { appendMessage, createMessage, updateBotState, replaceChatData, updateUserState } from "../cache/chatCacheHelpers";
import { startRequestFlowFor, startShareFlowFor, stopDemoFor, resumeDemoFor } from "./demoEngine";
import { seedRezyIntro, replyFromRezy } from "./rezyBot";
import { chatCache } from "../cache/chatCache";
import { rezultsCache } from "../cache/rezultsCache";

/**
 * chatManager
 * - UI calls these functions. They operate on chatCache and call demoEngine/rezyBot as needed.
 */

export const enterChat = (user, setChatData) => {
  const key = user.id;
  // ensure chatCache entry exists
  if (!chatCache[key]) {
    chatCache[key] = {
      user,
      chatData: [],
      otherUserState: {},
      chatState: {},
      hasUnread: false,
    };
  }
  const savedData = chatCache[key].chatData || [];
  replaceChatData(key, savedData, "local"); // re-emit so screens can sync
  setChatData(savedData);

  // Rezy special: seed intro if empty
  if (key === "zults-demo" && savedData.length === 0) {
    seedRezyIntro(user, setChatData);
    return;
  }

  // For demo users, if botState indicates share/request we can resume engine
  const botState = chatCache[key].otherUserState || {};
  if (key !== "zults-demo" && (botState.hasRequested || botState.hasShared)) {
    // ask engine to resume (idempotent)
    resumeDemoFor(user, setChatData);
  }
};

export const leaveChat = (userId) => {
  // stop timers (demo engine will preserve nothing in memory if cleared)
  stopDemoFor(userId);
  // do not wipe chatCache
};

export const requestRezults = (user, setChatData) => {
  const key = user.id;
  const msg = createMessage("request", "from-user", "You", null);
  appendMessage(key, msg, "local");
  setChatData((p) => [...p, msg]);

  // start demo engine (demo reacts)
  startRequestFlowFor(user, setChatData);
  // update any client-local user state if needed
  updateUserState(key, { lastRequestedAt: Date.now() }, "local");
};

export const shareRezults = (user, setChatData) => {
  const key = user.id;
  // guard: if no rezults, consumer should prevent calling this; but double-check
  if (!rezultsCache.hasRezults) {
    // return a flag: UI should open modal instead
    return { error: "no-rezults" };
  }

  const msg = createMessage("share", "from-user", "You", null);
  appendMessage(key, msg, "local");
  setChatData((p) => [...p, msg]);
  // mark user state as sharing
  updateUserState(key, { hasShared: true }, "local");

  // if demo not already sharing, start engine mutual flow
  const botState = chatCache[key]?.otherUserState || {};
  startShareFlowFor(user, setChatData, !!botState.hasShared);
  return { ok: true };
};

export const stopSharing = (user, setChatData) => {
  const key = user.id;
  const msg = createMessage("stop-share", "from-user", "You", null);
  appendMessage(key, msg, "local");
  setChatData((p) => [...p, msg]);
  updateUserState(key, { hasShared: false }, "local");
};
