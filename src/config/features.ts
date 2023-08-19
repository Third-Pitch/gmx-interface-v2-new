import { ARBITRUM } from "./chains";

export function getIsSyntheticsSupported(chainId: number) {
  return true;
}

export function getIsV1Supported(chainId: number) {
  return [ARBITRUM].includes(chainId);
}
