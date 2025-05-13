import { Action, EvmWalletBase } from "agentix";
import * as tools from "../tools/coinmarketcap";
import {
    CryptocurrencyListingsSchema,
    CryptocurrencyQuotesLatestSchema,
    ExchangeListingsSchema,
    ExchangeQuotesLatestSchema,
    ContentLatestSchema,
    CryptocurrencyMapSchema,
    CryptocurrencyOHLCVLatestSchema,
    CryptocurrencyTrendingLatestSchema,
    CryptocurrencyTrendingMostVisitedSchema,
    CryptocurrencyTrendingGainersLosersSchema
} from "../types";

export const getCryptocurrencyListingsAction: Action<EvmWalletBase> = {
    name: "COINMARKETCAP_LISTINGS",
    similes: [
        "get cryptocurrency listings",
        "list top cryptocurrencies",
        "get coin rankings",
        "view crypto market data",
        "check cryptocurrency leaderboard"
    ],
    description: "Fetch the latest cryptocurrency listings with market data including price, market cap, volume, and other key metrics",
    examples: [
        [
            {
                input: {
                    limit: 10,
                    sort: "market_cap",
                    sort_dir: "desc",
                    convert: "USD"
                },
                output: {
                    status: "success",
                    data: [
                        {
                            id: 1,
                            name: "Bitcoin",
                            symbol: "BTC",
                            price: 50000,
                            market_cap: 950000000000,
                            percent_change_24h: 2.5
                        }
                    ]
                },
                explanation: "Get the top 10 cryptocurrencies by market cap with prices in USD"
            }
        ]
    ],
    schema: CryptocurrencyListingsSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getCryptocurrencyListings({
                agent,
                ...input
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

export const getCryptocurrencyQuotesAction: Action<EvmWalletBase> = {
    name: "COINMARKETCAP_QUOTES",
    similes: [
        "get cryptocurrency prices",
        "check coin prices",
        "get token quotes",
        "cryptocurrency price check",
        "get current crypto values"
    ],
    description: "Get the latest market quotes for one or more cryptocurrencies, including price, market cap, and volume in any supported currency",
    examples: [
        [
            {
                input: {
                    symbol: ["BTC", "ETH"],
                    convert: "USD"
                },
                output: {
                    status: "success",
                    data: {
                        "BTC": {
                            name: "Bitcoin",
                            symbol: "BTC",
                            quote: {
                                USD: {
                                    price: 50000,
                                    market_cap: 950000000000,
                                    percent_change_24h: 2.5
                                }
                            }
                        },
                        "ETH": {
                            name: "Ethereum",
                            symbol: "ETH",
                            quote: {
                                USD: {
                                    price: 3000,
                                    market_cap: 350000000000,
                                    percent_change_24h: 1.8
                                }
                            }
                        }
                    }
                },
                explanation: "Get price quotes for Bitcoin and Ethereum in USD"
            }
        ]
    ],
    schema: CryptocurrencyQuotesLatestSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getCryptocurrencyQuotes({
                agent,
                ...input
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

export const getExchangeListingsAction: Action<EvmWalletBase> = {
    name: "COINMARKETCAP_EXCHANGE_LISTINGS",
    similes: [
        "get exchange listings",
        "list cryptocurrency exchanges",
        "view top exchanges",
        "exchange rankings",
        "get exchange market data"
    ],
    description: "Fetch the latest cryptocurrency exchange listings with market data including trading volume, number of markets, and liquidity metrics",
    examples: [
        [
            {
                input: {
                    limit: 10,
                    sort: "volume_24h",
                    market_type: "spot"
                },
                output: {
                    status: "success",
                    data: [
                        {
                            id: 270,
                            name: "Binance",
                            volume_24h: 20000000000,
                            num_market_pairs: 1500
                        }
                    ]
                },
                explanation: "Get the top 10 spot exchanges sorted by 24-hour trading volume"
            }
        ]
    ],
    schema: ExchangeListingsSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getExchangeListings({
                agent,
                ...input
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

export const getExchangeQuotesAction: Action<EvmWalletBase> = {
    name: "COINMARKETCAP_EXCHANGE_QUOTES",
    similes: [
        "get exchange data",
        "check exchange metrics",
        "exchange information",
        "exchange stats",
        "exchange volume details"
    ],
    description: "Get the latest market data for one or more exchanges including trading volume, number of markets, and other exchange-specific metrics",
    examples: [
        [
            {
                input: {
                    slug: ["binance", "coinbase"],
                    convert: "USD"
                },
                output: {
                    status: "success",
                    data: {
                        "binance": {
                            name: "Binance",
                            volume_24h: 20000000000,
                            num_market_pairs: 1500
                        },
                        "coinbase": {
                            name: "Coinbase Exchange",
                            volume_24h: 5000000000,
                            num_market_pairs: 500
                        }
                    }
                },
                explanation: "Get market data for Binance and Coinbase exchanges with values in USD"
            }
        ]
    ],
    schema: ExchangeQuotesLatestSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getExchangeQuotes({
                agent,
                ...input
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

export const getContentAction: Action<EvmWalletBase> = {
    name: "COINMARKETCAP_CONTENT",
    similes: [
        "get crypto news",
        "cryptocurrency articles",
        "crypto market news",
        "blockchain news",
        "latest crypto content"
    ],
    description: "Fetch the latest cryptocurrency news, articles, and market analysis content from trusted sources",
    examples: [
        [
            {
                input: {
                    limit: 5,
                    news_type: "news",
                    content_type: "all",
                    language: "en"
                },
                output: {
                    status: "success",
                    data: [
                        {
                            id: 12345,
                            title: "Bitcoin Breaks $50K: What's Next?",
                            url: "https://example.com/article-1",
                            published_at: "2023-06-15T10:30:00Z"
                        }
                    ]
                },
                explanation: "Get the 5 latest cryptocurrency news articles in English"
            }
        ]
    ],
    schema: ContentLatestSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getContent({
                agent,
                ...input
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

export const getCryptocurrencyMapAction: Action<EvmWalletBase> = {
    name: "COINMARKETCAP_MAP",
    similes: [
        "get cryptocurrency IDs",
        "map of crypto tokens",
        "find token ID",
        "list of cryptocurrency identifiers",
        "crypto token directory"
    ],
    description: "Get a mapping of all cryptocurrencies with unique CoinMarketCap IDs, including active and inactive assets",
    examples: [
        [
            {
                input: {
                    listing_status: "active",
                    limit: 10,
                    symbol: ["BTC", "ETH"]
                },
                output: {
                    status: "success",
                    data: [
                        {
                            id: 1,
                            name: "Bitcoin",
                            symbol: "BTC",
                            is_active: 1
                        },
                        {
                            id: 1027,
                            name: "Ethereum",
                            symbol: "ETH",
                            is_active: 1
                        }
                    ]
                },
                explanation: "Get the CoinMarketCap IDs for Bitcoin and Ethereum tokens"
            }
        ]
    ],
    schema: CryptocurrencyMapSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getCryptocurrencyMap({
                agent,
                ...input
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

export const getCryptocurrencyOHLCVAction: Action<EvmWalletBase> = {
    name: "COINMARKETCAP_OHLCV",
    similes: [
        "get OHLCV data",
        "cryptocurrency price candlesticks",
        "crypto open high low close volume",
        "price chart data",
        "trading data for crypto"
    ],
    description: "Get the latest OHLCV (Open, High, Low, Close, Volume) values for cryptocurrencies",
    examples: [
        [
            {
                input: {
                    symbol: ["BTC"],
                    convert: "USD"
                },
                output: {
                    status: "success",
                    data: {
                        "BTC": [
                            {
                                time_open: "2023-06-15T00:00:00Z",
                                time_close: "2023-06-15T23:59:59Z",
                                quote: {
                                    USD: {
                                        open: 49000,
                                        high: 51000,
                                        low: 48500,
                                        close: 50000,
                                        volume: 30000000000
                                    }
                                }
                            }
                        ]
                    }
                },
                explanation: "Get the latest OHLCV data for Bitcoin in USD"
            }
        ]
    ],
    schema: CryptocurrencyOHLCVLatestSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getCryptocurrencyOHLCV({
                agent,
                ...input
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

export const getCryptocurrencyTrendingAction: Action<EvmWalletBase> = {
    name: "COINMARKETCAP_TRENDING",
    similes: [
        "get trending cryptocurrencies",
        "popular crypto assets",
        "trending tokens",
        "hot cryptocurrencies",
        "trending crypto list"
    ],
    description: "Get the latest trending cryptocurrencies based on CoinMarketCap user activity",
    examples: [
        [
            {
                input: {
                    limit: 10,
                    time_period: "24h",
                    convert: "USD"
                },
                output: {
                    status: "success",
                    data: [
                        {
                            id: 1,
                            name: "Bitcoin",
                            symbol: "BTC",
                            score: 0.95
                        }
                    ]
                },
                explanation: "Get the top 10 trending cryptocurrencies over the last 24 hours with prices in USD"
            }
        ]
    ],
    schema: CryptocurrencyTrendingLatestSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getCryptocurrencyTrending({
                agent,
                ...input
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

export const getCryptocurrencyMostVisitedAction: Action<EvmWalletBase> = {
    name: "COINMARKETCAP_MOST_VISITED",
    similes: [
        "most viewed cryptocurrencies",
        "popular coin pages",
        "most visited crypto",
        "most viewed tokens",
        "most popular cryptocurrency pages"
    ],
    description: "Get the most visited cryptocurrencies on CoinMarketCap over a specified time period",
    examples: [
        [
            {
                input: {
                    limit: 10,
                    time_period: "24h",
                    convert: "USD"
                },
                output: {
                    status: "success",
                    data: [
                        {
                            id: 1,
                            name: "Bitcoin",
                            symbol: "BTC",
                            views: 1500000
                        }
                    ]
                },
                explanation: "Get the top 10 most visited cryptocurrency pages over the last 24 hours with prices in USD"
            }
        ]
    ],
    schema: CryptocurrencyTrendingMostVisitedSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getCryptocurrencyMostVisited({
                agent,
                ...input
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

export const getCryptocurrencyGainersLosersAction: Action<EvmWalletBase> = {
    name: "COINMARKETCAP_GAINERS_LOSERS",
    similes: [
        "best performing cryptocurrencies",
        "worst performing cryptocurrencies",
        "top gainers and losers",
        "biggest crypto movers",
        "coins with biggest price changes"
    ],
    description: "Get the top gaining and losing cryptocurrencies based on price changes over different time periods",
    examples: [
        [
            {
                input: {
                    limit: 10,
                    time_period: "24h",
                    convert: "USD",
                    sort_dir: "desc"
                },
                output: {
                    status: "success",
                    data: {
                        gainers: [
                            {
                                id: 12345,
                                name: "Sample Token",
                                symbol: "SAMPLE",
                                percent_change_24h: 45.8
                            }
                        ],
                        losers: [
                            {
                                id: 67890,
                                name: "Example Coin",
                                symbol: "EXC",
                                percent_change_24h: -38.2
                            }
                        ]
                    }
                },
                explanation: "Get the top 10 gainers and losers over the last 24 hours with prices in USD"
            }
        ]
    ],
    schema: CryptocurrencyTrendingGainersLosersSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getCryptocurrencyGainersLosers({
                agent,
                ...input
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