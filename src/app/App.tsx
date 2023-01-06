import React, { useEffect } from "react";

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

          iframeWindow.addEventListener("message", (evt) => {
            window.electron.ipcRenderer.sendMessage("message", evt.data);
          });
        }}
      />
    </div>
  );
};
