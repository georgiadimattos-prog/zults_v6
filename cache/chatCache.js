// cache/chatCache.js
export const chatCache = {};

let demoSeeded = false;  // keep private inside module

export function hasSeededDemo() {
  return demoSeeded;
}

export function markDemoSeeded() {
  demoSeeded = true;
}
