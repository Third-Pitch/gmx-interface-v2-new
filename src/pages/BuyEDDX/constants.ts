import { BASE } from "config/chains";
import { getContract } from "config/contracts";

const BASE_EDDX = getContract(BASE, "EDDX").toLowerCase();

type Exchange = {
  name: string;
  icon: string;
  links: { [key: number]: string };
};

export const EXTERNAL_LINKS = {
  [BASE]: {
    networkWebsite: "https://base.io/",
    buyEddx: {
      uniswap: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${BASE_EDDX}`,
    },
  },

};

export const FIAT_GATEWAYS: Exchange[] = [
  {
    name: "Binance Connect",
    icon: "ic_binance.svg",
    links: {
      [BASE]: "https://www.binancecnt.com/en/buy-sell-crypto",
    },
  },
  {
    name: "Banxa",
    icon: "ic_banxa.svg",
    links: {
      [BASE]: "https://eddx.banxa.com/?coinType=EDDX&fiatType=USD&fiatAmount=500&blockchain=base",
    },
  },
  {
    name: "Transak",
    icon: "ic_tansak.svg",
    links: {
      [BASE]:
        "https://global.transak.com/?apiKey=28a15a9b-d94e-4944-99cc-6aa35b45cc74&networks=base&defaultCryptoCurrency=EDDX&isAutoFillUserData=true&hideMenu=true&isFeeCalculationHidden=true",
    },
  },
];

export const EDDX_FROM_ANY_NETWORKS: Exchange[] = [
  {
    name: "Bungee",
    icon: "ic_bungee.png",
    links: {
      [BASE]: `https://multitx.bungee.exchange/?toChainId=42161&toTokenAddress=${BASE_EDDX}`,
    },
  },
  {
    name: "O3",
    icon: "ic_o3.png",
    links: {
      [BASE]: `https://o3swap.com/swap?dst_chain=42161&dst_token_hash=${BASE_EDDX}`,
    },
  },
];

export const BUY_NATIVE_TOKENS: Exchange[] = [
  {
    name: "Bungee",
    icon: "ic_bungee.png",
    links: {
      [BASE]: `https://multitx.bungee.exchange/?fromChainId=1&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=42161&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee `,
    },
  },
  {
    name: "O3",
    icon: "ic_o3.png",
    links: {
      [BASE]:
        "https://o3swap.com/swap?src_chain=1&dst_chain=42161&dst_token_hash=0x0000000000000000000000000000000000000000",
    },
  },
  {
    name: "Banxa",
    icon: "ic_banxa.svg",
    links: {
      [BASE]: "https://eddx.banxa.com/?coinType=ETH&fiatType=USD&fiatAmount=500&blockchain=base",
    },
  },
  {
    name: "Transak",
    icon: "ic_tansak.svg",
    links: {
      [BASE]:
        "https://global.transak.com/?apiKey=28a15a9b-d94e-4944-99cc-6aa35b45cc74&networks=base&isAutoFillUserData=true&hideMenu=true&isFeeCalculationHidden=true",
    },
  },
];

export const TRANSFER_EXCHANGES: Exchange[] = [
  {
    name: "Binance",
    icon: "ic_binance.svg",
    links: {
      [BASE]: "https://www.binance.com/en/trade/",
    },
  },
  {
    name: "Synapse",
    icon: "ic_synapse.svg",
    links: {
      [BASE]: "https://synapseprotocol.com/?inputCurrency=ETH&outputCurrency=ETH&outputChain=42161",
    },
  },
  {
    name: "Base",
    icon: "ic_base_24.svg",
    links: {
      [BASE]: "https://bridge.base.io/",
    },
  },
  {
    name: "Avalanche",
    icon: "ic_avax_30.svg",
    links: {
    },
  },
  {
    name: "Hop",
    icon: "ic_hop.svg",
    links: { [BASE]: "https://app.hop.exchange/send?token=ETH&sourceNetwork=ethereum&destNetwork=base" },
  },
  {
    name: "Bungee",
    icon: "ic_bungee.png",
    links: {
      [BASE]:
        "https://multitx.bungee.exchange/?fromChainId=1&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=42161&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    },
  },
  {
    name: "O3",
    icon: "ic_o3.png",
    links: {
      [BASE]:
        "https://o3swap.com/swap?src_chain=1&dst_chain=42161&dst_token_hash=0x0000000000000000000000000000000000000000",
    },
  },
  {
    name: "Across",
    icon: "ic_across.svg",
    links: { [BASE]: "https://across.to/bridge?from=1&to=42161&asset=ETH" },
  },
];

export const CENTRALISED_EXCHANGES: Exchange[] = [
  {
    name: "Binance",
    icon: "ic_binance.svg",
    links: {
      [BASE]: "https://www.binance.com/en/trade/EDDX_USDT",
    },
  },
  {
    name: "Bybit",
    icon: "ic_bybit.svg",
    links: {
      [BASE]: "https://www.bybit.com/en-US/trade/spot/EDDX/USDT",
    },
  },
  {
    name: "Kucoin",
    icon: "ic_kucoin.svg",
    links: {
      [BASE]: "https://www.kucoin.com/trade/EDDX-USDT",
    },
  },
  {
    name: "Huobi",
    icon: "ic_huobi.svg",
    links: {
      [BASE]: "https://www.huobi.com/en-us/exchange/eddx_usdt/",
    },
  },
];

export const DECENTRALISED_AGGRIGATORS: Exchange[] = [
  {
    name: "1inch",
    icon: "ic_1inch.svg",
    links: {
      [BASE]: "https://app.1inch.io/#/42161/unified/swap/ETH/EDDX",
    },
  },
  {
    name: "Matcha",
    icon: "ic_matcha.png",
    links: {
      [BASE]: `https://www.matcha.xyz/markets/42161/${BASE_EDDX}`,
    },
  },
  {
    name: "Paraswap",
    icon: "ic_paraswap.svg",
    links: {
      [BASE]: `https://app.paraswap.io/#/${BASE_EDDX}?network=base`,
    },
  },
  {
    name: "KyberSwap",
    icon: "ic_kyberswap.svg",
    links: {
      [BASE]: "https://kyberswap.com/swap/base/eth-to-eddx",
    },
  },
  {
    name: "OpenOcean",
    icon: "ic_openocean.svg",
    links: {
      [BASE]: "https://app.openocean.finance/CLASSIC#/BASE/ETH/EDDX",
    },
  },
  {
    name: "DODO",
    icon: "ic_dodo.svg",
    links: {
      [BASE]: `https://app.dodoex.io/?from=ETH&to=${BASE_EDDX}&network=base`,
    },
  },
  {
    name: "Slingshot",
    icon: "ic_slingshot.svg",
    links: { [BASE]: "https://app.slingshot.finance/swap/ETH?network=base" },
  },
  {
    name: "Yieldyak",
    icon: "ic_yield_yak.png",
    links: {
    },
  },
  {
    name: "Firebird",
    icon: "ic_firebird.png",
    links: {
      [BASE]: "https://app.firebird.finance/swap",
    },
  },
  {
    name: "Odos",
    icon: "ic_odos.png",
    links: {
      [BASE]: "https://app.odos.xyz/swap/42161/ETH/EDDX",
    },
  },
];
