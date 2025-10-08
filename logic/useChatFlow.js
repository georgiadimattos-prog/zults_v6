// logic/useChatFlow.js
import { createMessage, appendMessage, updateBotState } from "../cache/chatCacheHelpers";

// One flow per user, guarded by tokens so old timers cannot write after remount.
const timersByUser = {};
const tokenByUser = {};
const newToken = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function pushTimer(userId, t) {
  if (!timersByUser[userId]) timersByUser[userId] = [];
  timersByUser[userId].push(t);
}

export function useChatFlow(user) {
  const userId = user?.id;

  const clearTimers = () => {
    if (!userId) return;
    if (timersByUser[userId]) {
      timersByUser[userId].forEach(clearTimeout);
      delete timersByUser[userId];
    }
    delete tokenByUser[userId];
  };

  // Jonster requests Rezults → Demo runs 5s/10s/15s with typing before each
  const startRequestFlow = (setChatData) => {
    if (!userId || userId === "zults-demo") return;

    // If a flow exists, replace it with a fresh token and clear previous timers
    clearTimers();
    const token = newToken();
    tokenByUser[userId] = token;

    const key = userId;
    const addTypingThen = (delayMs, afterTyping) => {
      pushTimer(
        userId,
        setTimeout(() => {
          if (tokenByUser[userId] !== token) return;
          const typing = createMessage("typing", "from-other", user.name, user.image);
          appendMessage(key, typing, "local");
          setChatData((p) => [...p, typing]);

          pushTimer(
            userId,
            setTimeout(() => {
              if (tokenByUser[userId] !== token) return;
              setChatData((p) => p.filter((m) => m.id !== typing.id));
              afterTyping();
            }, 1400)
          );
        }, delayMs)
      );
    };

    // 5s: Demo "request"
    addTypingThen(5000, () => {
      const msg = createMessage("request", "from-other", user.name, user.image);
      appendMessage(key, msg, "local");
      updateBotState(key, { hasRequested: true }, "local");
      setChatData((p) => [...p, msg]);
    });

    // 10s: Demo "share"
    addTypingThen(10000, () => {
      const msg = createMessage("share", "from-other", user.name, user.image);
      appendMessage(key, msg, "local");
      updateBotState(key, { hasRequested: false, hasShared: true }, "local");
      setChatData((p) => [...p, msg]);
    });

    // 15s: Demo "stop-share" and end flow
    addTypingThen(15000, () => {
      const msg = createMessage("stop-share", "from-other", user.name, user.image);
      appendMessage(key, msg, "local");
      updateBotState(key, { hasShared: false, hasRequested: false }, "local");
      setChatData((p) => [...p, msg]);
      clearTimers();
    });
  };

  // Jonster shares first → if Demo already sharing, skip; else run same scripted flow
  const startShareFlow = (setChatData, demoAlreadySharing) => {
    if (!userId || userId === "zults-demo") return;
    if (demoAlreadySharing) return; // mutual share: do not restart
    startRequestFlow(setChatData);
  };

  return { startRequestFlow, startShareFlow, clearTimers };
}
