import { Action, EvmWalletBase } from "agentix";
import { executeSwap, getQuote } from "../tools/balmy";
import { GetQuoteSchema } from "../types";
import { z } from "zod";

export const balmyGetQuoteAction: Action<EvmWalletBase> = {
    name: "BALMY_GET_QUOTE",
    similes: [
        "get swap quote from Balmy",
        "find token exchange rate on Balmy",
        "check token price on Balmy",
        "calculate token swap on Balmy",
        "get Balmy price for token swap"
    ],
    description: "Get quotes for a token swap using Balmy",
    examples: [
        [
            {
                input: {
                    tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
                    tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
                    order: {
                        type: "sell",
                        amount: "1000000000000000000" // 1 WETH in wei
                    },
                    slippagePercentage: 0.5 // 0.5% slippage
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved quote from Balmy",
                    quote: {
                        sellAmount: { amount: "1000000000000000000" },
                        buyAmount: { amount: "1800000000" }, // 1,800 USDC
                        // Additional quote details...
                    }
                },
                explanation: "Get a quote for swapping 1 WETH to USDC with 0.5% slippage",
            },
        ],
    ],
    schema: GetQuoteSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const quoteResult = await getQuote({
                agent,
                tokenIn: input.tokenIn,
                tokenOut: input.tokenOut,
                order: input.order,
                slippagePercentage: input.slippagePercentage,
                takerAddress: input.takerAddress
            });

            return {
                status: "success",
                message: "Successfully retrieved quote from Balmy",
                quote: quoteResult
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const balmyExecuteSwapAction: Action<EvmWalletBase> = {
    name: "BALMY_EXECUTE_SWAP",
    similes: [
        "swap tokens using Balmy",
        "exchange tokens on Balmy",
        "trade tokens via Balmy",
        "use Balmy to swap tokens",
        "execute token swap on Balmy"
    ],
    description: "Execute a token swap using Balmy",
    examples: [
        [
            {
                input: {
                    tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
                    tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
                    order: {
                        type: "sell",
                        amount: "1000000000000000000" // 1 WETH in wei
                    },
                    slippagePercentage: 0.5 // 0.5% slippage
                },
                output: {
                    status: "success",
                    message: "Successfully executed swap on Balmy",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                explanation: "Swap 1 WETH for USDC with 0.5% slippage",
            },
        ],
    ],
    schema: GetQuoteSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const txHash = await executeSwap({
                agent,
                tokenIn: input.tokenIn,
                tokenOut: input.tokenOut,
                order: input.order,
                slippagePercentage: input.slippagePercentage,
                takerAddress: input.takerAddress
            });

            return {
                status: "success",
                message: "Successfully executed swap on Balmy",
                transactionHash: txHash,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 