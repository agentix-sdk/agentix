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


function getEnvOrDefault(envKey: string, fallback: string): string {
    const proc =
      typeof globalThis !== "undefined" && (globalThis as any).process
        ? (globalThis as any).process
        : undefined;
    if (proc && proc.env && proc.env[envKey]) {
      return proc.env[envKey];
    }
    return fallback;
}

export const RANGER_SOR_API_BASE = getEnvOrDefault(
    "RANGER_SOR_API_BASE",
    "https://staging-sor-api-437363704888.asia-northeast1.run.app"
);
export const RANGER_DATA_API_BASE = getEnvOrDefault(
    "RANGER_DATA_API_BASE",
    "https://data-api-staging-437363704888.asia-northeast1.run.app"
);

