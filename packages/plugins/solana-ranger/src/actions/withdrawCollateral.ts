import { z } from "zod";
import type { Action, Agentix, SolanaWalletBase } from "agentix";
import { RANGER_SOR_API_BASE } from "../index";
import { TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import base64js from "base64-js";

export const withdrawCollateralSchema = z.object({
  fee_payer: z.string(),
  symbol: z.string(),
  side: z.enum(["Long", "Short"]),
  collateral: z.number().positive(),
  collateral_denomination: z.literal("USDC"),
  adjustment_type: z.enum([
    "WithdrawCollateralFlash",
    "WithdrawCollateralJupiter",
    "WithdrawCollateralDrift",
  ]),
});

export type WithdrawCollateralInput = z.infer<typeof withdrawCollateralSchema>;

interface WithdrawCollateralContext {
  apiKey: string;
}

export const withdrawCollateralAction: Action<SolanaWalletBase> = {
  name: "WITHDRAW_COLLATERAL",
  similes: ["withdraw collateral", "remove margin", "remove funds"],
  description:
    "Withdraw collateral from a perp position using the Ranger SOR API.",
  examples: [
    [
      {
        input: {
          fee_payer: "YOUR_PUBLIC_KEY",
          symbol: "SOL",
          side: "Long",
          collateral: 50.0,
          collateral_denomination: "USDC",
          adjustment_type: "WithdrawCollateralFlash",
        },
        output: { signature: "...", meta: { venues: [] } },
        explanation:
          "Withdraw 50 USDC collateral from a long SOL position via Flash.",
      },
    ],
  ],
  schema: withdrawCollateralSchema,
  handler: async (
    agent: Agentix<SolanaWalletBase>,
    input: any,
    { apiKey }: any
  ) => {
    const response = await fetch(
      `${RANGER_SOR_API_BASE}/v1/withdraw_collateral`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(input),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Withdraw collateral request failed: ${error.message}`);
    }
    const data = await response.json();
    const messageBase64 = data.message;
    const messageBytes = base64js.toByteArray(messageBase64);
    const transaction = VersionedTransaction.deserialize(messageBytes);
    const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
    transaction.message.recentBlockhash = blockhash;
    const signature = await agent.wallet.signAndSendTransaction(
      transaction
    );
    return { signature, meta: data.meta };
  },
};
