import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import * as tools from "../tools/coingecko";
import {
    GetCoinPricesSchema,
    SearchCoinsSchema,
    GetCoinPriceByContractAddressSchema,
    GetCoinDataSchema,
    GetHistoricalDataSchema,
    GetOHLCSchema,
    GetTrendingCoinCategoriesSchema
} from "../types";

export const getTrendingCoinsAction: Action<EvmWalletBase> = {
    name: "COINGECKO_TRENDING_COINS",
    similes: [
        "get trending coins",
        "show popular cryptocurrencies",
        "list top trending coins",
        "trending crypto assets",
        "most popular coins right now"
    ],
    description: "Get the list of trending coins from CoinGecko",
    examples: [
        [
            {
                input: {},
                output: {
                    status: "success",
                    data: {
                        coins: [
                            {
                                item: {
                                    id: "bitcoin",
                                    coin_id: 1,
                                    name: "Bitcoin",
                                    symbol: "BTC",
                                    market_cap_rank: 1
                                }
                            }
                        ]
                    }
                },
                explanation: "Retrieve the current list of trending coins from CoinGecko"
            }
        ]
    ],
    schema: z.object({}),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getTrendingCoins({ agent });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const getCoinPricesAction: Action<EvmWalletBase> = {
    name: "COINGECKO_COIN_PRICES",
    similes: [
        "get cryptocurrency prices",
        "check coin prices",
        "get token prices",
        "cryptocurrency price check",
        "token price lookup"
    ],
    description: "Get the prices of specific coins from CoinGecko",
    examples: [
        [
            {
                input: {
                    coinIds: ["bitcoin", "ethereum"],
                    vsCurrency: "usd",
                    includeMarketCap: true
                },
                output: {
                    status: "success",
                    data: {
                        "bitcoin": {
                            "usd": 50000,
                            "usd_market_cap": 950000000000
                        },
                        "ethereum": {
                            "usd": 3000,
                            "usd_market_cap": 350000000000
                        }
                    }
                },
                explanation: "Get the price of Bitcoin and Ethereum in USD with market cap data"
            }
        ]
    ],
    schema: GetCoinPricesSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getCoinPrices({
                agent,
                coinIds: input.coinIds,
                vsCurrency: input.vsCurrency,
                includeMarketCap: input.includeMarketCap,
                include24hrVol: input.include24hrVol,
                include24hrChange: input.include24hrChange,
                includeLastUpdatedAt: input.includeLastUpdatedAt
            });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const searchCoinsAction: Action<EvmWalletBase> = {
    name: "COINGECKO_SEARCH_COINS",
    similes: [
        "search for cryptocurrencies",
        "find coins by name",
        "search crypto tokens",
        "look up coins",
        "find cryptocurrency by keyword"
    ],
    description: "Search for coins by keyword on CoinGecko",
    examples: [
        [
            {
                input: {
                    query: "bitcoin"
                },
                output: {
                    status: "success",
                    data: {
                        coins: [
                            {
                                id: "bitcoin",
                                name: "Bitcoin",
                                symbol: "BTC",
                                market_cap_rank: 1
                            }
                        ]
                    }
                },
                explanation: "Search for coins related to 'bitcoin'"
            }
        ]
    ],
    schema: SearchCoinsSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.searchCoins({
                agent,
                query: input.query
            });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const getCoinPriceByContractAddressAction: Action<EvmWalletBase> = {
    name: "COINGECKO_COIN_PRICE_BY_CONTRACT",
    similes: [
        "get token price by contract",
        "check price of token contract",
        "get ERC20 token price",
        "check price for contract address",
        "get price data for token contract"
    ],
    description: "Get coin price by contract address on CoinGecko",
    examples: [
        [
            {
                input: {
                    id: "ethereum",
                    contractAddresses: ["0xdac17f958d2ee523a2206206994597c13d831ec7"],
                    vsCurrency: "usd"
                },
                output: {
                    status: "success",
                    data: {
                        "0xdac17f958d2ee523a2206206994597c13d831ec7": {
                            "usd": 1.0
                        }
                    }
                },
                explanation: "Get the price of USDT (Tether) on Ethereum in USD"
            }
        ]
    ],
    schema: GetCoinPriceByContractAddressSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getCoinPriceByContractAddress({
                agent,
                id: input.id,
                contractAddresses: input.contractAddresses,
                vsCurrency: input.vsCurrency,
                includeMarketCap: input.includeMarketCap,
                include24hrVol: input.include24hrVol,
                include24hrChange: input.include24hrChange,
                includeLastUpdatedAt: input.includeLastUpdatedAt
            });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const getCoinDataAction: Action<EvmWalletBase> = {
    name: "COINGECKO_COIN_DATA",
    similes: [
        "get detailed coin information",
        "retrieve token data",
        "get comprehensive coin data",
        "get full cryptocurrency info",
        "detailed token information"
    ],
    description: "Get detailed coin data by ID on CoinGecko",
    examples: [
        [
            {
                input: {
                    id: "bitcoin",
                    marketData: true,
                    communityData: true
                },
                output: {
                    status: "success",
                    data: {
                        id: "bitcoin",
                        symbol: "btc",
                        name: "Bitcoin",
                        market_data: {
                            current_price: {
                                usd: 50000
                            }
                        }
                    }
                },
                explanation: "Get detailed data about Bitcoin including market and community data"
            }
        ]
    ],
    schema: GetCoinDataSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getCoinData({
                agent,
                id: input.id,
                localization: input.localization,
                tickers: input.tickers,
                marketData: input.marketData,
                communityData: input.communityData,
                developerData: input.developerData,
                sparkline: input.sparkline
            });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const getHistoricalDataAction: Action<EvmWalletBase> = {
    name: "COINGECKO_HISTORICAL_DATA",
    similes: [
        "get historical price data",
        "retrieve past coin prices",
        "check token price history",
        "get crypto price on specific date",
        "historical cryptocurrency data"
    ],
    description: "Get historical data for a coin by ID on CoinGecko",
    examples: [
        [
            {
                input: {
                    id: "bitcoin",
                    date: "30-12-2020"
                },
                output: {
                    status: "success",
                    data: {
                        id: "bitcoin",
                        symbol: "btc",
                        name: "Bitcoin",
                        market_data: {
                            current_price: {
                                usd: 29000
                            }
                        }
                    }
                },
                explanation: "Get Bitcoin price data from December 30, 2020"
            }
        ]
    ],
    schema: GetHistoricalDataSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getHistoricalData({
                agent,
                id: input.id,
                date: input.date,
                localization: input.localization
            });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const getOHLCDataAction: Action<EvmWalletBase> = {
    name: "COINGECKO_OHLC_DATA",
    similes: [
        "get OHLC crypto data",
        "retrieve candlestick data",
        "get open high low close data",
        "cryptocurrency candlestick chart",
        "OHLC price information"
    ],
    description: "Get OHLC chart data for a coin by ID on CoinGecko",
    examples: [
        [
            {
                input: {
                    id: "bitcoin",
                    vsCurrency: "usd",
                    days: 7
                },
                output: {
                    status: "success",
                    data: [
                        [1609459200000, 29000, 29300, 28800, 29100],
                        [1609545600000, 29100, 30000, 29000, 29800]
                    ]
                },
                explanation: "Get 7 days of OHLC data for Bitcoin in USD"
            }
        ]
    ],
    schema: GetOHLCSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getOHLCData({
                agent,
                id: input.id,
                vsCurrency: input.vsCurrency,
                days: input.days
            });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const getTrendingCoinCategoriesAction: Action<EvmWalletBase> = {
    name: "COINGECKO_TRENDING_CATEGORIES",
    similes: [
        "get trending coin categories",
        "popular cryptocurrency categories",
        "trending token sectors",
        "hot crypto categories",
        "popular coin groups"
    ],
    description: "Get trending coin categories on CoinGecko",
    examples: [
        [
            {
                input: {
                    vsCurrency: "usd",
                    ids: ["bitcoin", "ethereum"],
                    category: "smart-contract-platform",
                    order: "market_cap_desc"
                },
                output: {
                    status: "success",
                    data: [
                        {
                            id: "ethereum",
                            symbol: "eth",
                            name: "Ethereum",
                            current_price: 3000
                        }
                    ]
                },
                explanation: "Get trending coin data for the smart contract platform category ordered by market cap"
            }
        ]
    ],
    schema: GetTrendingCoinCategoriesSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getTrendingCoinCategories({
                agent,
                vsCurrency: input.vsCurrency,
                ids: input.ids,
                category: input.category,
                order: input.order,
                perPage: input.perPage,
                page: input.page,
                sparkline: input.sparkline,
                priceChangePercentage: input.priceChangePercentage,
                locale: input.locale
            });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const getCoinCategoriesAction: Action<EvmWalletBase> = {
    name: "COINGECKO_COIN_CATEGORIES",
    similes: [
        "get all coin categories",
        "list cryptocurrency categories",
        "retrieve token categories",
        "get crypto market sectors",
        "list all crypto categories"
    ],
    description: "Get all coin categories from CoinGecko",
    examples: [
        [
            {
                input: {},
                output: {
                    status: "success",
                    data: [
                        {
                            id: "smart-contract-platform",
                            name: "Smart Contract Platform",
                            market_cap: 850000000000,
                            top_3_coins: [
                                "https://example.com/ethereum.png",
                                "https://example.com/solana.png"
                            ]
                        }
                    ]
                },
                explanation: "Get a list of all cryptocurrency categories"
            }
        ]
    ],
    schema: z.object({}),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getCoinCategories({ agent });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
}; 