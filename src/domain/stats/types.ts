import { ARBITRUM } from "config/chains";
import { BigNumber } from "ethers";

export type VolumeInfo = {
  totalVolume: BigNumber;
  [ARBITRUM]: { totalVolume: BigNumber };
};

export type VolumeStat = {
  swap: string;
  margin: string;
  liquidation: string;
  mint: string;
  burn: string;
};
