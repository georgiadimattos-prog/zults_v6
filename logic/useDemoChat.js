// logic/useDemoChat.js
import { appendMessage, updateBotState, createMessage } from "../cache/chatCacheHelpers";
import { safeEmit } from "./safeEmit";

/**
 * 🧩 useDemoChat
 * Handles all scripted demo flows (Melany, Demo2–4)
 * → request (5s) → share (10s) → stop-share (15s)
 */
export function useDemoChat(user) {
  if (!user || !user.id) {
    return {
      startRequestFlow: () => {},
      clearTimers: () => {},
      restoreButtonState: () => "request",
    };
  }

  let timers = [];

  const clearTimers = () => {
    timers.forEach((t) => clearTimeout(t));
    timers = [];
  };

  /**
   * Sticky CTA guard:
   * - If we're already "view", don't downgrade.
   * - Otherwise keep it "requested" until explicit stop-share.
   */
  const setButtonStateSafely = (setButtonStateFn, next) => {
    if (!setButtonStateFn) return;
    setButtonStateFn((prev) => {
      if (prev === "view" && next !== "view") return "view";     // never downgrade view mid-flow
      if (prev === "requested" && next === "request") return "requested"; // don't drop back during bot messages
      return next;
    });
  };

  /**
   * 🪄 Scripted bot flow (used by UserChatScreen)
   */
  const startRequestFlow = (setChatDataFn, setButtonStateFn) => {
    if (typeof setChatDataFn !== "function") {
      console.warn("⚠️ startRequestFlow called without setChatData");
      return;
    }

    clearTimers();
    const key = user.id;

    // 🔒 Lock CTA as "requested" immediately to avoid flicker before any bot messages land
    setButtonStateSafely(setButtonStateFn, "requested");

    // 🟢 Step 1 — Bot sends "request" after 5s (this SHOULD NOT change CTA)
    timers.push(
      setTimeout(() => {
        const msg = createMessage("request", "from-other", user.name, user.image);
        appendMessage(key, msg);
        updateBotState(key, { hasRequested: true });
        safeEmit("chat-updated");

        setChatDataFn((prev) => [...prev, msg]);
        // 🚫 Do NOT change CTA here — it stays "requested"
      }, 5000)
    );

    // 🔵 Step 2 — Bot shares after 10s → CTA = "view"
    timers.push(
      setTimeout(() => {
        const msg = createMessage("share", "from-other", user.name, user.image);
        appendMessage(key, msg);
        updateBotState(key, { hasRequested: false, hasShared: true });
        safeEmit("chat-updated");

        setChatDataFn((prev) => [...prev, msg]);
        setButtonStateSafely(setButtonStateFn, "view");
      }, 10000)
    );

    // 🔴 Step 3 — Bot stops share after 15s → CTA = "request"
    timers.push(
      setTimeout(() => {
        const msg = createMessage("stop-share", "from-other", user.name, user.image);
        appendMessage(key, msg);
        updateBotState(key, { hasRequested: false, hasShared: false });
        safeEmit("chat-updated");

        setChatDataFn((prev) => [...prev, msg]);
        setButtonStateSafely(setButtonStateFn, "request");
      }, 15000)
    );
  };

  /**
   * 🧠 Restore top button state (for re-entering chat)
   * Scans backward and ignores "request" from-other and "typing".
   * Falls back to the current state to avoid accidental downgrades.
   */
  const restoreButtonState = (chatData = [], currentState = "request") => {
    for (let i = chatData.length - 1; i >= 0; i--) {
      const m = chatData[i];
      if (!m) continue;

      // Only these three events should drive the CTA:
      if (m.type === "share" && m.direction === "from-other") return "view";
      if (m.type === "stop-share" && m.direction === "from-other") return "request";
      if (m.type === "request" && m.direction === "from-user") return "requested";

      // Ignore: "request" from-other, "typing", plain text, etc.
    }
    return currentState; // keep whatever we had if nothing decisive found
  };

  return { startRequestFlow, clearTimers, restoreButtonState };
}
