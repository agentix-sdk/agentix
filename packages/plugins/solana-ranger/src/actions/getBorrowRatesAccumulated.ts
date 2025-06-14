import { z } from "zod";
import type { Action, Agentix, SolanaWalletBase } from "agentix";
import { getRangerDataAPIBase } from "@/utils";

export const getBorrowRatesAccumulatedSchema = z.object({
  symbol: z.string().optional(),
  granularity: z.string().optional(),
  platform: z.string().optional(),
});
export type GetBorrowRatesAccumulatedInput = z.infer<
  typeof getBorrowRatesAccumulatedSchema
>;

interface GetBorrowRatesAccumulatedContext {
  apiKey: string;
}

export const getBorrowRatesAccumulatedAction: Action<SolanaWalletBase> = {
  name: "GET_BORROW_RATES_ACCUMULATED",
  similes: [
    "get borrow rates accumulated",
    "fetch accumulated borrow rates",
    "borrow rates sum",
  ],
  description: "Fetch accumulated borrow rates from the Ranger API.",
  examples: [
    [
      {
        input: { symbol: "BTC-PERP", granularity: "1h", platform: "Drift" },
        output: { rates: [] },
        explanation:
          "Get accumulated borrow rates for BTC-PERP on Drift with 1h granularity.",
      },
    ],
  ],
  schema: getBorrowRatesAccumulatedSchema,
  handler: async (
    agent: Agentix<SolanaWalletBase>,
    input: any,
  ) => {
    const params = new URLSearchParams();
    if (input.symbol) params.set("symbol", input.symbol);
    if (input.granularity) params.set("granularity", input.granularity);
    if (input.platform) params.set("platform", input.platform);

    const response = await fetch(
      `${getRangerDataAPIBase(agent)}/v1/borrow_rates/accumulated?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": agent.config?.rangerDataAPIKey,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Get borrow rates accumulated request failed: ${error.message}`
      );
    }
    return response.json();
  },
};
