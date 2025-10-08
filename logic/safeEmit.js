import { DeviceEventEmitter } from "react-native";

export function safeEmit(eventName, payload) {
  requestAnimationFrame(() => {
    try {
      DeviceEventEmitter.emit(eventName, payload);
    } catch (err) {
      console.warn("safeEmit error:", err?.message);
    }
  });
}
