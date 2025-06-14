import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import { route } from "../tools/enso";

export const ensoRouteAction: Action<EvmWalletBase> = {
    name: "ENSO_ROUTE",
    similes: [
        "swap tokens with enso",
        "route tokens through enso",
        "find optimal route with enso",
        "exchange tokens via enso",
        "trade tokens using enso"
    ],
    description: "Find the most optimal route between tokenIn and tokenOut and execute it using Enso",
    examples: [
        [
            {
                input: {
                    tokenIn: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                    tokenOut: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                    amountIn: "100"
                },
                output: {
                    status: "success",
                    message: "Successfully routed tokens through Enso",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                explanation: "Swap 100 USDC for WETH using Enso's optimal routing",
            },
        ],
    ],
    schema: z.object({
        tokenIn: z
            .string()
            .describe("Address of the token to swap from. For native tokens use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
            .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum contract address"),
        tokenOut: z
            .string()
            .describe("Address of the token to swap to. For native tokens use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
            .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum contract address"),
        amountIn: z
            .string()
            .describe("The amount of tokens to send, specified as a decimal number (e.g. '1.5' or '100')")
            .regex(/^\d*\.?\d+$/, 'Must be a valid decimal number as a string'),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const txHash = await route({
                agent,
                tokenIn: input.tokenIn,
                tokenOut: input.tokenOut,
                amountIn: input.amountIn,
            });

            return {
                status: "success",
                message: `Successfully routed ${input.amountIn} tokens through Enso`,
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
