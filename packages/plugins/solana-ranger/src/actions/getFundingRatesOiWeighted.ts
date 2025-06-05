import { z } from "zod";
import type { Action, Agentix, SolanaWalletBase } from "agentix";
import { getRangerDataAPIBase } from "@/utils";

export const getFundingRatesOiWeightedSchema = z.object({});
export type GetFundingRatesOiWeightedInput = z.infer<
  typeof getFundingRatesOiWeightedSchema
>;

interface GetFundingRatesOiWeightedContext {
  apiKey: string;
}

export const getFundingRatesOiWeightedAction: Action<SolanaWalletBase> = {
  name: "GET_FUNDING_RATES_OI_WEIGHTED",
  similes: [
    "get oi weighted funding rates",
    "fetch open interest weighted funding",
    "oi weighted funding rates",
  ],
  description:
    "Fetch open interest weighted funding rates from the Ranger API.",
  examples: [
    [
      {
        input: {},
        output: { rates: [] },
        explanation: "Get open interest weighted funding rates.",
      },
    ],
  ],
  schema: getFundingRatesOiWeightedSchema,
  handler: async (
    agent: Agentix<SolanaWalletBase>,
    _input: any,
  ) => {
    const response = await fetch(
      `${getRangerDataAPIBase(agent)}/v1/funding_rates/oi_weighted`,
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
        `Get funding rates oi weighted request failed: ${error.message}`
      );
    }
    return response.json();
  },
};
