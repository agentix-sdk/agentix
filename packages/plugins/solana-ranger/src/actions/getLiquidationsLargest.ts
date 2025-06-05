import { z } from "zod";
import type { Action, Agentix, SolanaWalletBase } from "agentix";
import { getRangerDataAPIBase } from "@/utils";

export const getLiquidationsLargestSchema = z.object({
  granularity: z.string().optional(),
  limit: z.number().int().optional(),
});
export type GetLiquidationsLargestInput = z.infer<
  typeof getLiquidationsLargestSchema
>;

interface GetLiquidationsLargestContext {
  apiKey: string;
}

export const getLiquidationsLargestAction: Action<SolanaWalletBase> = {
  name: "GET_LIQUIDATIONS_LARGEST",
  similes: [
    "get largest liquidations",
    "fetch largest liquidations",
    "liquidations biggest",
  ],
  description: "Fetch the largest liquidations from the Ranger API.",
  examples: [
    [
      {
        input: { granularity: "1h", limit: 10 },
        output: { liquidations: [] },
        explanation: "Get the 10 largest liquidations with 1h granularity.",
      },
    ],
  ],
  schema: getLiquidationsLargestSchema,
  handler: async (
    agent: Agentix<SolanaWalletBase>,
    input: any,
  ) => {
    const params = new URLSearchParams();
    if (input.granularity) params.set("granularity", input.granularity);
    if (input.limit !== undefined) params.set("limit", input.limit.toString());

    const response = await fetch(
      `${getRangerDataAPIBase(agent)}/v1/liquidations/largest?${params.toString()}`,
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
        `Get liquidations largest request failed: ${error.message}`
      );
    }
    return response.json();
  },
};
