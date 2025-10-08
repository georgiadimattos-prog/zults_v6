// ChatTest.js
import {
  enterChat,
  leaveChat,
  requestRezults,
  shareRezults,
  stopSharing,
  sendMessageToRezy,
  getChatCache,
} from "./ChatActions.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Mock setChatData just prints updates to console
const setChatData = (data) => {
  const last = data[data.length - 1];
  if (!last) return;
  console.log(
    `[${last.username}] (${last.type}) → ${last.text || "(typing...)"}`
  );
};

// Define fake users
const mainUser = { id: "jonster", name: "Jonster", avatar: "🧠" };
const demoUser = { id: "demo1", name: "Demo1", avatar: "🤖", isBot: true };
const rezyBot = { id: "zults-demo", name: "Rezy", avatar: "💜", isBot: true };

(async () => {
  console.log("=== DEMO FLOW TEST ===");
  console.log("Entering Demo1 chat...");
  enterChat(demoUser, setChatData);

  console.log("Jonster → Request Rezults");
  requestRezults(demoUser, setChatData);

  console.log("⏳ Wait for scripted flow (20 s total)...");
  await sleep(20000);

  console.log("\n--- Stopping all timers ---");
  leaveChat(demoUser.id);

  console.log("\n=== SHARE FLOW TEST ===");
  shareRezults(demoUser, setChatData);
  await sleep(12000);
  stopSharing(demoUser, setChatData);

  console.log("\n=== REZY CHAT TEST ===");
  enterChat(rezyBot, setChatData);
  sendMessageToRezy(rezyBot, setChatData, "Hi Rezy!");
  await sleep(2500);

  console.log("\n=== CACHE DUMP ===");
  console.dir(getChatCache(), { depth: null });
})();
