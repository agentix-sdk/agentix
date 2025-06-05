import { Action, Agentix, SolanaWalletBase } from "agentix";

import { PublicKey } from "@solana/web3.js";
import { z } from "zod";
import { JupiterTokenData } from "../types";
import { getTokenDataByAddress, getTokenDataByTicker } from "../tools";

const getTokenDataByAddressAction: Action<SolanaWalletBase> = {
  name: "GET_TOKEN_DATA_BY_ADDRESS",
  similes: [
    "get token info",
    "token details",
    "lookup token",
    "find token",
    "token data",
  ],
  description: "Get token data from a token address",
  examples: [
    [
      {
        input: {
          address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        output: {
          status: "success",
          token: {
            name: "USD Coin",
            symbol: "USDC",
            address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            decimals: 6,
          },
        },
        explanation: "Get token data using the token's address",
      },
    ],
  ],
  schema: z.object({
    address: z.string().describe("The token's mint address"),
  }),
  handler: async (_agent: Agentix<SolanaWalletBase>, input: Record<string, any>) => {
    try {
      let tokenData: JupiterTokenData | undefined;
      if (input.address) {
        tokenData = await getTokenDataByAddress(new PublicKey(input.address));
      }
      if (!tokenData) {
        return {
          status: "error",
          message: "Token not found or not verified",
        };
      }
      return {
        status: "success",
        token: {
          name: tokenData.name,
          symbol: tokenData.symbol,
          address: tokenData.address,
          decimals: tokenData.decimals,
          logoURI: tokenData.logoURI,
        },
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to get token data: ${error.message}`,
      };
    }
  },
};

const getTokenDataByTickerAction: Action<SolanaWalletBase> = {
  name: "GET_TOKEN_DATA_BY_TICKER",
  similes: [
    "get token info",
    "token details",
    "lookup token",
    "find token",
    "token data",
  ],
  description: "Get token data from a token ticker symbol",
  examples: [
    [
      {
        input: {
          ticker: "USDC",
        },
        output: {
          status: "success",
          token: {
            name: "USD Coin",
            symbol: "USDC",
            address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            decimals: 6,
          },
        },
        explanation: "Get token data using the token's ticker symbol",
      },
    ],
  ],
  schema: z.object({
    ticker: z.string().describe("The token's ticker symbol"),
  }),
  handler: async (_agent: Agentix<SolanaWalletBase>, input: Record<string, any>) => {
    try {
      const tokenData = await getTokenDataByTicker(input.ticker);
      if (!tokenData) {
        return {
          status: "error",
          message: "Token not found or not verified",
        };
      }
      return {
        status: "success",
        token: {
          name: tokenData.name,
          symbol: tokenData.symbol,
          address: tokenData.address,
          decimals: tokenData.decimals,
          logoURI: tokenData.logoURI,
        },
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to get token data: ${error.message}`,
      };
    }
  },
};

export {
  getTokenDataByAddressAction,
  getTokenDataByTickerAction,
};
