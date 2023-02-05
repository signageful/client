import { useRecoilState, useRecoilValue } from "recoil";
import { NetworkScreen } from "./network-screen";
import { networkState } from "./network.state";
import { IPollingConfig } from "./types";
import { useNetworkStatus } from "./use-network-status";

interface NetworkDetectorProps {
  children: React.ReactNode;
}

const defaultConfig: IPollingConfig = {
  enabled: true,
  interval: 5000,
  timeout: 5000,
};

/**
 * NetworkDetector is a component that will detect network status changes and
 * call the onChange callback with the new status.
 *
 * @future this component should render a UI element when the network is offline.
 */
export const NetworkDetector: React.FC<NetworkDetectorProps> = ({
  children,
}) => {
  const state = useRecoilValue(networkState);

  useNetworkStatus({
    pollingOptions: defaultConfig,
  });

  if (state.isOnline) {
    return <>{children}</>;
  }

  return <NetworkScreen onLine={state.isOnline} />;
};
