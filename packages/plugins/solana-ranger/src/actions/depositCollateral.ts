import { z } from "zod";
import type { Action, Agentix, SolanaWalletBase } from "agentix";
import { VersionedTransaction } from "@solana/web3.js";
import base64js from "base64-js";
import { getRangerSorAPIBase } from "@/utils";

export const depositCollateralSchema = z.object({
  fee_payer: z.string(),
  symbol: z.string(),
  side: z.enum(["Long", "Short"]),
  collateral: z.number().positive(),
  collateral_denomination: z.literal("USDC"),
  adjustment_type: z.enum([
    "DepositCollateralFlash",
    "DepositCollateralJupiter",
    "DepositCollateralDrift",
  ]),
});

export type DepositCollateralInput = z.infer<typeof depositCollateralSchema>;

interface DepositCollateralContext {
  apiKey: string;
}

export const depositCollateralAction: Action<SolanaWalletBase> = {
  name: "DEPOSIT_COLLATERAL",
  similes: ["deposit collateral", "add margin", "add funds"],
  description:
    "Deposit collateral to a perp position using the Ranger SOR API.",
  examples: [
    [
      {
        input: {
          fee_payer: "YOUR_PUBLIC_KEY",
          symbol: "SOL",
          side: "Long",
          collateral: 100.0,
          collateral_denomination: "USDC",
          adjustment_type: "DepositCollateralFlash",
        },
        output: { signature: "...", meta: { venues: [] } },
        explanation:
          "Deposit 100 USDC collateral to a long SOL position via Flash.",
      },
    ],
  ],
  schema: depositCollateralSchema,
  handler: async (
    agent: Agentix<SolanaWalletBase>,
    input: any,
  ) => {
    const response = await fetch(
      `${getRangerSorAPIBase(agent)}/v1/deposit_collateral`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": agent.config?.rangerSorAPIKey,
        },
        body: JSON.stringify(input),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Deposit collateral request failed: ${error.message}`);
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
