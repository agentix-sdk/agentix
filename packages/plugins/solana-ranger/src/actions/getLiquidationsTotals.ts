import { z } from "zod";
import type { Action, Agentix, SolanaWalletBase } from "agentix";
import { RANGER_DATA_API_BASE } from "../index";

export const getLiquidationsTotalsSchema = z.object({});
export type GetLiquidationsTotalsInput = z.infer<
  typeof getLiquidationsTotalsSchema
>;

interface GetLiquidationsTotalsContext {
  apiKey: string;
}

export const getLiquidationsTotalsAction: Action<SolanaWalletBase> = {
  name: "GET_LIQUIDATIONS_TOTALS",
  similes: [
    "get liquidations totals",
    "fetch liquidation totals",
    "liquidations summary",
  ],
  description: "Fetch the total liquidations from the Ranger API.",
  examples: [
    [
      {
        input: {},
        output: { totals: [] },
        explanation: "Get the total liquidations.",
      },
    ],
  ],
  schema: getLiquidationsTotalsSchema,
  handler: async (
    agent: Agentix<SolanaWalletBase>,
    _input: any,
    { apiKey }: any
  ) => {
    const response = await fetch(
      `${RANGER_DATA_API_BASE}/v1/liquidations/totals`,
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
        `Get liquidations totals request failed: ${error.message}`
      );
    }
    return response.json();
  },
};
