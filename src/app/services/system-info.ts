import { SystemInfo } from "../types/system-info";
import { SystemInfoPath } from "./api";
import { Get, PostWithOptionalResponse } from "./client";
import { SystemInfoCreatePath } from "./external-api";

export async function getSystemInfo(): Promise<SystemInfo> {
  const info = await Get<SystemInfo>(SystemInfoPath);

  return info;
}

export async function postSystemInfo(hardwareId: string, data: SystemInfo) {
  console.log(SystemInfoCreatePath(hardwareId));
  const result = await PostWithOptionalResponse(
    SystemInfoCreatePath(hardwareId),
    data
  );

  return result;
}
