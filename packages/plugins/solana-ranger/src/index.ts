import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";
import {
  closePositionAction,
  decreasePositionAction,
  depositCollateralAction,
  getBorrowRatesAccumulatedAction,
  getFundingRateArbsAction,
  getFundingRatesAccumulatedAction,
  getFundingRatesExtremeAction,
  getFundingRatesOiWeightedAction,
  getFundingRatesTrendAction,
  getLiquidationsCapitulationAction,
  getLiquidationsHeatmapAction,
  getLiquidationsLargestAction,
  getLiquidationsLatestAction,
  getLiquidationsTotalsAction,
  getPositionsAction,
  increasePositionAction,
  getQuoteAction,
  withdrawBalanceAction,
  withdrawCollateralAction,
  getTradeHistoryAction,
} from "./actions";

import {
  openPerpTradeRanger,
  closePerpTradeRanger,
  increasePerpPositionRanger,
  decreasePerpPositionRanger,
  withdrawBalanceRanger,
  withdrawCollateralRanger,
} from "./tools";
class RangerPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
          openPerpTradeRanger,
          closePerpTradeRanger,
          increasePerpPositionRanger,
          decreasePerpPositionRanger,
          withdrawBalanceRanger,
          withdrawCollateralRanger,
        };

        const actions = [
          closePositionAction,
          decreasePositionAction,
          depositCollateralAction,
          getBorrowRatesAccumulatedAction,
          getFundingRateArbsAction,
          getFundingRatesAccumulatedAction,
          getFundingRatesExtremeAction,
          getFundingRatesOiWeightedAction,
          getFundingRatesTrendAction,
          getLiquidationsCapitulationAction,
          getLiquidationsHeatmapAction,
          getLiquidationsLargestAction,
          getLiquidationsLatestAction,
          getLiquidationsTotalsAction,
          getPositionsAction,
          increasePositionAction,
          getQuoteAction,
          withdrawBalanceAction,
          withdrawCollateralAction,
          getTradeHistoryAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("ranger", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default RangerPlugin;