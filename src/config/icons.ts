import { BASE } from "config/chains";
import base from "img/ic_base_24.svg";
import eddxIcon from "img/ic_eddx_40.svg";
import eddxOutlineIcon from "img/ic_eddxv1flat.svg";
import elpIcon from "img/ic_elp_40.svg";
import emIcon from "img/em_icon.svg";
import emBase from "img/ic_em_base.svg";
import eddxBase from "img/ic_eddx_base.svg";
import elpBase from "img/ic_elp_base.svg";

const ICONS = {
  [BASE]: {
    network: base,
    eddx: eddxBase,
    elp: elpBase,
    em: emBase,
  },


 
  common: {
    eddx: eddxIcon,
    eddxOutline: eddxOutlineIcon,
    elp: elpIcon,
    em: emIcon,
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
