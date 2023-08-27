import { createClient } from "./utils";
import { BASE,   ETH_MAINNET } from "config/chains";

export const chainlinkClient = createClient(ETH_MAINNET, "chainLink");

export const baseGraphClient = createClient(BASE, "stats");
export const baseReferralsGraphClient = createClient(BASE, "referrals");
export const nissohGraphClient = createClient(BASE, "nissohVault");


export const baseSyntheticsStatsClient = createClient(BASE, "syntheticsStats");

export function getSyntheticsGraphClient(chainId: number) {
  if (chainId === BASE) {
    return baseSyntheticsStatsClient;
  }
  return null;
}

export function getEddxGraphClient(chainId: number) {
  if (chainId === BASE) {
    return baseGraphClient;
  }
  throw new Error(`Unsupported chain ${chainId}`);
}

export function getReferralsGraphClient(chainId) {
  if (chainId === BASE) {
    return baseReferralsGraphClient;
  } 
  throw new Error(`Unsupported chain ${chainId}`);
}
