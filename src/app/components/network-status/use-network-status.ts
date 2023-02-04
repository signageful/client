import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { networkState } from "./network.state";
import {
  GetPollingConfigType,
  IsPollingType,
  PingType,
  UseNetworkStatusOptions,
} from "./types";

export const needsPolling: IsPollingType = (navigator) => {
  if (typeof navigator === "undefined") {
    return true;
  }

  return false;
};

export const ping: PingType = ({ url, timeout }) => {
  return new Promise((resolve) => {
    const isOnline = () => resolve(true);
    const isOffline = () => resolve(false);

    const xhr = new XMLHttpRequest();

    xhr.onerror = isOffline;
    xhr.ontimeout = isOffline;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.HEADERS_RECEIVED) {
        if (xhr.status) {
          isOnline();
        } else {
          isOffline();
        }
      }
    };

    xhr.open("HEAD", url);
    xhr.timeout = timeout;
    xhr.send();
  });
};

const getPollingConfigs: GetPollingConfigType = (
  pollingConfig,
  needsPolling
) => {
  const defaultConfig = {
    enabled: true,
    url: "https://ipv4.icanhazip.com/",
    timeout: 5000,
    interval: 5000,
  };

  if (
    (typeof pollingConfig === "object" && pollingConfig.enabled === true) ||
    (needsPolling === true && typeof pollingConfig === "object")
  ) {
    return { ...defaultConfig, ...pollingConfig };
  } else if (pollingConfig === true || needsPolling) {
    return { ...defaultConfig };
  } else {
    return { enabled: false };
  }
};

const noop = () => {
  return;
};

export const useNetworkStatus = (options: UseNetworkStatusOptions = {}) => {
  const { callback = noop, pollingOptions = {} } = options;
  const [isOnline, setIsOnline] = useRecoilState(networkState);

  const goOnline = () => {
    setIsOnline((prevState) => ({
      ...prevState,
      isOnline: true,
    }));
    callback(true);
  };

  const goOffline = () => {
    setIsOnline((prevState) => ({
      ...prevState,
      isOnline: false,
    }));
    callback(false);
  };

  // does the browser support navigator.onLine CORRECTLY?
  const mustPoll = needsPolling(navigator);

  const { enabled, ...pingConfig } = getPollingConfigs(
    pollingOptions,
    mustPoll
  );

  useEffect(() => {
    if (navigator.onLine) {
      goOnline();
    } else {
      goOffline();
    }

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    // initialize setInterval id so we can clean up on unmount.
    let intervalId: number | undefined;

    // if we are polling for online status, set up the setInterval.
    if (mustPoll && "url" in pingConfig) {
      const { url, timeout, interval } = pingConfig;

      intervalId = window.setInterval(() => {
        ping({
          url,
          timeout,
        }).then((online) => (online ? goOnline() : goOffline()));
      }, interval);
    }

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);

      if (mustPoll || enabled) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return [isOnline] as const;
};

export type UseNetworkStatus = ReturnType<typeof useNetworkStatus>;
