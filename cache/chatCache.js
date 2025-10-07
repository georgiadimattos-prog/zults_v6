// cache/chatCache.js
export const chatCache = {};

// simple module-level flag for demo seeding
let demoSeeded = false;

export function hasSeededDemo() {
  return demoSeeded;
}

export function markDemoSeeded() {
  demoSeeded = true;
}
