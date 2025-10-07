// logic/safeEmit.js
import { DeviceEventEmitter } from "react-native";

/**
 * Emits events safely after the current render frame,
 * preventing "setState while rendering" warnings.
 */
export function safeEmit(eventName, payload) {
  requestAnimationFrame(() => {
    try {
      DeviceEventEmitter.emit(eventName, payload);
    } catch (err) {
      console.warn("safeEmit error:", err?.message);
    }
  });
}
