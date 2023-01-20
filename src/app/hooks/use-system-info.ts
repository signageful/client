import { useCallback, useState } from "react";
import { getSystemInfo } from "../services/system-info";
import { SystemInfo } from "../types/system-info";
import useInterval from "./use-interval";

const FETCH_INTERVAL = 1000 * 60;

export const useSystemInfo = (hwid: string) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  const fetchSystemInfo = useCallback(async () => {
    console.log("Fetching system info...");
    try {
      const result = await getSystemInfo();
      if (result) {
        setSystemInfo(result);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useInterval(fetchSystemInfo, FETCH_INTERVAL);
};
