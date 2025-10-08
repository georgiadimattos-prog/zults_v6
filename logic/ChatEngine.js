// zults_v7/logic/ChatEngine.js
// Demo chat engine with persistent bot messages (fully remembers bubbles)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getChatCache } from "./ChatActions"; // safe circular import

const ChatEngine = (() => {
  const state = {};
  const setChatRef = {};

  const STAGES = {
    REQUEST: "request",
    SHARE: "share",
    STOP: "stop-share",
  };

  const STAGE_TIMES = {
    [STAGES.REQUEST]: 5000,
    [STAGES.SHARE]: 10000,
    [STAGES.STOP]: 15000,
  };

  const newToken = () => Math.random().toString(36).slice(2);

  const persistCache = async () => {
    try {
      const cache = getChatCache();
      await AsyncStorage.setItem("chatCache", JSON.stringify(cache));
    } catch (err) {
      console.log("💾 Error saving chatCache:", err);
    }
  };

  const stopAllForUser = (userId) => {
    const entry = state[userId];
    if (entry) entry.timers.forEach(clearTimeout);
    delete state[userId];
    delete setChatRef[userId];
  };

  const pushMessage = (user, msg) => {
    const setChatData = setChatRef[user.id];
    if (!setChatData) return;

    // Push to UI
    setChatData((prev) => [...prev, msg]);

    // Push to cache for persistence
    try {
      const cache = getChatCache();
      if (cache[user.id]) {
        cache[user.id].chatData.push(msg);
      }
      persistCache();
    } catch (e) {
      console.log("Cache update error:", e);
    }
  };

  const replaceTypingWith = (user, typingId, realMsg) => {
    const setChatData = setChatRef[user.id];
    if (!setChatData) return;

    setChatData((prev) => {
      const filtered = prev.filter((m) => m.id !== typingId);
      return [...filtered, realMsg];
    });

    try {
      const cache = getChatCache();
      if (cache[user.id]) {
        cache[user.id].chatData = cache[user.id].chatData.filter(
          (m) => m.id !== typingId
        );
        cache[user.id].chatData.push(realMsg);
      }
      persistCache();
    } catch (e) {
      console.log("replaceTypingWith cache error:", e);
    }
  };

  const scheduleStage = (user, token, delayMs, stage, text) => {
    const entry = state[user.id];
    if (!entry) return;

    const timer = setTimeout(() => {
      const current = state[user.id];
      if (!current || current.token !== token || !current.isRunning) return;
      if (stage === STAGES.STOP && !current.delivered[STAGES.SHARE]) return;

      const typingId = `${Date.now()}-${stage}-typing`;

      pushMessage(user, {
        id: typingId,
        type: "typing",
        direction: "from-other",
        username: user.name,
        avatar: user.avatar,
        timestamp: new Date().toISOString(),
      });

      const addMsgTimer = setTimeout(() => {
        const again = state[user.id];
        if (!again || again.token !== token || !again.isRunning) return;
        const realMsg = {
          id: Date.now(),
          type: stage,
          direction: "from-other",
          username: user.name,
          avatar: user.avatar,
          text,
          timestamp: new Date().toISOString(),
        };
        replaceTypingWith(user, typingId, realMsg);
        again.delivered[stage] = true;
        again.step = stage;
      }, 2000);

      current.timers.push(addMsgTimer);
    }, delayMs);

    entry.timers.push(timer);
  };

  // ---------- Core Flow Creators ----------

  const startRequestFlow = (user, setChatData) => {
    stopAllForUser(user.id);
    const token = newToken();
    const startTime = Date.now();

    state[user.id] = {
      token,
      timers: [],
      step: null,
      isRunning: true,
      delivered: {
        [STAGES.REQUEST]: false,
        [STAGES.SHARE]: false,
        [STAGES.STOP]: false,
      },
      startTime,
    };
    setChatRef[user.id] = setChatData;

    scheduleStage(user, token, 5000, STAGES.REQUEST, `Request from ${user.name}`);
    scheduleStage(user, token, 10000, STAGES.SHARE, `${user.name} is sharing Rezults`);
    scheduleStage(user, token, 15000, STAGES.STOP, `${user.name} stopped sharing Rezults`);
  };

  const startShareFlow = (user, setChatData, demoAlreadySharing = false) => {
    stopAllForUser(user.id);
    const token = newToken();
    const startTime = Date.now();

    state[user.id] = {
      token,
      timers: [],
      step: STAGES.SHARE,
      isRunning: true,
      delivered: {
        [STAGES.REQUEST]: false,
        [STAGES.SHARE]: false,
        [STAGES.STOP]: false,
      },
      startTime,
    };
    setChatRef[user.id] = setChatData;
    if (demoAlreadySharing) return;

    scheduleStage(user, token, 5000, STAGES.SHARE, `${user.name} is sharing Rezults`);
    scheduleStage(user, token, 10000, STAGES.STOP, `${user.name} stopped sharing Rezults`);
  };

  // ---------- Catch-Up Resume ----------
  const resumeFlowIfNeeded = (user, setChatData, lastStep, lastTimestamp) => {
    if (state[user.id]) return;

    const token = newToken();
    const now = Date.now();
    const elapsed = lastTimestamp ? now - new Date(lastTimestamp).getTime() : 0;

    setChatRef[user.id] = setChatData;

    const delivered = {
      [STAGES.REQUEST]: false,
      [STAGES.SHARE]: false,
      [STAGES.STOP]: false,
    };

    if (lastStep === STAGES.REQUEST) delivered[STAGES.REQUEST] = true;
    if (lastStep === STAGES.SHARE) {
      delivered[STAGES.REQUEST] = true;
      delivered[STAGES.SHARE] = true;
    }
    if (lastStep === STAGES.STOP) {
      delivered[STAGES.REQUEST] = true;
      delivered[STAGES.SHARE] = true;
      delivered[STAGES.STOP] = true;
    }

    const entry = {
      token,
      timers: [],
      step: lastStep || null,
      isRunning: true,
      delivered,
      startTime: now - elapsed,
    };
    state[user.id] = entry;

    // Catch-up instant messages if needed
    if (lastStep === STAGES.REQUEST && elapsed >= STAGE_TIMES[STAGES.SHARE]) {
      pushMessage(user, {
        id: Date.now(),
        type: STAGES.SHARE,
        direction: "from-other",
        username: user.name,
        avatar: user.avatar,
        text: `${user.name} is sharing Rezults`,
        timestamp: new Date().toISOString(),
      });
      entry.delivered[STAGES.SHARE] = true;
    }

    if (elapsed >= STAGE_TIMES[STAGES.STOP]) {
      pushMessage(user, {
        id: Date.now(),
        type: STAGES.STOP,
        direction: "from-other",
        username: user.name,
        avatar: user.avatar,
        text: `${user.name} stopped sharing Rezults`,
        timestamp: new Date().toISOString(),
      });
      entry.delivered[STAGES.STOP] = true;
    }

    // Schedule remaining steps only if not yet delivered
    if (!entry.delivered[STAGES.SHARE])
      scheduleStage(
        user,
        token,
        Math.max(5000 - elapsed, 1000),
        STAGES.SHARE,
        `${user.name} is sharing Rezults`
      );
    if (!entry.delivered[STAGES.STOP])
      scheduleStage(
        user,
        token,
        Math.max(10000 - elapsed, 2000),
        STAGES.STOP,
        `${user.name} stopped sharing Rezults`
      );
  };

  return {
    startRequestFlow,
    startShareFlow,
    stopAllForUser,
    resumeFlowIfNeeded,
  };
})();

export default ChatEngine;
