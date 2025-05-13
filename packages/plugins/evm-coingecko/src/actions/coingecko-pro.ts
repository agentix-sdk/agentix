import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import * as tools from "../tools/coingecko-pro";
import {
    GetPoolDataByPoolAddressSchema,
    GetTrendingPoolsByNetworkSchema,
    GetTrendingPoolsSchema,
    TopGainersLosersSchema,
    GetTokenDataByTokenAddressSchema,
    GetTokensInfoByPoolAddressSchema
} from "../types";

export const getPoolDataByPoolAddressAction: Action<EvmWalletBase> = {
    name: "COINGECKO_POOL_DATA",
    similes: [
        "get liquidity pool data",
        "fetch pool information",
        "get DeFi pool details",
        "retrieve pool stats",
        "check pool data by address"
    ],
    description: "Get data for a specific pool by its address using CoinGecko Pro API",
    examples: [
        [
            {
                input: {
                    network: "eth",
                    addresses: ["0x8ae720a71622e824f576b4a8c03031066548a3b1"]
                },
                output: {
                    status: "success",
                    data: {
                        "0x8ae720a71622e824f576b4a8c03031066548a3b1": {
                            name: "USDC/ETH",
                            native_coin_symbol: "eth",
                            tvl: 25000000,
                            volume_24h: 5000000
                        }
                    }
                },
                explanation: "Get pool data for a USDC/ETH pool on Ethereum"
            }
        ]
    ],
    schema: GetPoolDataByPoolAddressSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getPoolDataByPoolAddress({
                agent,
                network: input.network,
                addresses: input.addresses
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

export const getTrendingPoolsAction: Action<EvmWalletBase> = {
    name: "COINGECKO_TRENDING_POOLS",
    similes: [
        "get popular liquidity pools",
        "top trading pools",
        "trending liquidity pools",
        "most active DeFi pools",
        "hot pools across networks"
    ],
    description: "Get trending pools across all networks using CoinGecko Pro API",
    examples: [
        [
            {
                input: {
                    include: ["base_token", "quote_token"],
                    page: 1,
                    duration: "24h"
                },
                output: {
                    status: "success",
                    data: {
                        pools: [
                            {
                                address: "0x8ae720a71622e824f576b4a8c03031066548a3b1",
                                base_token: {
                                    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                                    symbol: "USDC"
                                },
                                quote_token: {
                                    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                                    symbol: "WETH"
                                }
                            }
                        ]
                    }
                },
                explanation: "Get trending pools across all networks with token information for the last 24 hours"
            }
        ]
    ],
    schema: GetTrendingPoolsSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getTrendingPools({
                agent,
                include: input.include,
                page: input.page,
                duration: input.duration
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

export const getTrendingPoolsByNetworkAction: Action<EvmWalletBase> = {
    name: "COINGECKO_TRENDING_POOLS_BY_NETWORK",
    similes: [
        "get popular pools on network",
        "trending pools by chain",
        "top pools on specific network",
        "hot liquidity pools by blockchain",
        "most active pools on network"
    ],
    description: "Get trending pools for a specific network using CoinGecko Pro API",
    examples: [
        [
            {
                input: {
                    network: "eth"
                },
                output: {
                    status: "success",
                    data: {
                        pools: [
                            {
                                address: "0x8ae720a71622e824f576b4a8c03031066548a3b1",
                                name: "USDC/ETH",
                                tvl: 25000000,
                                volume_24h: 5000000
                            }
                        ]
                    }
                },
                explanation: "Get trending pools on the Ethereum network"
            }
        ]
    ],
    schema: GetTrendingPoolsByNetworkSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getTrendingPoolsByNetwork({
                agent,
                network: input.network
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

export const getTopGainersLosersAction: Action<EvmWalletBase> = {
    name: "COINGECKO_TOP_GAINERS_LOSERS",
    similes: [
        "get best and worst performing coins",
        "top gainers and losers crypto",
        "best and worst tokens by price change",
        "biggest price movers",
        "highest and lowest performing cryptocurrencies"
    ],
    description: "Get top gainers and losers for a specific duration using CoinGecko Pro API",
    examples: [
        [
            {
                input: {
                    vsCurrency: "usd",
                    duration: "24h",
                    topCoins: "1000"
                },
                output: {
                    status: "success",
                    data: {
                        top_gainers: [
                            {
                                id: "sample-token",
                                symbol: "SAMPLE",
                                name: "Sample Token",
                                price_change_percentage: 45.8
                            }
                        ],
                        top_losers: [
                            {
                                id: "example-coin",
                                symbol: "EXC",
                                name: "Example Coin",
                                price_change_percentage: -38.2
                            }
                        ]
                    }
                },
                explanation: "Get top gaining and losing coins in the past 24 hours from the top 1000 coins"
            }
        ]
    ],
    schema: TopGainersLosersSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getTopGainersLosers({
                agent,
                vsCurrency: input.vsCurrency,
                duration: input.duration,
                topCoins: input.topCoins
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

export const getTokenDataByTokenAddressAction: Action<EvmWalletBase> = {
    name: "COINGECKO_TOKEN_DATA",
    similes: [
        "get token data by address",
        "fetch token details",
        "token information by contract",
        "get token stats by address",
        "retrieve token details by contract address"
    ],
    description: "Get data for a specific token by its address using CoinGecko Pro API",
    examples: [
        [
            {
                input: {
                    network: "eth",
                    address: "0xdac17f958d2ee523a2206206994597c13d831ec7"
                },
                output: {
                    status: "success",
                    data: {
                        name: "Tether",
                        symbol: "USDT",
                        decimals: 6,
                        total_supply: "78982373865.307118",
                        blockchain_explorer_url: "https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7"
                    }
                },
                explanation: "Get token data for USDT on Ethereum"
            }
        ]
    ],
    schema: GetTokenDataByTokenAddressSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getTokenDataByTokenAddress({
                agent,
                network: input.network,
                address: input.address
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

export const getTokensInfoByPoolAddressAction: Action<EvmWalletBase> = {
    name: "COINGECKO_POOL_TOKENS",
    similes: [
        "get tokens in a pool",
        "fetch pool token information",
        "get liquidity pool tokens",
        "retrieve tokens from pool by address",
        "see tokens in a liquidity pool"
    ],
    description: "Get data for all tokens in a specific pool by its address using CoinGecko Pro API",
    examples: [
        [
            {
                input: {
                    network: "eth",
                    poolAddress: "0x8ae720a71622e824f576b4a8c03031066548a3b1"
                },
                output: {
                    status: "success",
                    data: {
                        tokens: [
                            {
                                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                                name: "USD Coin",
                                symbol: "USDC",
                                decimals: 6
                            },
                            {
                                address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                                name: "Wrapped Ether",
                                symbol: "WETH",
                                decimals: 18
                            }
                        ]
                    }
                },
                explanation: "Get token information for all tokens in a USDC/WETH pool on Ethereum"
            }
        ]
    ],
    schema: GetTokensInfoByPoolAddressSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const data = await tools.getTokensInfoByPoolAddress({
                agent,
                network: input.network,
                poolAddress: input.poolAddress
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