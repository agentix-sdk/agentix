import { z } from "zod";

export interface BalancerConfig {
    rpcUrl: string;
    apiUrl?: string;
}

export const hexAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/);

export const SwapParams = z.object({
    tokenIn: hexAddress.describe("The address of the input token"),
    tokenOut: hexAddress.describe("The address of the output token"),
    tokenInDecimals: z.number().describe("The number of decimals for the input token"),
    tokenOutDecimals: z.number().describe("The number of decimals for the output token"),
    amountIn: z.string().describe("The amount of input tokens to swap (in basis points/wei)"),
    slippage: z.string().default("0.1").describe("Maximum slippage allowed (in percentage)"),
    deadline: z.number().optional().describe("Transaction deadline (in seconds)"),
    wethIsEth: z.boolean().default(false).describe("Whether to use ETH instead of WETH"),
});

export type SwapParameters = z.infer<typeof SwapParams>;

export const TokenAmount = z.object({
    token: hexAddress.describe("Token address"),
    amount: z.string().describe("Token amount (in basis points/wei)"),
    decimals: z.number().describe("Token decimals"),
});

export const LiquidityParams = z.object({
    pool: hexAddress.describe("The address of the Balancer pool"),
    amounts: z
        .array(
            z.object({
                token: hexAddress.describe("Token address"),
                amount: z.string().describe("Token amount (in basis points/wei)"),
                decimals: z.number().describe("Token decimals"),
            }),
        )
        .describe("Array of token amounts to add as liquidity"),
    kind: z.enum(["Unbalanced", "Exact"]).describe("Type of liquidity addition"),
    slippage: z.string().default("0.1").describe("Maximum slippage allowed (in percentage)"),
    deadline: z.number().optional().describe("Transaction deadline (in seconds)"),
    wethIsEth: z.boolean().default(false).describe("Whether to use ETH instead of WETH"),
});

export type LiquidityParameters = z.infer<typeof LiquidityParams>;

export const RemoveLiquidityParams = z.object({
    pool: hexAddress.describe("The address of the Balancer pool"),
    bptAmountIn: z.string().describe("Amount of BPT tokens to remove"),
    kind: z.enum(["Proportional", "Single"]).describe("Type of liquidity removal"),
    slippage: z.string().default("0.1").describe("Maximum slippage allowed (in percentage)"),
    wethIsEth: z.boolean().default(false).describe("Whether to unwrap WETH to ETH"),
});

export type RemoveLiquidityParameters = z.infer<typeof RemoveLiquidityParams>;
