import { useCallback, useEffect, useRef } from "react";
import {
  SIGNAGEFUL_SCREENSAVER_REGISTER,
  SIGNAGEFUL_SCREENSAVER_RESET,
  SIGNAGEFUL_SCREENSAVER_UNREGISTER,
} from "../../../shared/events";
import { screenSaverSource, screenSaverState } from "./state";
import { useRecoilState } from "recoil";
import useWebSocket from "react-use-websocket";

const SCREENSAVER_DEFAULT_INACTIVE_TIME_MS = 1000;

type ScreensaverOptions = {
  /**
   * IdleTime in seconds
   */
  idleTime: number | string;
  source: string;
};

const socketUrl = "ws://localhost:58501/ws";

type WSMessage = { action: "screensaver.show"; data: string };

export const useScreensaver = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [_isShown, setIsShown] = useRecoilState(screenSaverState);
  const [_setSource, setSource] = useRecoilState(screenSaverSource);

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    onMessage: ({ data }) => {
      const msg: WSMessage = JSON.parse(data);

      switch (msg.action) {
        case "screensaver.show": {
          setSource(msg.data);
          toggleShowScreensaver();
          break;
        }
      }
    },
  });

  /**
   * This function is called when the screensaver is registered.
   * it enables the screensaver and sets the idle time.
   */
  const registerScreensaver = (
    options: ScreensaverOptions = {
      idleTime: SCREENSAVER_DEFAULT_INACTIVE_TIME_MS,
      source: "",
    }
  ) => {
    sendJsonMessage({
      action: "screensaver.register",
      data: {
        threshold: parseInt(options.idleTime as string, 10),
        source: options.source,
      },
    });
  };

  function resetScreensaverOnInteraction() {
    setIsShown(false);
    sendJsonMessage({
      action: "screensaver.refresh",
      data: {},
    });
  }

  const registerInteractionEvents = useCallback(() => {
    window.addEventListener("mousemove", resetScreensaverOnInteraction);
    window.addEventListener("mousedown", resetScreensaverOnInteraction);
    window.addEventListener("keydown", resetScreensaverOnInteraction);
    window.addEventListener("touchstart", resetScreensaverOnInteraction);
    window.addEventListener("scroll", resetScreensaverOnInteraction);
    window.addEventListener("wheel", resetScreensaverOnInteraction);
  }, []);

  const unregisterInteractionEvents = useCallback(() => {
    window.removeEventListener("mousemove", resetScreensaverOnInteraction);
    window.removeEventListener("mousedown", resetScreensaverOnInteraction);
    window.removeEventListener("keydown", resetScreensaverOnInteraction);
    window.removeEventListener("touchstart", resetScreensaverOnInteraction);
    window.removeEventListener("scroll", resetScreensaverOnInteraction);
    window.removeEventListener("wheel", resetScreensaverOnInteraction);
  }, []);

  const toggleShowScreensaver = useCallback(() => {
    setIsShown(true);
    registerInteractionEvents();
  }, [setIsShown]);

  const unregisterScreensaver = useCallback(() => {
    unregisterInteractionEvents();
    setIsShown(false);
    sendJsonMessage({
      action: "screensaver.disable",
      data: {},
    });
  }, []);

  // resetScreensaver is called when the user interacts with the screensaver
  const resetScreensaver = useCallback(() => {
    resetScreensaverOnInteraction();
  }, []);

  useEffect(() => {
    // if the screensaver is enabled, call once resetScreensaver to start the interval
    resetScreensaver();
  }, [resetScreensaver]);

  const handleMessages = useCallback((evt: MessageEvent) => {
    if (typeof evt.data === "object" && evt.data.type) {
      switch (evt.data.type) {
        // on interaction
        case SIGNAGEFUL_SCREENSAVER_RESET: {
          resetScreensaver();
          break;
        }
        // on screensaver registration, e.g. onMount
        case SIGNAGEFUL_SCREENSAVER_REGISTER: {
          registerScreensaver(evt.data.data);
          break;
        }
        // on screensaver unregistration, e.g. onUnmount
        case SIGNAGEFUL_SCREENSAVER_UNREGISTER: {
          unregisterScreensaver();
          break;
        }
        default: {
          window.electron.ipcRenderer.sendMessage("message", evt.data);
        }
      }
    }
  }, []);

  const onLoad = (evt: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.contentWindow?.addEventListener("mousemove", () => {
        //
      });

      // receives events from nested iframes
      iframe.contentWindow?.addEventListener("message", handleMessages);
    }
  };

  return [iframeRef, onLoad] as const;
};
