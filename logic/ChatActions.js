// logic/ChatActions.js

export const startRequestFlow = async (
  user,
  addMessage,
  updateChatState,
  setIsTyping
) => {
  // 🛡️ Skip Rezy only
  if (user.id === "zults-demo") return;

  // 🧠 Mark request as active
  updateChatState((prev) => ({
    ...prev,
    hasRequested: true,
    hasShared: false,
  }));

  // 3s: typing indicator
  setTimeout(() => setIsTyping(true), 3000);

  // 5s: bot sends "Request from DemoX"
  setTimeout(() => {
    setIsTyping(false);
    addMessage({
      direction: "from-other",
      username: user.name,
      avatar: user.image,
      text: `Request from ${user.name}`,
      type: "request",
    });
  }, 5000);

  // 10s: bot sends "DemoX is sharing Rezults"
  setTimeout(() => {
    addMessage({
      direction: "from-other",
      username: user.name,
      avatar: user.image,
      text: `${user.name} is sharing Rezults`,
      type: "share",
    });

    updateChatState((prev) => ({
      ...prev,
      hasShared: true,
    }));
  }, 10000);

  // 15s: bot sends "DemoX stopped sharing Rezults"
  setTimeout(() => {
    addMessage({
      direction: "from-other",
      username: user.name,
      avatar: user.image,
      text: `${user.name} stopped sharing Rezults`,
      type: "stop",
    });

    updateChatState((prev) => ({
      ...prev,
      hasRequested: false,
      hasShared: false,
    }));
  }, 15000);
};

export const startShareFlow = async (
  user,
  addMessage,
  updateChatState,
  setIsTyping
) => {
  if (user.id === "zults-demo") return;

  updateChatState((prev) => ({
    ...prev,
    hasShared: true,
  }));

  addMessage({
    direction: "to-me",
    text: "Sharing Rezults",
    type: "share",
  });

  setTimeout(() => {
    addMessage({
      direction: "from-other",
      username: user.name,
      avatar: user.image,
      text: `${user.name} stopped sharing Rezults`,
      type: "stop",
    });

    updateChatState((prev) => ({
      ...prev,
      hasShared: false,
    }));
  }, 10000);
};
