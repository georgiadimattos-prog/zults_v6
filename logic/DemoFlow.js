// logic/DemoFlow.js
export const runDemoFlow = (user, addMessage, setIsTyping, setButtonState) => {
  if (!user || user.id === "zults-demo") return;

  // typing dots start
  setIsTyping(true);

  // Demo1 replying
  setTimeout(() => {
    setIsTyping(false);
    addMessage({
      direction: "from-other",
      username: user.name,
      text: `Request from ${user.name}`,
      type: "request",
    });
  }, 2000);

  // Demo1 sharing Rezults
  setTimeout(() => {
    addMessage({
      direction: "from-other",
      username: user.name,
      text: `${user.name} is sharing Rezults`,
      type: "share",
    });
    setButtonState("view");
  }, 5000);

  // Demo1 stops sharing
  setTimeout(() => {
    addMessage({
      direction: "from-other",
      username: user.name,
      text: `${user.name} stopped sharing Rezults`,
      type: "stop",
    });
    setButtonState("request");
  }, 9000);
};
