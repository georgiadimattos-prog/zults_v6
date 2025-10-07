// logic/useDemoChat.js
import {
  appendMessage,
  updateBotState,
  createMessage,
} from "../cache/chatCacheHelpers";
import { safeEmit } from "../cache/chatCache";

export function useDemoChat(user) {
  if (!user || !user.id) {
    return {
      startRequestFlow: () => {},
      restoreButtonState: () => "request",
      clearTimers: () => {},
    };
  }

  let timers = [];
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  const startRequestFlow = (setChatData, setButtonState) => {
    console.log("▶️ Starting demo flow for", user.name);
    clearTimers();
    const key = user.id;

    // typing → 3s
    timers.push(setTimeout(() => {
      appendMessage(key, createMessage("typing", "from-other", user.name, user.image));
      safeEmit();
    }, 3000));

    // request → 5s
    timers.push(setTimeout(() => {
      const msg = createMessage("request", "from-other", user.name, user.image);
      appendMessage(key, msg);
      updateBotState(key, { hasRequested: true, hasShared: false });
      safeEmit();
      setChatData(prev => [...prev, msg]);
    }, 5000));

    // share → 10s
    timers.push(setTimeout(() => {
      const msg = createMessage("share", "from-other", user.name, user.image);
      appendMessage(key, msg);
      updateBotState(key, { hasRequested: false, hasShared: true });
      safeEmit();
      setChatData(prev => [...prev, msg]);
      setButtonState && setButtonState("view");
    }, 10000));

    // stop-share → 15s
    timers.push(setTimeout(() => {
      const msg = createMessage("stop-share", "from-other", user.name, user.image);
      appendMessage(key, msg);
      updateBotState(key, { hasRequested: false, hasShared: false });
      safeEmit();
      setChatData(prev => [...prev, msg]);
      setButtonState && setButtonState("request");
    }, 15000));
  };

  const restoreButtonState = (chatData) => {
    const last = chatData?.[chatData.length - 1];
    if (!last) return "request";
    if (last.type === "request" && last.direction === "from-user") return "requested";
    if (last.type === "share" && last.direction === "from-other") return "view";
    if (last.type === "stop-share" && last.direction === "from-other") return "request";
    return "request";
  };

  return { startRequestFlow, restoreButtonState, clearTimers };
}
