import { Action, EvmWalletBase } from "agentix";
import { addLiquidity, removeLiquidity } from "../tools/balancer";
import { LiquidityParams, RemoveLiquidityParams } from "../types";

export const addLiquidityAction: Action<EvmWalletBase> = {
    name: "BALANCER_ADD_LIQUIDITY",
    similes: [
        "add liquidity to Balancer",
        "provide liquidity on Balancer",
        "deposit tokens into Balancer pool",
        "join Balancer pool",
        "add tokens to Balancer"
    ],
    description: "Add liquidity to a Balancer pool",
    examples: [
        [
            {
                input: {
                    pool: "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56",
                    amounts: [
                        {
                            token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
                            amount: "1000000000000000000", // 1 WETH in wei
                            decimals: 18
                        },
                        {
                            token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
                            amount: "1000000000", // 1000 USDC
                            decimals: 6
                        }
                    ],
                    kind: "Unbalanced",
                    slippage: "0.1", // 0.1% slippage
                },
                output: {
                    status: "success",
                    message: "Successfully added liquidity to Balancer pool",
                    data: {
                        bptOut: "123456789000000000000",
                        txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                    }
                },
                explanation: "Add 1 WETH and 1000 USDC to a Balancer pool",
            },
        ],
    ],
    schema: LiquidityParams,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await addLiquidity({
                agent,
                pool: input.pool,
                amounts: input.amounts,
                kind: input.kind,
                slippage: input.slippage,
                deadline: input.deadline,
                wethIsEth: input.wethIsEth
            });

            return {
                status: "success",
                message: `Successfully added liquidity to Balancer pool`,
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

export const removeLiquidityAction: Action<EvmWalletBase> = {
    name: "BALANCER_REMOVE_LIQUIDITY",
    similes: [
        "remove liquidity from Balancer",
        "withdraw from Balancer pool",
        "exit Balancer pool",
        "redeem BPT tokens",
        "take liquidity out of Balancer"
    ],
    description: "Remove liquidity from a Balancer pool",
    examples: [
        [
            {
                input: {
                    pool: "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56",
                    bptAmountIn: "100000000000000000000", // 100 BPT tokens
                    kind: "Proportional",
                    slippage: "0.1", // 0.1% slippage
                },
                output: {
                    status: "success",
                    message: "Successfully removed liquidity from Balancer pool",
                    data: {
                        amountsOut: [
                            {
                                token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                                amount: "1000000000000000000"
                            },
                            {
                                token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                                amount: "1000000000"
                            }
                        ],
                        txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                    }
                },
                explanation: "Remove 100 BPT tokens from a Balancer pool proportionally",
            },
        ],
    ],
    schema: RemoveLiquidityParams,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await removeLiquidity({
                agent,
                pool: input.pool,
                bptAmountIn: input.bptAmountIn,
                kind: input.kind,
                slippage: input.slippage,
                wethIsEth: input.wethIsEth
            });

            return {
                status: "success",
                message: `Successfully removed liquidity from Balancer pool`,
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