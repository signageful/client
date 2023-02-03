export type IsPollingType = (navigator: Navigator) => boolean;

export interface IPingArgs {
  url: string;
  timeout: number;
}

export type PingType = (params: IPingArgs) => Promise<boolean>;

export interface IPollingConfig {
  enabled?: boolean;
  url?: string;
  timeout?: number;
  interval?: number;
}

export type UseNetworkStatusType = (
  callback: (online: boolean) => void,
  pollingOptions?: IPollingConfig | boolean
) => void;

export type GetPollingConfigType = (
  pollingConfig: IPollingConfig | boolean,
  needsPolling: boolean
) =>
  | {
      enabled: true;
      url: string;
      timeout: number;
      interval: number;
    }
  | {
      enabled: false;
    };
