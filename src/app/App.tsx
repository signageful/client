import React from "react";
import { Screensaver } from "./screensaver";

const handleMessages = (evt: MessageEvent) => {
  // check if evt.data has "type" as property
  // if yes, then it is a message from the main process
  // if no, then it is a message from the iframe
  if (typeof evt.data === "object" && evt.data.type) {
    switch (evt.data.type) {
      case "signageful:screensaver:register": {
        window.electron.ipcRenderer.sendMessage("register-screensaver", {
          idleTime: evt.data.data.idleTime,
          source: evt.data.data.source,
        });
        return;
      }
      case "signageful:screensaver:unregister": {
        window.electron.ipcRenderer.sendMessage("unregister-screensaver", {
          threshold: evt.data.threshold,
        });
        return;
      }
      default: {
        window.electron.ipcRenderer.sendMessage("message", evt.data);
      }
    }
    // handle message from main process
    // ...
  }
};

const searchParams = new URLSearchParams(window.location.search);
const target = searchParams.get("target") || "";

export const App: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <iframe
        title="External"
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        src={target!}
        width="100%"
        height="100%"
        style={{
          border: "none",
        }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onLoad={(event) => {
          const iframe = event.currentTarget as HTMLIFrameElement;
          const iframeWindow = iframe.contentWindow;
          if (!iframeWindow) return;

          iframeWindow.addEventListener("message", handleMessages);
        }}
      />
      <Screensaver />
    </div>
  );
};
