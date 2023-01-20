export interface Memory {
  total: number;
  used: number;
  cached: number;
  free: number;
  active: number;
  inactive: number;
  swap_total: number;
  swap_used: number;
  swap_free: number;
}

export interface Uptime {
  uptime: number;
}

export interface Cpu {
  user: number;
  system: number;
  idle: number;
  nice: number;
  total: number;
}

export interface System {
  hostname: string;
  internal_ip: string;
  has_public_network: boolean;
}

export interface SystemInfo {
  memory: Memory;
  uptime: Uptime;
  cpu: Cpu;
  system: System;
}
