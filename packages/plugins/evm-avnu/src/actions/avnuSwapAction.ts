import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import { executeTokenSwap } from "../tools/avnu";

export const avnuSwapAction: Action<EvmWalletBase> = {
    name: "AVNU_TOKEN_SWAP",
    similes: [
        "swap tokens using Avnu",
        "exchange tokens on Avnu",
        "trade tokens on Starknet via Avnu",
        "use Avnu to swap tokens",
        "perform token swap on Avnu DEX"
    ],
    description: "Execute a token swap on the Avnu DEX on Starknet",
    examples: [
        [
            {
                input: {
                    sellTokenAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // ETH
                    buyTokenAddress: "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8", // USDC
                    sellAmount: "1000000000000000000", // 1 ETH in wei
                    slippage: 0.3, // 30% slippage
                },
                output: {
                    status: "success",
                    message: "Successfully swapped 1 ETH for USDC",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                explanation: "Swap 1 ETH for USDC with 30% maximum slippage on Starknet",
            },
        ],
    ],
    schema: z.object({
        sellTokenAddress: z
            .string()
            .regex(/^0x[a-fA-F0-9]{64}$/, "Must be a valid Starknet address (0x followed by 64 hex characters)")
            .describe("The address of the token to sell"),
        buyTokenAddress: z
            .string()
            .regex(/^0x[a-fA-F0-9]{64}$/, "Must be a valid Starknet address (0x followed by 64 hex characters)")
            .describe("The address of the token to buy"),
        sellAmount: z
            .string()
            .describe("The amount of tokens to sell in base units"),
        slippage: z
            .number()
            .min(0)
            .max(0.5)
            .describe("Slippage tolerance (0.3 = 30%)")
            .default(0.3),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            // Note: executeTokenSwap currently throws an error because this plugin
            // is configured for EVM but Avnu requires Starknet
            const swapResult = await executeTokenSwap({
                agent,
                sellTokenAddress: input.sellTokenAddress,
                buyTokenAddress: input.buyTokenAddress,
                sellAmount: input.sellAmount,
                slippage: input.slippage,
            });

            return {
                status: "success",
                message: `Successfully executed token swap on Avnu`,
                // The actual transaction hash would come from the swap result
                // but since our implementation throws an error, this is unreachable
                transactionHash: "0x", 
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 