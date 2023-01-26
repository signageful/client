import { useCallback, useEffect, useState } from "react";
import { getSystemInfo, postSystemInfo } from "../services/system-info";
import { SystemInfo } from "../types/system-info";
import useInterval from "./use-interval";

const FETCH_INTERVAL = 1000 * 60;

export const useSystemInfo = (hwid: string) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  const sendSystemInfo = useCallback(async (systemInfo: SystemInfo) => {
    try {
      await postSystemInfo(hwid, systemInfo);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchSystemInfo = useCallback(async () => {
    try {
      const result = await getSystemInfo();
      if (result) {
        setSystemInfo(result);
        sendSystemInfo(result);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  useInterval(fetchSystemInfo, FETCH_INTERVAL);
};
