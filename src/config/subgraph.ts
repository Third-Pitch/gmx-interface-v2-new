import { BASE, ETH_MAINNET } from "./chains";
import { isDevelopment } from "./env";
import { getSubgraphUrlKey } from "./localStorage";

const SUBGRAPH_URLS = {
  [BASE]: {
    stats: "https://api.studio.thegraph.com/query/45535/test-stats/version/latest",
    referrals: "https://api.studio.thegraph.com/query/45535/test-referrals/version/latest",
    // stats: "https://subgraph.satsuma-prod.com/3b2ced13c8d9/eddx/eddx-base-stats/api",
    // referrals: "https://subgraph.satsuma-prod.com/3b2ced13c8d9/eddx/eddx-base-referrals/api",
    nissohVault: "https://api.thegraph.com/subgraphs/name/nissoh/eddx-vault",
    syntheticsStats: "https://api.studio.thegraph.com/query/45535/test-synthetics-stat/version/latest",
  },

  common: {
    [ETH_MAINNET]: {
      chainLink: "https://api.thegraph.com/subgraphs/name/deividask/chainlink",
    },
  },
};

export function getSubgraphUrl(chainId: number, subgraph: string) {
  if (isDevelopment()) {
    const localStorageKey = getSubgraphUrlKey(chainId, subgraph);
    const url = localStorage.getItem(localStorageKey);
    if (url) {
      // eslint-disable-next-line no-console
      console.warn("%s subgraph on chain %s url is overriden: %s", subgraph, chainId, url);
      return url;
    }
  }

  return SUBGRAPH_URLS?.[chainId]?.[subgraph];
}
