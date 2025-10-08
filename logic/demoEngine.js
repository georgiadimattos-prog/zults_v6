// /logic/demoEngine.js
import { createMessage, appendMessage, updateBotState } from "../cache/chatCacheHelpers";

/**
 * demoEngine
 * - Manages scripted demo flows for demo users (e.g. "Melany", "Demo2"... NOT Rezy).
 * - One flow per userId. Flows are tokenized so old timers can't write after a restart.
 */

const stateByUser = {}; // { [userId]: { token, timers: [], step, isRunning, startedAt, remaining } }

const newToken = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const clearTimersFor = (userId) => {
  const s = stateByUser[userId];
  if (!s) return;
  (s.timers || []).forEach((t) => clearTimeout(t));
  s.timers = [];
};

export const stopDemoFor = (userId) => {
  if (!stateByUser[userId]) return;
  clearTimersFor(userId);
  delete stateByUser[userId];
};

export const startRequestFlowFor = (user, setChatData) => {
  if (!user?.id || user.id === "zults-demo") return;
  const userId = user.id;

  // If engine already running and in share mode, don't restart
  if (stateByUser[userId] && stateByUser[userId].isRunning) return;

  clearTimersFor(userId);
  const token = newToken();
  stateByUser[userId] = { token, timers: [], isRunning: true, step: null, startedAt: Date.now() };

  const scheduleTypingThen = (delay, cb) => {
    const t1 = setTimeout(() => {
      // verify token still current
      if (!stateByUser[userId] || stateByUser[userId].token !== token) return;
      const typing = createMessage("typing", "from-other", user.name, user.image);
      appendMessage(userId, typing, "local");
      setChatData((p) => [...p, typing]);

      const t2 = setTimeout(() => {
        if (!stateByUser[userId] || stateByUser[userId].token !== token) return;
        // remove typing bubble locally (we'll append final message)
        setChatData((prev) => prev.filter((m) => m.id !== typing.id));
        cb();
      }, 1400);

      stateByUser[userId].timers.push(t2);
    }, delay);

    stateByUser[userId].timers.push(t1);
  };

  // Step 1: after 5s -> request message
  scheduleTypingThen(5000, () => {
    if (!stateByUser[userId] || stateByUser[userId].token !== token) return;
    const msg = createMessage("request", "from-other", user.name, user.image);
    appendMessage(userId, msg, "local");
    updateBotState(userId, { hasRequested: true }, "local");
    setChatData((p) => [...p, msg]);
    stateByUser[userId].step = "request";
  });

  // Step 2: after 10s -> share (if not interrupted)
  scheduleTypingThen(10000, () => {
    if (!stateByUser[userId] || stateByUser[userId].token !== token) return;
    const msg = createMessage("share", "from-other", user.name, user.image);
    appendMessage(userId, msg, "local");
    updateBotState(userId, { hasRequested: false, hasShared: true }, "local");
    setChatData((p) => [...p, msg]);
    stateByUser[userId].step = "share";
  });

  // Step 3: after 15s -> stop sharing
  scheduleTypingThen(15000, () => {
    if (!stateByUser[userId] || stateByUser[userId].token !== token) return;
    const msg = createMessage("stop-share", "from-other", user.name, user.image);
    appendMessage(userId, msg, "local");
    updateBotState(userId, { hasShared: false, hasRequested: false }, "local");
    setChatData((p) => [...p, msg]);
    stateByUser[userId].step = "stop";
    // done
    clearTimersFor(userId);
    delete stateByUser[userId];
  });
};

export const startShareFlowFor = (user, setChatData, demoAlreadySharing = false) => {
  if (!user?.id || user.id === "zults-demo") return;
  // If demo already sharing, don't start a new flow (mutual share guard)
  if (demoAlreadySharing) return;
  // Reuse the request flow sequence (demo will respond with share)
  startRequestFlowFor(user, setChatData);
};

export const resumeDemoFor = (user, setChatData) => {
  // If there's stateByUser with timers cleared (e.g. app restarted) we can restart from step
  // For simplicity, if existing bot state shows hasShared or hasRequested we re-run startRequestFlowFor
  if (!user?.id || user.id === "zults-demo") return;
  startRequestFlowFor(user, setChatData);
};
