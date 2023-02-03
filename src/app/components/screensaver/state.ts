import { atom } from "recoil";

export const screenSaverState = atom({
  key: "screenSaverState",
  default: false,
});

export const screenSaverSource = atom({
  key: "screenSaverSource",
  default: "",
});
