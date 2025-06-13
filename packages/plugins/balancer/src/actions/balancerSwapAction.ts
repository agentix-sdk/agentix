import { Action, EvmWalletBase } from "agentix";
import { swapOnBalancer } from "../tools/balancer";
import { SwapParams } from "../types";

export const balancerSwapAction: Action<EvmWalletBase> = {
    name: "BALANCER_SWAP",
    similes: [
        "swap tokens using Balancer",
        "exchange tokens on Balancer",
        "trade tokens via Balancer",
        "use Balancer to swap tokens",
        "get token price on Balancer"
    ],
    description: "Swap tokens on Balancer using Smart Order Router",
    examples: [
        [
            {
                input: {
                    tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
                    tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
                    tokenInDecimals: 18,
                    tokenOutDecimals: 6,
                    amountIn: "1000000000000000000", // 1 WETH in wei
                    slippage: "0.1", // 0.1% slippage
                },
                output: {
                    status: "success",
                    message: "Successfully swapped 1 WETH for USDC",
                    data: {
                        amountOut: "1800000000",  // 1,800 USDC
                        txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                    }
                },
                explanation: "Swap 1 WETH for USDC with 0.1% maximum slippage on Ethereum mainnet",
            },
        ],
    ],
    schema: SwapParams,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await swapOnBalancer({
                agent,
                tokenIn: input.tokenIn,
                tokenOut: input.tokenOut,
                tokenInDecimals: input.tokenInDecimals,
                tokenOutDecimals: input.tokenOutDecimals,
                amountIn: input.amountIn,
                slippage: input.slippage,
                deadline: input.deadline,
                wethIsEth: input.wethIsEth
            });

            return {
                status: "success",
                message: `Successfully swapped tokens on Balancer`,
                data: result.data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 