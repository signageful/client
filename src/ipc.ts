import { ipcMain, powerMonitor } from "electron";
import {
  IPC_SCREENSAVER_REGISTER,
  IPC_SCREENSAVER_UNREGISTER,
} from "./shared/events";

ipcMain.addListener("ipc-example", (event, args) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(args));
  event.reply("ipc-example", msgTemplate("pong"));
});

ipcMain.addListener("message", (event, args) => {
  event.reply("message", "pong");
});

type ScreensaverOptions = {
  idleTime: number | string;
  source: string;
};

let screenSaverInterval: NodeJS.Timeout | null = null;

ipcMain.on(IPC_SCREENSAVER_REGISTER, async (event, arg: ScreensaverOptions) => {
  if (!arg) {
    return;
  }
  if (!arg.idleTime) {
    return;
  }

  screenSaverInterval = setInterval(() => {
    const idleTime = parseInt(arg.idleTime as string, 10);
    const idleState = powerMonitor.getSystemIdleState(idleTime);

    if (idleState === "idle") {
      event.sender.send("show-screen-saver", arg.source);
    } else {
      event.sender.send("hide-screen-saver");
    }

    // check every second
  }, 1000);
});

ipcMain.on(IPC_SCREENSAVER_UNREGISTER, async (event, arg) => {
  if (screenSaverInterval) {
    clearInterval(screenSaverInterval);
    screenSaverInterval = null;
  }
  event.sender.send("hide-screen-saver");
});
