export const isDebug =
  (typeof process !== "undefined" && process.env.NODE_ENV === "development") ||
  (typeof process !== "undefined" && process?.env.DEBUG_PROD === "true");

export const __DEV__ =
  typeof process == "undefined"
    ? true
    : process?.env?.NODE_ENV !== "production";
