import { useEffect, useRef } from "react";

type CallbackFunction = () => void;

const useInterval = (callback: CallbackFunction, delay?: number | null) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const savedCallback = useRef<CallbackFunction>(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => savedCallback.current(), delay || 0);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [delay]);
};

export default useInterval;
