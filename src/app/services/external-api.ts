import { __DEV__ } from "../utils";

const basePath = __DEV__
  ? "https://app.signageful.dev"
  : "https://app.signageful.com";

console.log("basePath", basePath);

export const SystemInfoCreatePath = (machineId: string) =>
  `${basePath}/api/players/${machineId}/system-info`;
