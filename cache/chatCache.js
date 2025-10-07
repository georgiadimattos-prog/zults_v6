// cache/chatCache.js
import { DeviceEventEmitter } from "react-native";

/**
 * Global chat cache singleton
 */
export const chatCache = {};

/**
 * Demo seed helpers
 */
let demoSeeded = false;
export const hasSeededDemo = () => demoSeeded;
export const markDemoSeeded = () => { demoSeeded = true; };

/**
 * Safe event emit wrapper
 */
export const safeEmit = (event = "chat-updated") => {
  try {
    requestAnimationFrame(() => DeviceEventEmitter.emit(event));
  } catch {
    // ignore
  }
};