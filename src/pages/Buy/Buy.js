import React from "react";
import { t } from "@lingui/macro";
import Footer from "components/Footer/Footer";
import "./Buy.css";
import TokenCard from "components/TokenCard/TokenCard";
import SEO from "components/Common/SEO";
import { getPageTitle } from "lib/legacy";
import PageTitle from "components/PageTitle/PageTitle";

export default function BuyEDDXELP() {
  return (
    <SEO title={getPageTitle(t`Buy ELP or EDDX`)}>
      <div className="BuyEDDXELP page-layout">
        <div className="BuyEDDXELP-container default-container">
          <PageTitle showNetworkIcon={false} isTop title={t`Buy Protocol Tokens`} />
          <TokenCard />
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
