import { SystemInfo as ISystemInfo } from "../types/system-info";
import { SystemInfoPath } from "./api";
import { Get, PostWithOptionalResponse } from "./client";
import { SystemInfoCreatePath } from "./external-api";

export async function getSystemInfo(): Promise<ISystemInfo> {
  const info = await Get<ISystemInfo>(SystemInfoPath);

  return info;
}

export async function postSystemInfo(hardwareId: string, data: ISystemInfo) {
  const result = await PostWithOptionalResponse(
    SystemInfoCreatePath(hardwareId),
    {
      status: "OK",
      data,
    }
  );

  return result;
}
