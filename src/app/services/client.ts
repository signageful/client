import axios from "axios";
import { hasServiceError, ServiceResponse, toData } from "./api";

export async function Get<T = undefined>(path: string): Promise<T> {
  const res = await axios.get<ServiceResponse<T>>(path);

  if (res.status !== 200 || hasServiceError(res).errored) {
    throw new Error(`Failed GET from ${path}. Code: ${res.status}.`);
  }

  const d = toData<T>(res);
  if (!d) {
    throw new Error("unexpected type of response");
  }
  return d;
}

export async function PostWithOptionalResponse<T = undefined>(
  path: string,
  body?: any
): Promise<T | undefined> {
  const res = await axios.post<ServiceResponse<T>>(path, body);

  if (res.status !== 200 || hasServiceError(res).errored) {
    throw new Error(
      `Failed POST to ${path}. Code: ${res.status}. Message: ${
        hasServiceError(res).message
      }`
    );
  }
  return toData<T>(res);
}
