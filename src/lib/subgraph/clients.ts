import { createClient } from "./utils";
import { ARBITRUM,   ETH_MAINNET } from "config/chains";

export const chainlinkClient = createClient(ETH_MAINNET, "chainLink");

export const arbitrumGraphClient = createClient(ARBITRUM, "stats");
export const arbitrumReferralsGraphClient = createClient(ARBITRUM, "referrals");
export const nissohGraphClient = createClient(ARBITRUM, "nissohVault");


export const arbitrumSyntheticsStatsClient = createClient(ARBITRUM, "syntheticsStats");

export function getSyntheticsGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return arbitrumSyntheticsStatsClient;
  }
  return null;
}

export function getGmxGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return arbitrumGraphClient;
  }
  throw new Error(`Unsupported chain ${chainId}`);
}

export function getReferralsGraphClient(chainId) {
  if (chainId === ARBITRUM) {
    return arbitrumReferralsGraphClient;
  } 
  throw new Error(`Unsupported chain ${chainId}`);
}
