import axios from "axios";

export async function Get<T = undefined>(path: string): Promise<T> {
  const res = await axios.get<T>(path);

  if (res.status !== 200) {
    throw new Error(`Failed GET from ${path}. Code: ${res.status}`);
  }

  return res.data;
}
