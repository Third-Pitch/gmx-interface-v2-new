import { BigNumber } from "ethers";
import { BASIS_POINTS_DIVISOR, MAX_LEVERAGE, USD_DECIMALS } from "lib/legacy";
import { applyFactor, expandDecimals, formatAmount, formatUsd, roundUpDivision } from "lib/numbers";
import {
  Market,
  MarketsData,
  MarketsPoolsData,
  getCappedPoolPnl,
  getMarket,
  getMarketName,
  getMarketPools,
  getPoolUsd,
} from "../markets";
import { TokenPrices, TokensData, convertToUsd, getTokenData } from "../tokens";
import { AggregatedPositionData, Position, PositionsData } from "./types";
import { PositionsUpdates, getPositionUpdate } from "context/SyntheticsEvents";
import { Token } from "domain/tokens";
import { MarketsFeesConfigsData, getMarketFeesConfig } from "../fees";

export function getPosition(positionsData: PositionsData, positionKey?: string) {
  if (!positionKey) return undefined;

  return positionsData[positionKey];
}

export function getPositionKey(account?: string | null, market?: string, collateralToken?: string, isLong?: boolean) {
  if (!account || !market || !collateralToken || isLong === undefined) return undefined;

  return `${account}-${market}-${collateralToken}-${isLong}`;
}

export function parsePositionKey(positionKey: string) {
  const [account, market, collateralToken, isLong] = positionKey.split("-");

  return { account, market, collateralToken, isLong: isLong === "true" };
}

export function getAggregatedPositionData(
  positionsData: PositionsData,
  marketsData: MarketsData,
  tokensData: TokensData,
  marketsFeesConfigs: MarketsFeesConfigsData,
  pendingUpdates: PositionsUpdates,
  contractUpdates: PositionsUpdates,
  positionKey?: string
): AggregatedPositionData | undefined {
  if (!positionKey) return undefined;

  const rawPosition = getPosition(positionsData, positionKey);
  const pendingUpdate = getPositionUpdate(pendingUpdates, positionKey, { maxAge: 600 * 1000 });

  let position: Position | undefined;
  let isOpening = false;

  if (rawPosition) {
    position = { ...rawPosition };
  } else if (pendingUpdate && pendingUpdate.isIncrease) {
    isOpening = true;
    const { account, market, collateralToken, isLong } = parsePositionKey(positionKey);

    position = {
      key: positionKey,
      account,
      marketAddress: market,
      collateralTokenAddress: collateralToken,
      isLong,
      sizeInUsd: pendingUpdate.sizeDeltaUsd || BigNumber.from(0),
      collateralAmount: pendingUpdate.collateralDeltaAmount || BigNumber.from(0),
      sizeInTokens: pendingUpdate.sizeDeltaInTokens || BigNumber.from(0),
      increasedAtBlock: BigNumber.from(0),
      decreasedAtBlock: BigNumber.from(0),
      borrowingFactor: BigNumber.from(0),
      pendingBorrowingFees: BigNumber.from(0),
      longTokenFundingAmountPerSize: BigNumber.from(0),
      shortTokenFundingAmountPerSize: BigNumber.from(0),
      data: "0x",
      pendingFundingFees: {
        fundingFeeAmount: BigNumber.from(0),
        claimableLongTokenAmount: BigNumber.from(0),
        claimableShortTokenAmount: BigNumber.from(0),
        latestLongTokenFundingAmountPerSize: BigNumber.from(0),
        latestShortTokenFundingAmountPerSize: BigNumber.from(0),
        hasPendingLongTokenFundingFee: false,
        hasPendingShortTokenFundingFee: false,
      },
    };
  }

  if (!position) return undefined;

  const contractUpdate = getPositionUpdate(contractUpdates, positionKey, {
    minIncreasedAtBlock: position.increasedAtBlock,
    minDecreasedAtBlock: position.decreasedAtBlock,
  });

  if (contractUpdate) {
    const sign = contractUpdate.isIncrease ? 1 : -1;
    position.sizeInUsd = position.sizeInUsd.add(contractUpdate.sizeDeltaUsd?.mul(sign) || 0);
    position.collateralAmount = position.collateralAmount.add(contractUpdate.collateralDeltaAmount?.mul(sign) || 0);
    position.sizeInTokens = position.sizeInTokens.add(contractUpdate.sizeDeltaInTokens?.mul(sign) || 0);
  }

  const market = getMarket(marketsData, position?.marketAddress);
  const feesConfig = getMarketFeesConfig(marketsFeesConfigs, market?.marketTokenAddress);

  const collateralToken = getTokenData(tokensData, position?.collateralTokenAddress);
  const pnlToken = getTokenData(tokensData, position.isLong ? market?.longTokenAddress : market?.shortTokenAddress);
  const indexToken = getTokenData(tokensData, market?.indexTokenAddress, "native");

  const marketName = getMarketName(marketsData, tokensData, position?.marketAddress, false, false);

  const markPrice = position.isLong ? indexToken?.prices?.minPrice : indexToken?.prices?.maxPrice;
  const pnlPrice = getPriceForPnl(indexToken?.prices, position.isLong, false);
  const averagePrice = indexToken?.prices?.minPrice.add(indexToken?.prices?.maxPrice).div(2);

  const collateralPrice = getPriceForPnl(collateralToken?.prices, position.isLong, false);

  const entryPrice =
    indexToken && position.sizeInTokens.gt(0)
      ? position.sizeInUsd.div(position.sizeInTokens).mul(expandDecimals(1, indexToken.decimals))
      : undefined;

  const currentValueUsd =
    indexToken && pnlPrice ? convertToUsd(position.sizeInTokens, indexToken.decimals, pnlPrice) : undefined;

  const collateralUsd =
    collateralToken && collateralPrice
      ? convertToUsd(position.collateralAmount, collateralToken.decimals, collateralPrice)
      : undefined;

  const pnl = currentValueUsd?.sub(position.sizeInUsd).mul(position.isLong ? 1 : -1);

  const pnlPercentage = collateralUsd?.gt(0) && pnl ? pnl.mul(BASIS_POINTS_DIVISOR).div(collateralUsd) : undefined;

  const pendingFundingFeesUsd =
    collateralPrice && collateralToken && collateralUsd?.gt(0)
      ? convertToUsd(position.pendingFundingFees.fundingFeeAmount, collateralToken.decimals, collateralPrice)
      : undefined;

  const totalPendingFeesUsd = pendingFundingFeesUsd
    ? position.pendingBorrowingFees.add(pendingFundingFeesUsd)
    : undefined;

  const netValue = pnl && collateralUsd ? collateralUsd.add(pnl).sub(position.pendingBorrowingFees) : undefined;

  const collateralUsdAfterFees = totalPendingFeesUsd ? collateralUsd?.sub(totalPendingFeesUsd) : undefined;
  const pnlAfterFees = totalPendingFeesUsd ? pnl?.sub(totalPendingFeesUsd) : undefined;

  const pnlAfterFeesPercentage =
    collateralUsdAfterFees?.gt(0) && pnlAfterFees
      ? pnlAfterFees.mul(BASIS_POINTS_DIVISOR).div(collateralUsdAfterFees)
      : undefined;

  const hasLowCollateral = collateralUsdAfterFees?.lt(expandDecimals(1, USD_DECIMALS));

  const leverage = getLeverage({
    sizeUsd: position.sizeInUsd,
    collateralUsd,
    pnl: pnl,
    pendingBorrowingFeesUsd: position.pendingBorrowingFees,
    pendingFundingFeesUsd: pendingFundingFeesUsd,
  });

  const liqPrice = getLiquidationPrice({
    sizeUsd: position.sizeInUsd,
    collateralUsd,
    averagePrice,
    positionFeeFactor: feesConfig?.positionFeeFactor,
    pendingBorrowingFeesUsd: position.pendingBorrowingFees,
    pendingFundingFeesUsd: pendingFundingFeesUsd,
    pnl: pnl,
    isLong: position.isLong,
  });

  return {
    ...position,
    marketName,
    indexToken,
    collateralToken,
    pnlToken,
    currentValueUsd,
    collateralUsd,
    collateralUsdAfterFees,
    hasLowCollateral,
    averagePrice,
    markPrice,
    pnl,
    pnlPercentage,
    pnlAfterFees,
    pnlAfterFeesPercentage,
    netValue,
    leverage,
    liqPrice,
    entryPrice,
    pendingFundingFeesUsd,
    totalPendingFeesUsd,
    pendingUpdate,
    hasPendingChanges: Boolean(pendingUpdate),
    isOpening,
  };
}

// TODO: should remove?
export function getPriceForPnl(tokenPrices?: TokenPrices, isLong?: boolean, maximize?: boolean) {
  if (!tokenPrices) return undefined;

  if (isLong) {
    return maximize ? tokenPrices.maxPrice : tokenPrices.minPrice;
  }

  return maximize ? tokenPrices.minPrice : tokenPrices.maxPrice;
}

export function getMarkPrice(prices: TokenPrices | undefined, isIncrease: boolean, isLong: boolean) {
  const shouldUseMaxPrice = isIncrease ? isLong : !isLong;

  return shouldUseMaxPrice ? prices?.maxPrice : prices?.minPrice;
}

// Todo: remove?

export function getNextPositionPnl(p: {
  pnl?: BigNumber;
  sizeInUsd?: BigNumber;
  sizeInTokens?: BigNumber;
  sizeDeltaUsd?: BigNumber;
  isLong?: boolean;
}) {
  if (!p.sizeInUsd || !p.sizeInTokens || !p.sizeDeltaUsd || !p.pnl) return undefined;

  let sizeDeltaInTokens: BigNumber;

  if (p.sizeInUsd.eq(p.sizeDeltaUsd)) {
    sizeDeltaInTokens = p.sizeInTokens;
  } else {
    if (p.isLong) {
      sizeDeltaInTokens = roundUpDivision(p.sizeInTokens.mul(p.sizeDeltaUsd), p.sizeInUsd);
    } else {
      sizeDeltaInTokens = p.sizeInTokens.mul(p.sizeDeltaUsd).div(p.sizeInUsd);
    }
  }

  const nextPnl = p.pnl.mul(sizeDeltaInTokens).div(p.sizeInTokens);

  return nextPnl;
}

export function getPositionPnl(p: {
  tokensData: TokensData;
  poolsData: MarketsPoolsData;
  marketsData: MarketsData;
  market?: Market;
  indexToken?: Token;
  indexPrice?: BigNumber;
  sizeInUsd?: BigNumber;
  sizeInTokens?: BigNumber;
  isLong?: boolean;
}) {
  const positionValueUsd = getPositionValueUsd(p);
  const pools = getMarketPools(p.poolsData, p.market?.marketTokenAddress);

  if (!p.sizeInUsd || !positionValueUsd || !pools) return undefined;

  let totalPnl = p.isLong ? positionValueUsd.sub(p.sizeInUsd) : p.sizeInUsd.sub(positionValueUsd);

  if (totalPnl.gt(0)) {
    const poolPnl = p.isLong ? pools.pnlLongMax : pools.pnlShortMax;
    const poolTokenAddress = p.isLong ? p.market?.longTokenAddress : p.market?.shortTokenAddress;
    const poolUsd = getPoolUsd(
      p.marketsData,
      p.poolsData,
      p.tokensData,
      p.market?.marketTokenAddress,
      poolTokenAddress,
      "minPrice"
    );

    const cappedPnl = getCappedPoolPnl(p.poolsData, p.market?.marketTokenAddress, poolPnl, poolUsd, p.isLong);

    if (!cappedPnl) return undefined;

    const WEI_PRECISION = expandDecimals(1, 18);

    if (!cappedPnl.eq(poolPnl) && cappedPnl.gt(0) && poolPnl.gt(0)) {
      totalPnl = totalPnl.mul(cappedPnl.div(WEI_PRECISION)).div(poolPnl.div(WEI_PRECISION));
    }
  }
}

export function getPositionValueUsd(p: { indexToken?: Token; indexPrice?: BigNumber; sizeInTokens?: BigNumber }) {
  return convertToUsd(p.sizeInTokens, p.indexToken?.decimals, p.indexPrice);
}

// add liquidation price impact
export function getLiquidationPrice(p: {
  sizeUsd?: BigNumber;
  collateralUsd?: BigNumber;
  // get Pnl after decrease order
  pnl?: BigNumber;
  averagePrice?: BigNumber;
  positionFeeFactor?: BigNumber;
  pendingFundingFeesUsd?: BigNumber;
  pendingBorrowingFeesUsd?: BigNumber;
  isLong?: boolean;
}) {
  if (!p.sizeUsd?.gt(0) || !p.collateralUsd?.gt(0) || !p.averagePrice?.gt(0) || !p.positionFeeFactor?.gt(0))
    return undefined;

  let remainingCollateralUsd = p.collateralUsd;

  if (p.pnl?.lt(0)) {
    remainingCollateralUsd = remainingCollateralUsd.sub(p.pnl.abs());
  }

  // TODO: Add liquidation fee?
  let feesUsd: BigNumber = applyFactor(p.sizeUsd, p.positionFeeFactor);

  if (p.pendingFundingFeesUsd) {
    feesUsd = feesUsd.add(p.pendingFundingFeesUsd);
  }

  if (p.pendingBorrowingFeesUsd) {
    feesUsd = feesUsd.add(p.pendingBorrowingFeesUsd);
  }

  const liqPriceForFees = getLiquidationPriceFromDelta({
    liquidationAmountUsd: feesUsd,
    sizeUsd: p.sizeUsd,
    collateralUsd: remainingCollateralUsd,
    averagePrice: p.averagePrice,
    isLong: p.isLong,
  });

  const liqPriceForMaxLeverage = getLiquidationPriceFromDelta({
    liquidationAmountUsd: p.sizeUsd.mul(BASIS_POINTS_DIVISOR).div(MAX_LEVERAGE),
    sizeUsd: p.sizeUsd,
    collateralUsd: remainingCollateralUsd,
    // nah
    averagePrice: p.averagePrice,
    isLong: p.isLong,
  });

  if (!liqPriceForFees) {
    return liqPriceForMaxLeverage;
  }

  if (!liqPriceForMaxLeverage) {
    return liqPriceForFees;
  }

  if (p.isLong) {
    // return the higher price
    return liqPriceForFees.gt(liqPriceForMaxLeverage) ? liqPriceForFees : liqPriceForMaxLeverage;
  }

  // return the lower price
  return liqPriceForFees.lt(liqPriceForMaxLeverage) ? liqPriceForFees : liqPriceForMaxLeverage;
}

export function getLiquidationPriceFromDelta(p: {
  liquidationAmountUsd?: BigNumber;
  sizeUsd?: BigNumber;
  collateralUsd?: BigNumber;
  averagePrice?: BigNumber;
  isLong?: boolean;
}) {
  if (!p.sizeUsd?.gt(0) || !p.collateralUsd?.gt(0) || !p.averagePrice || !p.liquidationAmountUsd) {
    return undefined;
  }

  if (p.liquidationAmountUsd.gt(p.collateralUsd)) {
    const liquidationDelta = p.liquidationAmountUsd.sub(p.collateralUsd);
    const priceDelta = liquidationDelta.mul(p.averagePrice).div(p.sizeUsd);

    return p.isLong ? p.averagePrice.add(priceDelta) : p.averagePrice.sub(priceDelta);
  }

  const liquidationDelta = p.collateralUsd.sub(p.liquidationAmountUsd);
  const priceDelta = liquidationDelta.mul(p.averagePrice).div(p.sizeUsd);

  return p.isLong ? p.averagePrice.sub(priceDelta) : p.averagePrice.add(priceDelta);
}

export function getLeverage(p: {
  sizeUsd?: BigNumber;
  collateralUsd?: BigNumber;
  // get Pnl after decrease order
  pnl?: BigNumber;
  pendingFundingFeesUsd?: BigNumber;
  pendingBorrowingFeesUsd?: BigNumber;
}) {
  if (!p.sizeUsd?.gt(0) || !p.collateralUsd?.gt(0)) {
    return undefined;
  }

  let remainingCollateralUsd = p.collateralUsd;

  if (p.pnl) {
    remainingCollateralUsd = remainingCollateralUsd.add(p.pnl);
  }

  if (p.pendingFundingFeesUsd) {
    remainingCollateralUsd = remainingCollateralUsd.sub(p.pendingFundingFeesUsd);
  }

  if (p.pendingBorrowingFeesUsd) {
    remainingCollateralUsd = remainingCollateralUsd.sub(p.pendingBorrowingFeesUsd);
  }

  if (remainingCollateralUsd.lte(0)) {
    return undefined;
  }

  return p.sizeUsd.mul(BASIS_POINTS_DIVISOR).div(remainingCollateralUsd);
}

export function formatPnl(pnl?: BigNumber, pnlPercentage?: BigNumber) {
  let sign = "";

  if (pnl && !pnl.eq(0)) {
    sign = pnl.lt(0) ? "-" : "+";
  }

  return `${sign}${formatUsd(pnl?.abs())} (${sign}${formatAmount(pnlPercentage?.abs(), 2, 2)}%)`;
}

export function formatLeverage(leverage?: BigNumber) {
  if (!leverage) return undefined;

  return `${formatAmount(leverage, 4, 2)}x`;
}
