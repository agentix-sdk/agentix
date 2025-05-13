import { z } from "zod";

export const QuoteOrderSchema = z.object({
    type: z.enum(["sell", "buy"]),
    amount: z.string().describe("amount in basis points (e.g., 1000000 for 1 USDC)")
});

export type QuoteOrder = z.infer<typeof QuoteOrderSchema>;

export const GetQuoteSchema = z.object({
    tokenIn: z.string().describe("The input token address"),
    tokenOut: z.string().describe("The output token address"),
    order: QuoteOrderSchema.describe("Order details"),
    slippagePercentage: z.number().describe("Maximum allowed slippage (e.g., 0.5 for 0.5%)"),
    takerAddress: z.string().optional().describe("The address of the taker")
});

export type GetQuoteParams = z.infer<typeof GetQuoteSchema>;

// ExecuteSwapParams is the same as GetQuoteParams
export type ExecuteSwapParams = GetQuoteParams;

export interface QuoteRequest {
    chainId: number;
    sellToken: string;
    buyToken: string;
    order: {
        type: "sell" | "buy";
        sellAmount?: string;
        buyAmount?: string;
    };
    slippagePercentage: number;
    takerAddress: string;
}
