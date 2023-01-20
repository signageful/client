import React from "react";
import { Screensaver } from "./screensaver";
import {
  IPC_SCREENSAVER_REGISTER,
  IPC_SCREENSAVER_UNREGISTER,
  SIGNAGEFUL_SCREENSAVER_REGISTER,
  SIGNAGEFUL_SCREENSAVER_UNREGISTER,
} from "../shared/events";
import { useSystemInfo } from "./hooks/use-system-info";

const handleMessages = (evt: MessageEvent) => {
  // check if evt.data has "type" as property
  // if yes, then it is a message from the main process
  // if no, then it is a message from the iframe
  if (typeof evt.data === "object" && evt.data.type) {
    console.log("received event: ", evt.data.type, evt.data.data || "");
    switch (evt.data.type) {
      case SIGNAGEFUL_SCREENSAVER_REGISTER: {
        window.electron.ipcRenderer.sendMessage(IPC_SCREENSAVER_REGISTER, {
          idleTime: evt.data.data.idleTime,
          source: evt.data.data.source,
        });
        break;
      }
      case SIGNAGEFUL_SCREENSAVER_UNREGISTER: {
        console.log("unregistering screensaver");
        window.electron.ipcRenderer.sendMessage(IPC_SCREENSAVER_UNREGISTER, {
          threshold: evt.data.threshold,
        });
        break;
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
const targetURL = new URL(target);
const serialParams = new URLSearchParams(targetURL.search);
const serial = serialParams.get("serial") || "";

export const App: React.FC = () => {
  useSystemInfo(serial);

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
