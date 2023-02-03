import { IPollingConfig } from "./types";
import { useNetworkStatus } from "./use-network-status";

/**
 * NetworkDetector is a component that will detect network status changes and
 * call the onChange callback with the new status.
 *
 * @future this component should render a UI element when the network is offline.
 */
export const NetworkDetector: React.FC<{
  config: IPollingConfig | boolean;
  onChange: (param: boolean) => void;
}> = ({ config = {}, onChange }) => {
  useNetworkStatus((online) => onChange(online), config);
  return null;
};
