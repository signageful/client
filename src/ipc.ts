import { ipcMain } from "electron";

ipcMain.addListener("ipc-example", (event, args) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(args));
  event.reply("ipc-example", msgTemplate("pong"));
});

ipcMain.addListener("message", (event, args) => {
  event.reply("message", "pong");
});
