import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import { getPrice, swap } from "../tools/zero_ex_token_swap";

export const zeroExTokenSwapAction: Action<EvmWalletBase> = {
    name: "ZERO_EX_TOKEN_SWAP",
    similes: [
        "swap tokens using 0x",
        "exchange tokens on 0x",
        "trade tokens via 0x",
        "use 0x to swap tokens",
        "get token price on 0x"
    ],
    description: "Swap tokens on various EVM chains using the 0x protocol",
    examples: [
        [
            {
                input: {
                    sellToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
                    buyToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
                    sellAmount: "1000000000000000000", // 1 WETH in wei
                    slippageBps: 100, // 1% slippage
                },
                output: {
                    status: "success",
                    message: "Successfully swapped 1 WETH for 1,800 USDC",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                explanation: "Swap 1 WETH for USDC with 1% maximum slippage on Ethereum mainnet",
            },
        ],
    ],
    schema: z.object({
        sellToken: z.string().describe("The token address to sell, or a ticker symbol (ETH, WETH, USDC, etc.)"),
        buyToken: z.string().describe("The token address to buy, or a ticker symbol (ETH, WETH, USDC, etc.)"),
        sellAmount: z.string().describe("The amount of tokens to sell in base units (wei, satoshi, etc.)"),
        slippageBps: z.number().optional().describe("The maximum acceptable slippage in basis points (1 = 0.01%). Default: 100 (1%)"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const txHash = await swap({
                agent,
                sellToken: input.sellToken,
                buyToken: input.buyToken,
                sellAmount: input.sellAmount,
                slippageBps: input.slippageBps,
            });

            return {
                status: "success",
                message: `Token swap executed successfully`,
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

export const zeroExTokenPriceAction: Action<EvmWalletBase> = {
    name: "ZERO_EX_TOKEN_PRICE",
    similes: [
        "get token price on 0x",
        "get token price via 0x",
        "get token price via 0x",
        "use 0x to get token price",
        "get token price on 0x"
    ],
    description: "Get the price of a token pair on various EVM chains using the 0x protocol",
    examples: [
        [
            {
                input: {
                    sellToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
                    buyToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
                    sellAmount: "1000000000000000000", // 1 WETH in wei
                    slippageBps: 100, // 1% slippage
                },
                output: {
                    status: "success",
                    message: "Successfully got the price of 1 WETH in USDC",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                explanation: "Get the price of 1 WETH in USDC with 1% maximum slippage on Ethereum mainnet",
            },
        ],
    ],
    schema: z.object({
        sellToken: z.string().describe("The token address to sell, or a ticker symbol (ETH, WETH, USDC, etc.)"),
        buyToken: z.string().describe("The token address to buy, or a ticker symbol (ETH, WETH, USDC, etc.)"),
        sellAmount: z.string().describe("The amount of tokens to sell in base units (wei, satoshi, etc.)"),
        slippageBps: z.number().optional().describe("The maximum acceptable slippage in basis points (1 = 0.01%). Default: 100 (1%)"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const price = await getPrice({
                agent,
                sellToken: input.sellToken,
                buyToken: input.buyToken,
                sellAmount: input.sellAmount,
                slippageBps: input.slippageBps,
            });

            return {
                status: "success",
                message: `Successfully got the price of ${input.sellAmount} ${input.sellToken} in ${input.buyToken}`,
                price: price,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};
