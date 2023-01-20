import type { AxiosResponse } from "axios";

const basePath = "http://localhost:58501";

export const SystemInfoPath = `${basePath}/api/system/info`;

export interface Response<T> {
  status: "OK";
  data: T;
}

export interface ErrorResponse {
  status: "KO";
  message: string;
}

export type ServiceResponse<T> = Response<T> | ErrorResponse;

function toErrorResponse<T>(
  resp: AxiosResponse<ServiceResponse<T>>
): ErrorResponse | undefined {
  if (resp.data && "status" in resp.data && resp.data["status"] === "KO") {
    return resp.data as ErrorResponse;
  }
  return undefined;
}

export function toData<T>(
  resp: AxiosResponse<ServiceResponse<T>>
): T | undefined {
  if (resp.data && "status" in resp.data && resp.data["status"] === "OK") {
    return resp.data.data as T;
  }
  return undefined;
}

export function hasServiceError<T>(resp: AxiosResponse<ServiceResponse<T>>) {
  const errResp = toErrorResponse(resp);
  if (errResp && errResp.status === "KO") {
    return { errored: true, message: errResp.message };
  }
  return { errored: false, message: null };
}
