import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import ElpSwap from "components/Elp/ElpSwap";
import Footer from "components/Footer/Footer";
import "./BuyElp.css";

import { Trans, t } from "@lingui/macro";
import { getNativeToken } from "config/tokens";
import { useChainId } from "lib/chains";
import ExternalLink from "components/ExternalLink/ExternalLink";
import PageTitle from "components/PageTitle/PageTitle";

export default function BuyElp(props) {
  const { chainId } = useChainId();
  const history = useHistory();
  const [isBuying, setIsBuying] = useState(true);
  const nativeTokenSymbol = getNativeToken(chainId).symbol;

  useEffect(() => {
    const hash = history.location.hash.replace("#", "");
    const buying = hash === "redeem" ? false : true;
    setIsBuying(buying);
  }, [history.location.hash]);

  return (
    <div className="default-container page-layout">
      <PageTitle
        title={t`Buy / Sell ELP`}
        isTop
        subtitle={
          <div>
            <Trans>
              Purchase <ExternalLink href="https://docs.eddx.io/docs/providing-liquidity/v1">ELP tokens</ExternalLink> to
              earn {nativeTokenSymbol} fees from swaps and leverage trading.
            </Trans>
            <br />
            <Trans>
              View{" "}
              <Link className="link-underline" to="/earn">
                staking
              </Link>{" "}
              page.
            </Trans>
          </div>
        }
      />
      <ElpSwap {...props} isBuying={isBuying} setIsBuying={setIsBuying} />
      <Footer />
    </div>
  );
}
