import { FeeItem, SwapFeeItem, getFeeItem, getTotalFeeItem } from "domain/synthetics/fees";
import { MarketInfo } from "domain/synthetics/markets";
import { BigNumber } from "ethers";
import { getBasisPoints } from "lib/numbers";
import { SwapStats, TradeFees, TradeMode, TradeType } from "../types";

export function getTradeFlags(tradeType: TradeType, tradeMode: TradeMode) {
  const isLong = tradeType === TradeType.Long;
  const isShort = tradeType === TradeType.Short;
  const isSwap = tradeType === TradeType.Swap;
  const isPosition = isLong || isShort;
  const isMarket = tradeMode === TradeMode.Market;
  const isLimit = tradeMode === TradeMode.Limit;
  const isTrigger = tradeMode === TradeMode.Trigger;
  const isIncrease = isPosition && (isMarket || isLimit);

  return {
    isLong,
    isShort,
    isSwap,
    isPosition,
    isIncrease,
    isTrigger,
    isMarket,
    isLimit,
  };
}

export function getDisplayedTradeFees(p: {
  marketInfo?: MarketInfo;
  initialCollateralUsd?: BigNumber;
  sizeDeltaUsd?: BigNumber;
  swapSteps?: SwapStats[];
  positionFeeUsd?: BigNumber;
  swapPriceImpactDeltaUsd?: BigNumber;
  positionPriceImpactDeltaUsd?: BigNumber;
  borrowingFeeUsd?: BigNumber;
  fundingFeeDeltaUsd?: BigNumber;
}): TradeFees | undefined {
  const swapBasis = p.initialCollateralUsd;
  const positionBasis = p.sizeDeltaUsd;

  const swapFees: SwapFeeItem[] | undefined = swapBasis
    ? p.swapSteps?.map((step) => ({
        tokenInAddress: step.tokenInAddress,
        tokenOutAddress: step.tokenOutAddress,
        marketAddress: step.marketAddress,
        deltaUsd: step.swapFeeUsd.mul(-1),
        bps: getBasisPoints(step.swapFeeUsd.mul(-1), swapBasis),
      }))
    : undefined;

  const swapPriceImpactFee = getFeeItem(p.swapPriceImpactDeltaUsd, swapBasis);

  const positionFee = getFeeItem(p.positionFeeUsd?.mul(-1), positionBasis);

  const borrowFee = getFeeItem(p.borrowingFeeUsd?.mul(-1), p.initialCollateralUsd);

  const fundingFee = p.fundingFeeDeltaUsd?.lt(0) ? getFeeItem(p.fundingFeeDeltaUsd, p.initialCollateralUsd) : undefined;

  const positionPriceImpactFee = getFeeItem(p.positionPriceImpactDeltaUsd, positionBasis);

  const totalFees = getTotalFeeItem(
    [...(swapFees || []), swapPriceImpactFee, positionFee, positionPriceImpactFee, borrowFee, fundingFee].filter(
      Boolean
    ) as FeeItem[]
  );

  return {
    totalFees,
    swapFees,
    swapPriceImpact: swapPriceImpactFee,
    positionFee,
    positionPriceImpact: positionPriceImpactFee,
    borrowFee,
    fundingFee,
  };
}