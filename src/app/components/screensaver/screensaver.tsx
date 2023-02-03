import React, { useRef } from "react";
import { useRecoilValue } from "recoil";
import { screenSaverSource, screenSaverState } from "./state";

export const Screensaver: React.FC = () => {
  const isShown = useRecoilValue(screenSaverState);
  const source = useRecoilValue(screenSaverSource);

  const videoEl = useRef<HTMLVideoElement>(null);

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

  if (!isShown) return null;
  if (!source || source === "") return null;

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
        <source src={source}></source>
        Your browser does not support MP4 Format videos or HTML5 Video.
      </video>
    </div>
  );
};
