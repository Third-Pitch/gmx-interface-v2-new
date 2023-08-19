import { ARBITRUM } from "config/chains";
import arbitrum from "img/ic_arbitrum_24.svg";
import gmxIcon from "img/ic_gmx_40.svg";
import gmxOutlineIcon from "img/ic_gmxv1flat.svg";
import glpIcon from "img/ic_glp_40.svg";
import gmIcon from "img/gm_icon.svg";
import gmArbitrum from "img/ic_gm_arbitrum.svg";
import gmxArbitrum from "img/ic_gmx_arbitrum.svg";
import glpArbitrum from "img/ic_glp_arbitrum.svg";

const ICONS = {
  [ARBITRUM]: {
    network: arbitrum,
    gmx: gmxArbitrum,
    glp: glpArbitrum,
    gm: gmArbitrum,
  },


 
  common: {
    gmx: gmxIcon,
    gmxOutline: gmxOutlineIcon,
    glp: glpIcon,
    gm: gmIcon,
  },
};

export function getIcon(chainId: number | "common", label: string) {
  if (chainId in ICONS) {
    if (label in ICONS[chainId]) {
      return ICONS[chainId][label];
    }
  }
}
export function getIcons(chainId: number | "common") {
  if (!chainId) return;
  if (chainId in ICONS) {
    return ICONS[chainId];
  }
}
