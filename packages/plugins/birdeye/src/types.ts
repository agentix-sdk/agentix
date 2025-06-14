import { z } from "zod";

export const supportedChains = [
    "solana",
    "ethereum",
    "arbitrum",
    "avalanche",
    "bsc",
    "optimism",
    "polygon",
    "base",
    "zksync",
    "sui",
] as const;

export type SupportedChain = typeof supportedChains[number];

export const chainSchema = z.enum(supportedChains).describe("Chain name (e.g., ethereum, solana)");

// Defi Price Parameters
export const GetTokenPriceSchema = z.object({
    list_address: z.array(z.string()).max(100).describe("Array of token contract addresses (max 100)"),
    chain: chainSchema,
    include_liquidity: z.boolean().optional().describe("Include liquidity"),
});

export type GetTokenPriceParams = z.infer<typeof GetTokenPriceSchema>;

export const GetTokenHistoryPriceSchema = z.object({
    address: z.string().describe("Token contract address"),
    address_type: z.enum(["token", "pair"]).default("token").describe("Address type"),
    type: z
        .enum(["1m", "3m", "15m", "30m", "1H", "2H", "4H", "6H", "8H", "12H", "1D", "3D", "1W", "1M"])
        .describe("Time interval"),
    time_from: z.number().optional().describe("Unix timestamp"),
    time_to: z.number().optional().describe("Unix timestamp"),
    chain: chainSchema,
});

export type GetTokenHistoryPriceParams = z.infer<typeof GetTokenHistoryPriceSchema>;

export const GetOhlcvSchema = z.object({
    address: z.string().describe("Token contract address"),
    type: z.enum(["1H", "4H", "12H", "1D", "1W", "1M"]).describe("Time interval"),
    time_from: z.number().optional().describe("Unix timestamp"),
    time_to: z.number().optional().describe("Unix timestamp"),
    chain: chainSchema,
});

export type GetOhlcvParams = z.infer<typeof GetOhlcvSchema>;

export const GetOhlcvPairSchema = z.object({
    pair_address: z.string().describe("Pair contract address"),
    type: z.enum(["1H", "4H", "12H", "1D", "1W", "1M"]).describe("Time interval"),
    limit: z.number().optional().describe("Number of data points to return"),
    chain: chainSchema,
});

export type GetOhlcvPairParams = z.infer<typeof GetOhlcvPairSchema>;

export const GetTokenSecuritySchema = z.object({
    address: z.string().describe("Token contract address"),
    chain: chainSchema,
});

export type GetTokenSecurityParams = z.infer<typeof GetTokenSecuritySchema>;

export const GetTrendingTokensSchema = z.object({
    chain: chainSchema,
    sort_by: z.enum(["rank", "volume24hUSD", "liquidity"]).describe("Sort by"),
    sort_type: z.enum(["asc", "desc"]).describe("Sort type"),
    offset: z.number().optional().describe("Offset"),
    limit: z.number().optional().describe("Limit"),
});

export type GetTrendingTokensParams = z.infer<typeof GetTrendingTokensSchema>;

export const SearchTokenSchema = z.object({
    keyword: z.string().describe("Search query"),
    chain: chainSchema,
    sort_by: z
        .enum([
            "fdv",
            "marketcap",
            "liquidity",
            "price",
            "price_change_24h_percent",
            "trade_24h",
            "trade_24h_change_percent",
            "buy_24h",
            "buy_24h_change_percent",
            "sell_24h",
            "sell_24h_change_percent",
            "unique_wallet_24h",
            "unique_wallet_24h_change_percent",
            "last_trade_unix_time",
            "volume_24h_usd",
            "volume_24h_change_percent",
        ])
        .describe("Sort by"),
    sort_type: z.enum(["asc", "desc"]).describe("Sort type"),
    verify_token: z
        .boolean()
        .optional()
        .describe("A filter to retrieve tokens based on their verification status (supported on Solana)"),
    markets: z
        .array(
            z.enum([
                "Raydium",
                "Raydium CP",
                "Raydium Clamm",
                "Meteora",
                "Meteora DLMM",
                "Fluxbeam",
                "Pump.fun",
                "OpenBook",
                "OpenBook V2",
                "Orca",
            ]),
        )
        .optional()
        .describe("list of market sources to filter results (supported on Solana)"),
    offset: z.number().optional().describe("Offset"),
    limit: z.number().optional().describe("Limit"),
});

export type SearchTokenParams = z.infer<typeof SearchTokenSchema>;
