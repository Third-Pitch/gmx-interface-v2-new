import { BASE } from "./chains";

export function getIsSyntheticsSupported(chainId: number) {
  return true;
}

export function getIsV1Supported(chainId: number) {
  return [BASE].includes(chainId);
}
