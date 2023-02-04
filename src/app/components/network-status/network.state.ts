import { atom } from "recoil";

export const networkState = atom({
  key: "networkState",
  default: {
    isOnline: false,
  },
});
