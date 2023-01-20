import { SystemInfo } from "../types/system-info";
import { SystemInfoPath } from "./api";
import { Get } from "./client";

export async function getSystemInfo(): Promise<SystemInfo> {
  const info = await Get<SystemInfo>(SystemInfoPath);

  return info;
}
