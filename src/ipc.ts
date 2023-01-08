import { ipcMain, powerMonitor } from "electron";

ipcMain.addListener("ipc-example", (event, args) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(args));
  event.reply("ipc-example", msgTemplate("pong"));
});

ipcMain.addListener("message", (event, args) => {
  console.log(args);
  event.reply("message", "pong");
});

let screenSaverInterval: NodeJS.Timeout | null = null;

ipcMain.on("register-screensaver", async (event, arg) => {
  if (screenSaverInterval) {
    return;
  }
  screenSaverInterval = setInterval(() => {
    const idleState = powerMonitor.getSystemIdleState(5);

    if (idleState === "idle") {
      event.sender.send("show-screen-saver");
    } else {
      event.sender.send("hide-screen-saver");
    }

    // check every second
  }, 1000);
});

ipcMain.on("unregister-screensaver", async (event, arg) => {
  if (screenSaverInterval) {
    clearInterval(screenSaverInterval);
  }

  ipcMain.emit("disable-screen-saver");
});
