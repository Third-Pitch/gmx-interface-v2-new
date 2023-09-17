import { BASE } from "./chains";

export const EDDX_STATS_API_URL = "https://teststat.eddx.io/api";

const BACKEND_URLS = {
  default: "https://testapi.eddx.io/api",

  [BASE]: "https://testapi.eddx.io/api",
};

export function getServerBaseUrl(chainId: number) {
  if (!chainId) {
    throw new Error("chainId is not provided");
  }

  if (document.location.hostname.includes("deploy-preview")) {
    const fromLocalStorage = localStorage.getItem("SERVER_BASE_URL");
    if (fromLocalStorage) {
      return fromLocalStorage;
    }
  }

  return BACKEND_URLS[chainId] || BACKEND_URLS.default;
}

export function getServerUrl(chainId: number, path: string) {
  return `${getServerBaseUrl(chainId)}${path}`;
}


