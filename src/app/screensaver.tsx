import React, { useCallback, useEffect, useRef, useState } from "react";

export const Screensaver: React.FC = () => {
  const [state, setState] = useState<{
    show: boolean;
  }>({
    show: false,
  });

  const videoEl = useRef<HTMLVideoElement>(null);

  const manageState = useCallback(
    (newState: boolean) => {
      if (newState === state.show) return;

      setState((prevState) => ({
        ...prevState,
        show: newState,
      }));
    },
    [state.show]
  );

  useEffect(() => {
    if (!window) return;

    window.electron.ipcRenderer.on("show-screen-saver", () =>
      manageState(true)
    );

    window.electron.ipcRenderer.on("hide-screen-saver", () => {
      manageState(false);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners("show-screen-saver");
      window.electron.ipcRenderer.removeAllListeners("hide-screen-saver");
    };
  }, [manageState]);

  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch((error) => {
        console.error("Error attempting to play", error);
      });
  };

  const handleLoad = () => {
    attemptPlay();
  };

  if (!state.show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.92)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontSize: "2rem",
      }}
    >
      <video
        ref={videoEl}
        autoPlay
        loop
        playsInline
        muted
        onLoad={handleLoad}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        ></source>
        Your browser does not support MP4 Format videos or HTML5 Video.
      </video>
    </div>
  );
};
