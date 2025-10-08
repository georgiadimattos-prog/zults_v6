// logic/RezyBot.js
import { createMessage, appendMessage } from "../cache/chatCacheHelpers";

/**
 * RezyBot – fake conversational bot for "zults-demo" chat.
 * Handles typing + reply messages.
 */

export const replyFromRezy = (user, setChatData, userText) => {
  if (!user?.id) return;
  const key = user.id;
  const typing = createMessage("typing", "from-other", "Rezy", user.image);
  appendMessage(key, typing, "local");
  setChatData((prev) => [...prev, typing]);

  setTimeout(() => {
    // remove typing bubble
    setChatData((prev) => prev.filter((m) => m.id !== typing.id));

    const lower = (userText || "").toLowerCase();
    let text = "That’s a great question! 💭";
    if (lower.includes("hello") || lower.includes("hi"))
      text = "Hey there 👋 What’s on your mind?";
    if (lower.includes("results") || lower.includes("rezults"))
      text = "Rezults helps you privately share verified STI test results. 💜";
    if (lower.includes("privacy"))
      text = "Everything’s encrypted. Only you control who sees your Rezults.";

    const msg = createMessage("text", "from-other", "Rezy", user.image, text);
    appendMessage(key, msg, "local");
    setChatData((prev) => [...prev, msg]);
  }, 1200);
};
