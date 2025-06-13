import { Action, EvmWalletBase, SolanaWalletBase } from "agentix";
import {
    getTokenPrice,
    getTokenHistoryPrice,
    getOhlcv,
    getOhlcvPair,
    getTokenSecurity,
    getTrendingTokens,
    searchToken,
} from "../tools/birdeye";
import {
    GetTokenPriceSchema,
    GetTokenHistoryPriceSchema,
    GetOhlcvSchema,
    GetOhlcvPairSchema,
    GetTokenSecuritySchema,
    GetTrendingTokensSchema,
    SearchTokenSchema,
} from "../types";

export const birdeyeGetTokenPriceAction: Action<EvmWalletBase | SolanaWalletBase> = {
    name: "BIRDEYE_GET_TOKEN_PRICE",
    similes: [
        "get token price on birdeye",
        "get token price via birdeye",
        "check token price using birdeye",
        "get multiple token prices",
        "fetch token price data"
    ],
    description: "Get price information for one or multiple tokens (max 100) using BirdEye API",
    examples: [
        [
            {
                input: {
                    list_address: ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"],
                    chain: "ethereum",
                    include_liquidity: true
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved token price",
                    data: {}
                },
                explanation: "Get price for WETH token on Ethereum with liquidity information",
            },
        ],
    ],
    schema: GetTokenPriceSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await getTokenPrice({
                agent: agent as any,
                list_address: input.list_address,
                chain: input.chain,
                include_liquidity: input.include_liquidity,
            });

            return {
                status: "success",
                message: `Successfully retrieved price for ${input.list_address.length} token(s)`,
                data: result,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const birdeyeGetTokenHistoryPriceAction: Action<EvmWalletBase | SolanaWalletBase> = {
    name: "BIRDEYE_GET_TOKEN_HISTORY_PRICE",
    similes: [
        "get token price history on birdeye",
        "get historical token price via birdeye",
        "check token price chart using birdeye",
        "get token price timeline",
        "fetch historical price data"
    ],
    description: "Get historical price line chart for a token using BirdEye API",
    examples: [
        [
            {
                input: {
                    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                    address_type: "token",
                    type: "1D",
                    chain: "ethereum"
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved token price history",
                    data: {}
                },
                explanation: "Get daily price history for WETH token on Ethereum",
            },
        ],
    ],
    schema: GetTokenHistoryPriceSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await getTokenHistoryPrice({
                agent: agent as any,
                address: input.address,
                address_type: input.address_type,
                type: input.type,
                time_from: input.time_from,
                time_to: input.time_to,
                chain: input.chain,
            });

            return {
                status: "success",
                message: "Successfully retrieved token price history",
                data: result,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const birdeyeGetOhlcvAction: Action<EvmWalletBase | SolanaWalletBase> = {
    name: "BIRDEYE_GET_OHLCV",
    similes: [
        "get ohlcv data on birdeye",
        "get candlestick data via birdeye",
        "check ohlcv using birdeye",
        "get token ohlcv chart",
        "fetch candlestick price data"
    ],
    description: "Get OHLCV (Open, High, Low, Close, Volume) price data for a token using BirdEye API",
    examples: [
        [
            {
                input: {
                    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                    type: "1D",
                    chain: "ethereum"
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved OHLCV data",
                    data: {}
                },
                explanation: "Get daily OHLCV data for WETH token on Ethereum",
            },
        ],
    ],
    schema: GetOhlcvSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await getOhlcv({
                agent: agent as any,
                address: input.address,
                type: input.type,
                time_from: input.time_from,
                time_to: input.time_to,
                chain: input.chain,
            });

            return {
                status: "success",
                message: "Successfully retrieved OHLCV data",
                data: result,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const birdeyeGetOhlcvPairAction: Action<EvmWalletBase | SolanaWalletBase> = {
    name: "BIRDEYE_GET_OHLCV_PAIR",
    similes: [
        "get pair ohlcv data on birdeye",
        "get pair candlestick data via birdeye",
        "check pair ohlcv using birdeye",
        "get pair ohlcv chart",
        "fetch pair candlestick data"
    ],
    description: "Get OHLCV (Open, High, Low, Close, Volume) price data for a trading pair using BirdEye API",
    examples: [
        [
            {
                input: {
                    pair_address: "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0",
                    type: "1D",
                    limit: 100,
                    chain: "ethereum"
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved pair OHLCV data",
                    data: {}
                },
                explanation: "Get daily OHLCV data for a trading pair on Ethereum",
            },
        ],
    ],
    schema: GetOhlcvPairSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await getOhlcvPair({
                agent: agent as any,
                pair_address: input.pair_address,
                type: input.type,
                limit: input.limit,
                chain: input.chain,
            });

            return {
                status: "success",
                message: "Successfully retrieved pair OHLCV data",
                data: result,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const birdeyeGetTokenSecurityAction: Action<EvmWalletBase | SolanaWalletBase> = {
    name: "BIRDEYE_GET_TOKEN_SECURITY",
    similes: [
        "get token security info on birdeye",
        "check token security via birdeye",
        "analyze token security using birdeye",
        "get token safety information",
        "fetch token security analysis"
    ],
    description: "Get security information and analysis for a token using BirdEye API",
    examples: [
        [
            {
                input: {
                    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                    chain: "ethereum"
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved token security information",
                    data: {}
                },
                explanation: "Get security analysis for WETH token on Ethereum",
            },
        ],
    ],
    schema: GetTokenSecuritySchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await getTokenSecurity({
                agent: agent as any,
                address: input.address,
                chain: input.chain,
            });

            return {
                status: "success",
                message: "Successfully retrieved token security information",
                data: result,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const birdeyeGetTrendingTokensAction: Action<EvmWalletBase | SolanaWalletBase> = {
    name: "BIRDEYE_GET_TRENDING_TOKENS",
    similes: [
        "get trending tokens on birdeye",
        "check trending tokens via birdeye",
        "find trending tokens using birdeye",
        "get popular tokens",
        "fetch trending token list"
    ],
    description: "Get trending tokens on a specific chain using BirdEye API",
    examples: [
        [
            {
                input: {
                    chain: "ethereum",
                    sort_by: "volume24hUSD",
                    sort_type: "desc",
                    limit: 20
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved trending tokens",
                    data: {}
                },
                explanation: "Get top 20 trending tokens on Ethereum sorted by 24h volume",
            },
        ],
    ],
    schema: GetTrendingTokensSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await getTrendingTokens({
                agent: agent as any,
                chain: input.chain,
                sort_by: input.sort_by,
                sort_type: input.sort_type,
                offset: input.offset,
                limit: input.limit,
            });

            return {
                status: "success",
                message: "Successfully retrieved trending tokens",
                data: result,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const birdeyeSearchTokenAction: Action<EvmWalletBase | SolanaWalletBase> = {
    name: "BIRDEYE_SEARCH_TOKEN",
    similes: [
        "search tokens on birdeye",
        "find tokens via birdeye",
        "lookup tokens using birdeye",
        "search for token",
        "find token by name"
    ],
    description: "Search for tokens by keyword using BirdEye API",
    examples: [
        [
            {
                input: {
                    keyword: "ethereum",
                    chain: "ethereum",
                    sort_by: "volume_24h_usd",
                    sort_type: "desc",
                    limit: 10
                },
                output: {
                    status: "success",
                    message: "Successfully searched for tokens",
                    data: {}
                },
                explanation: "Search for tokens containing 'ethereum' keyword on Ethereum chain",
            },
        ],
    ],
    schema: SearchTokenSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await searchToken({
                agent: agent as any,
                keyword: input.keyword,
                chain: input.chain,
                sort_by: input.sort_by,
                sort_type: input.sort_type,
                verify_token: input.verify_token,
                markets: input.markets,
                offset: input.offset,
                limit: input.limit,
            });

            return {
                status: "success",
                message: `Successfully searched for tokens with keyword: ${input.keyword}`,
                data: result,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 