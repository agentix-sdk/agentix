import { z } from "zod";
import type { Action, Agentix, SolanaWalletBase } from "agentix";
import { RANGER_DATA_API_BASE } from "../index";

export const getFundingRatesAccumulatedSchema = z.object({
  symbol: z.string().optional(),
  granularity: z.string().optional(),
  platform: z.string().optional(),
});
export type GetFundingRatesAccumulatedInput = z.infer<
  typeof getFundingRatesAccumulatedSchema
>;

interface GetFundingRatesAccumulatedContext {
  apiKey: string;
}

export const getFundingRatesAccumulatedAction: Action<SolanaWalletBase> = {
  name: "GET_FUNDING_RATES_ACCUMULATED",
  similes: [
    "get funding rates accumulated",
    "fetch accumulated funding",
    "funding rates sum",
  ],
  description: "Fetch accumulated funding rates from the Ranger API.",
  examples: [
    [
      {
        input: { symbol: "BTC-PERP", granularity: "1h", platform: "Drift" },
        output: { rates: [] },
        explanation:
          "Get accumulated funding rates for BTC-PERP on Drift with 1h granularity.",
      },
    ],
  ],
  schema: getFundingRatesAccumulatedSchema,
  handler: async (
    agent: Agentix<SolanaWalletBase>,
    input: any,
    { apiKey }: any
  ) => {
    const params = new URLSearchParams();
    if (input.symbol) params.set("symbol", input.symbol);
    if (input.granularity) params.set("granularity", input.granularity);
    if (input.platform) params.set("platform", input.platform);

    const response = await fetch(
      `${RANGER_DATA_API_BASE}/v1/funding_rates/accumulated?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Get funding rates accumulated request failed: ${error.message}`
      );
    }
    return response.json();
  },
};
