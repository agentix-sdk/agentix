import type { Action, Agentix, SolanaWalletBase } from "agentix";
import { z } from "zod";
import { sanctumAddLiquidity } from "../tools";

export const sanctumAddLiquidityAction: Action<SolanaWalletBase> = {
  name: "SANCTUM_ADD_LIQUIDITY",
  similes: ["add liquidity to sanctum pool", "deposit to sanctum pool"],
  description: "Add liquidity to a Sanctum pool with specified parameters",
  examples: [
    [
      {
        input: {
          lstMint: "So11111111111111111111111111111111111111112",
          amount: "1000000000",
          quotedAmount: "900000000",
          priorityFee: 5000,
        },
        output: {
          status: "success",
          message: "Liquidity added successfully",
          txId: "2jg87stmvPygRXJrqfpydZQSzGJK9rKvawekzy5mzuEmSjRf8bCmiGpFH8iLa2YrQxtreWcK99319DVTpCJHYZfx",
        },
        explanation: "Add liquidity to a Sanctum pool",
      },
    ],
  ],
  schema: z.object({
    lstMint: z.string(),
    amount: z.string(),
    quotedAmount: z.string(),
    priorityFee: z.number(),
  }),
  handler: async (agent: Agentix<SolanaWalletBase>, input: Record<string, any>) => {
    try {
      const result = await sanctumAddLiquidity(
        agent,
        input.lstMint,
        input.amount,
        input.quotedAmount,
        input.priorityFee,
      );

      return {
        status: "success",
        message:
          typeof result === "string"
            ? "Liquidity added successfully"
            : "Liquidity addition transaction generated successfully. Please send the transaction to the network.",
        transaction: result,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Adding liquidity to Sanctum pool failed: ${error.message}`,
      };
    }
  },
};
