// logic/useReciprocalShare.js
import { chatCache, safeEmit } from "../cache/chatCache";
import { createMessage } from "../cache/chatCacheHelpers";

const getLocalTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const useReciprocalShare = () => {
  const handleUserShare = () => {
    Object.keys(chatCache).forEach((key) => {
      const chat = chatCache[key];
      const user = chat?.user;
      if (!user?.isBot || user.id === "zults-demo") return;

      const botState = chat.otherUserState || {};
      if (!botState.hasShared) {
        const msg = createMessage("share", "from-other", user.name, user.image);
        chat.chatData = [...(chat.chatData || []), msg];
        chat.otherUserState = { hasShared: true, hasRequested: false };
        chat.hasUnread = true;
      } else {
        const msg = createMessage("stop-share", "from-other", user.name, user.image);
        chat.chatData = [...(chat.chatData || []), msg];
        chat.otherUserState = { hasShared: false, hasRequested: false };
        chat.hasUnread = true;
      }

      chatCache[key] = chat;
      safeEmit();
    });
  };

  return { handleUserShare };
};
