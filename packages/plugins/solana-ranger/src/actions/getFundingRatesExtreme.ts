import { z } from "zod";
import type { Action, Agentix, SolanaWalletBase } from "agentix";
import { getRangerDataAPIBase } from "@/utils";

export const getFundingRatesExtremeSchema = z.object({
  granularity: z.string().optional(),
  limit: z.number().int().optional(),
});
export type GetFundingRatesExtremeInput = z.infer<
  typeof getFundingRatesExtremeSchema
>;

interface GetFundingRatesExtremeContext {
  apiKey: string;
}

export const getFundingRatesExtremeAction: Action<SolanaWalletBase> = {
  name: "GET_FUNDING_RATES_EXTREME",
  similes: [
    "get funding rates extreme",
    "fetch extreme funding",
    "funding rates outliers",
  ],
  description: "Fetch extreme funding rates from the Ranger API.",
  examples: [
    [
      {
        input: { granularity: "1h", limit: 5 },
        output: { rates: [] },
        explanation: "Get 5 most extreme funding rates with 1h granularity.",
      },
    ],
  ],
  schema: getFundingRatesExtremeSchema,
  handler: async (
    agent: Agentix<SolanaWalletBase>,
    input: any,
  ) => {
    const params = new URLSearchParams();
    if (input.granularity) params.set("granularity", input.granularity);
    if (input.limit !== undefined) params.set("limit", input.limit.toString());

    const response = await fetch(
      `${getRangerDataAPIBase(agent)}/v1/funding_rates/extreme?${params.toString()}`,
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
        `Get funding rates extreme request failed: ${error.message}`
      );
    }
    return response.json();
  },
};
