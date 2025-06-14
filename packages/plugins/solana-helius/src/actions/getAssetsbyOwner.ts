import { PublicKey } from "@solana/web3.js";
import { Action, Agentix, SolanaWalletBase } from "agentix";
import { z } from "zod";
import { getAssetsByOwner } from "../tools";

const getAssetsByOwnerAction: Action<SolanaWalletBase> = {
  name: "FETCH_ASSETS_BY_OWNER",
  similes: [
    "fetch assets",
    "get assets",
    "retrieve assets",
    "list assets",
    "assets by owner",
  ],
  description:
    "Fetch assets owned by a specific Solana wallet address using the Helius Digital Asset Standard API",
  examples: [
    [
      {
        input: {
          ownerPublicKey: "4Pf8q3mHGLdkoc1M8xWZwW5q32gYmdhwC2gJ8K9EAGDX",
          limit: 10,
        },
        output: {
          status: "success",
          assets: [
            {
              name: "Helius NFT #1",
              type: "NFT",
              owner: "4Pf8q3mHGLdkoc1M8xWZwW5q32gYmdhwC2gJ8K9EAGDX",
            },
            {
              name: "Helius Token #10",
              type: "Token",
              owner: "4Pf8q3mHGLdkoc1M8xWZwW5q32gYmdhwC2gJ8K9EAGDX",
            },
          ],
          message: "Successfully fetched assets for the wallet address",
        },
        explanation:
          "Fetches a list of assets from the for the given wallet address with a limit of 10 items.",
      },
    ],
  ],
  schema: z.object({
    ownerPublicKey: z.string().describe("Owner's Solana wallet PublicKey"),
    limit: z
      .number()
      .positive()
      .describe("Number of assets to retrieve per request"),
  }),
  handler: async (agent: Agentix<SolanaWalletBase>, input: Record<string, any>) => {
    try {
      const assets = await getAssetsByOwner(
        agent,
        new PublicKey(input.ownerPublicKey),
        input.limit,
      );

      return {
        status: "success",
        assets: assets,
        message: `Successfully fetched assets for the wallet address: ${input.ownerPublicKey}`,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to fetch assets: ${error.message}`,
      };
    }
  },
};

export default getAssetsByOwnerAction;
