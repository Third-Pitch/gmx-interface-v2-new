import { ethers } from "ethers";
import { NetworkMetadata } from "lib/wallets";
import { sample } from "lodash";

const { parseEther } = ethers.utils;

export const ETH_MAINNET = 1;
export const BASE = 84531;
export const FEES_HIGH_BPS = 50;

// TODO take it from web3
export const DEFAULT_CHAIN_ID = BASE;
export const CHAIN_ID = DEFAULT_CHAIN_ID;

export const SUPPORTED_CHAIN_IDS = [BASE];


export const IS_NETWORK_DISABLED = {
  [BASE]: false,
};

export const CHAIN_NAMES_MAP = {
  [BASE]: "Base",
};

export const GAS_PRICE_ADJUSTMENT_MAP = {
  [BASE]: "6000000",
};

export const MAX_GAS_PRICE_MAP = {
};

export const HIGH_EXECUTION_FEES_MAP = {
  [BASE]: 3, // 3 USD
};

export const EXECUTION_FEE_MULTIPLIER_MAP = {
  // if gas prices on Base are high, the main transaction costs would come from the L2 gas usage
  // for executing positions this is around 65,000 gas
  // if gas prices on Ethereum are high, than the gas usage might be higher, this calculation doesn't deal with that
  // case yet
  [BASE]: 65000,
  // multiplier for Avalanche is just the average gas usage
};

export const EXECUTION_FEE_CONFIG_V2: {
  [chainId: number]: {
    shouldUseMaxPriorityFeePerGas: boolean;
    defaultBufferBps?: number;
  };
} = {
  [BASE]: {
    shouldUseMaxPriorityFeePerGas: false,
    defaultBufferBps: 1000, // 10%
  },

};

const constants = {




  [BASE]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "ETH",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0100001"),
  },


};

const ALCHEMY_WHITELISTED_DOMAINS = ["eddx.io", "app.eddx.io"];

export const RPC_PROVIDERS = {
  [ETH_MAINNET]: ["https://rpc.ankr.com/eth"],

  [BASE]: ["https://goerli.base.org"],

};

export const FALLBACK_PROVIDERS = {
  [BASE]: [getAlchemyHttpUrl()],
};

export const NETWORK_METADATA: { [chainId: number]: NetworkMetadata } = {


  [BASE]: {
    chainId: "0x" + BASE.toString(16),
    chainName: "Base",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[BASE],
    blockExplorerUrls: [getExplorerUrl(BASE)],
  },
};

export const getConstant = (chainId: number, key: string) => {
  if (!constants[chainId]) {
    throw new Error(`Unsupported chainId ${chainId}`);
  }

  if (!(key in constants[chainId])) {
    throw new Error(`Key ${key} does not exist for chainId ${chainId}`);
  }

  return constants[chainId][key];
};

export function getChainName(chainId: number) {
  return CHAIN_NAMES_MAP[chainId];
}

export function getRpcUrl(chainId: number): string | undefined {
  return sample(RPC_PROVIDERS[chainId]);
}

export function getFallbackRpcUrl(chainId: number): string | undefined {
  return sample(FALLBACK_PROVIDERS[chainId]);
}

export function getAlchemyHttpUrl() {
  // if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
  return "https://arb-mainnet.g.alchemy.com/v2/RcaXYTizJs51m-w9SnRyDrxSZhE5H9Mf";
  // }
  // return "https://arb-mainnet.g.alchemy.com/v2/hxBqIr-vfpJ105JPYLei_ibbJLe66k46";
}

export function getAlchemyWsUrl() {
  // if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
  //   return "wss://base-goerli.blastapi.io/55793450-d607-48e4-be85-ad99bcef0a63";
  // }
  return "wss://base-goerli.blastapi.io/55793450-d607-48e4-be85-ad99bcef0a63";
}

export function getExplorerUrl(chainId) {
  if (chainId === 3) {
    return "https://ropsten.etherscan.io/";
  } else if (chainId === 42) {
    return "https://kovan.etherscan.io/";
  } else if (chainId === BASE) {
    return "https://goerli.basescan.org/";
  }
  return "https://etherscan.io/";
}

export function getHighExecutionFee(chainId) {
  return HIGH_EXECUTION_FEES_MAP[chainId] || 3;
}

export function getExecutionFeeMultiplier(chainId) {
  return EXECUTION_FEE_MULTIPLIER_MAP[chainId] || 1;
}

export function isSupportedChain(chainId) {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}
